import { cookies } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase-server";

export interface TenantContext {
  tenantId: string;
  userId: string;
  role?: string;
}

/**
 * Get the current tenant context from the session
 * This is the single source of truth for tenant resolution
 * 
 * Resolution order:
 * 1. Check active_tenant_id cookie (user's selected tenant)
 * 2. Fallback to first tenant the user belongs to (ordered by ownership, then creation date)
 * 
 * @returns TenantContext or null if user is not authenticated or has no tenants
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return null;
    }

    const cookieStore = await cookies();
    const activeTenantId = cookieStore.get("active_tenant_id")?.value;

    if (activeTenantId) {
      const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id, role")
        .eq("tenant_id", activeTenantId)
        .eq("user_id", user.id)
        .single();

      if (membership) {
        return {
          tenantId: membership.tenant_id,
          userId: user.id,
          role: membership.role,
        };
      }
    }

    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id, role, tenants!inner(created_at)")
      .eq("user_id", user.id)
      .order("role", { ascending: true }) // owner < admin < member
      .limit(1)
      .single();

    if (!membership) {
      return null;
    }

    return {
      tenantId: membership.tenant_id,
      userId: user.id,
      role: membership.role,
    };
  } catch (error) {
    console.error("Error getting tenant context:", error);
    return null;
  }
}

/**
 * Get all tenants the current user belongs to
 * Useful for tenant switcher UI
 */
export async function getUserTenants() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return [];
    }

    const { data: memberships } = await supabase
      .from("tenant_members")
      .select(`
        tenant_id,
        role,
        tenants!inner(
          id,
          name,
          plan,
          status,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("role", { ascending: true });

    return memberships?.map(m => ({
      id: m.tenant_id,
      name: (m.tenants as any).name,
      plan: (m.tenants as any).plan,
      status: (m.tenants as any).status,
      role: m.role,
      created_at: (m.tenants as any).created_at,
    })) || [];
  } catch (error) {
    console.error("Error getting user tenants:", error);
    return [];
  }
}

/**
 * Set the active tenant for the current user
 * Updates the active_tenant_id cookie
 */
export async function setActiveTenant(tenantId: string) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("tenant_id", tenantId)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      throw new Error("User does not have access to this tenant");
    }

    const cookieStore = await cookies();
    cookieStore.set("active_tenant_id", tenantId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return true;
  } catch (error) {
    console.error("Error setting active tenant:", error);
    throw error;
  }
}

/**
 * Check if the current user has a specific role in their tenant
 */
export async function hasRole(role: "owner" | "admin" | "member"): Promise<boolean> {
  const context = await getTenantContext();
  if (!context?.role) return false;

  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  const userRoleLevel = roleHierarchy[context.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[role];

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Check if the current user is an owner or admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}
