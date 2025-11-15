import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getTenantContext, TenantContext } from "@/lib/tenant";

export interface ApiRequest extends NextRequest {
  ctx?: TenantContext;
}

export type ApiHandler = (
  req: ApiRequest,
  context?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware wrapper that enforces tenant scoping for API routes
 * Adds tenant context to the request object
 * Returns 403 if user is not authenticated or has no tenant access
 */
export function withTenant(handler: ApiHandler): ApiHandler {
  return async (req: ApiRequest, context?: any) => {
    try {
      const tenantContext = await getTenantContext();

      if (!tenantContext) {
        return NextResponse.json(
          { error: "Forbidden: No tenant access" },
          { status: 403 }
        );
      }

      req.ctx = tenantContext;

      return await handler(req, context);
    } catch (error) {
      console.error("withTenant middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware wrapper that requires admin role (owner or admin)
 */
export function withAdmin(handler: ApiHandler): ApiHandler {
  return withTenant(async (req: ApiRequest, context?: any) => {
    if (!req.ctx) {
      return NextResponse.json(
        { error: "Forbidden: No tenant access" },
        { status: 403 }
      );
    }

    if (req.ctx.role !== "owner" && req.ctx.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    return await handler(req, context);
  });
}

/**
 * Middleware wrapper that requires owner role
 */
export function withOwner(handler: ApiHandler): ApiHandler {
  return withTenant(async (req: ApiRequest, context?: any) => {
    if (!req.ctx) {
      return NextResponse.json(
        { error: "Forbidden: No tenant access" },
        { status: 403 }
      );
    }

    if (req.ctx.role !== "owner") {
      return NextResponse.json(
        { error: "Forbidden: Owner access required" },
        { status: 403 }
      );
    }

    return await handler(req, context);
  });
}

/**
 * Helper to get Supabase client with tenant context
 * Automatically scopes queries to the current tenant
 */
export async function getSupabaseWithContext() {
  const supabase = await createSupabaseServer();
  const context = await getTenantContext();
  
  return { supabase, context };
}

/**
 * Database query helper that automatically scopes to tenant
 * Usage: const agents = await q(supabase, "agents", ctx).select("*")
 */
export function q(
  supabase: any,
  table: string,
  ctx: TenantContext
) {
  return supabase.from(table).eq("tenant_id", ctx.tenantId);
}

/**
 * Log activity for audit trail
 */
export async function logActivity(
  tenantId: string,
  action: string,
  options: {
    agentId?: string;
    userId?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, any>;
  } = {}
) {
  try {
    const supabase = await createSupabaseServer();
    await supabase.from("activity_log").insert({
      tenant_id: tenantId,
      agent_id: options.agentId || null,
      user_id: options.userId || null,
      action,
      entity_type: options.entityType || null,
      entity_id: options.entityId || null,
      metadata: options.metadata || {},
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  tenantId: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const key = `tenant:${tenantId}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Middleware wrapper that enforces rate limiting per tenant
 */
export function withRateLimit(
  handler: ApiHandler,
  limit: number = 100,
  windowMs: number = 60000
): ApiHandler {
  return withTenant(async (req: ApiRequest, context?: any) => {
    if (!req.ctx) {
      return NextResponse.json(
        { error: "Forbidden: No tenant access" },
        { status: 403 }
      );
    }

    if (!checkRateLimit(req.ctx.tenantId, limit, windowMs)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    return await handler(req, context);
  });
}
