import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { putSecretIfMissing } from "@/lib/secrets";

const DEFAULT_AGENTS = [
  {
    kind: "CEO",
    name: "B.L.O.X CEO",
    tools: ["email", "sms"],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Marketing",
    name: "M.A.R.K.",
    tools: ["email", "drive", "crm"],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Content",
    name: "C.O.R.Y.",
    tools: ["drive"],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Admin",
    name: "A.L.E.X.",
    tools: [],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Finance",
    name: "F.I.N.T.",
    tools: [],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Cyber",
    name: "C.Y.R.A.",
    tools: [],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Tech",
    name: "T.O.N.Y.",
    tools: [],
    config: { policies: { data_scope: "tenant" } },
  },
  {
    kind: "Social",
    name: "S.A.G.E.",
    tools: ["social"],
    config: { policies: { data_scope: "tenant" } },
  },
];

/**
 * Provision a tenant with default agents and tools
 * This function is idempotent - it can be safely called multiple times
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id, status")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    const { data: existingAgents } = await supabase
      .from("agents")
      .select("id")
      .eq("tenant_id", tenantId)
      .limit(1);

    if (existingAgents && existingAgents.length > 0) {
      console.log(`Tenant ${tenantId} already provisioned`);
      
      if (tenant.status !== "ready") {
        await supabase
          .from("tenants")
          .update({ status: "ready" })
          .eq("id", tenantId);
      }

      return NextResponse.json({
        success: true,
        message: "Tenant already provisioned",
        tenantId,
      });
    }

    for (const agentConfig of DEFAULT_AGENTS) {
      const { data: agent, error: agentError } = await supabase
        .from("agents")
        .insert({
          tenant_id: tenantId,
          kind: agentConfig.kind,
          name: agentConfig.name,
          status: "offline",
          config: agentConfig.config,
        })
        .select()
        .single();

      if (agentError || !agent) {
        console.error(`Error creating agent ${agentConfig.name}:`, agentError);
        continue;
      }

      for (const toolKey of agentConfig.tools) {
        try {
          const secretArn = await putSecretIfMissing(
            `${tenantId}/tools/${toolKey}`,
            {}
          );

          const { error: toolError } = await supabase
            .from("agent_tools")
            .insert({
              tenant_id: tenantId,
              agent_id: agent.id,
              tool_key: toolKey,
              credentials_secret_arn: secretArn,
              status: "disconnected",
              config: {},
            });

          if (toolError) {
            console.error(`Error creating tool ${toolKey} for agent ${agent.name}:`, toolError);
          }
        } catch (error) {
          console.error(`Error setting up tool ${toolKey}:`, error);
        }
      }
    }

    try {
      await supabase.from("inbound_channels").insert({
        tenant_id: tenantId,
        kind: "email",
        address: `tenant-${tenantId}@bloxmail.com`,
        meta: { placeholder: true },
      });
    } catch (error) {
      console.error("Error creating inbound channel:", error);
    }

    await supabase
      .from("tenants")
      .update({ status: "ready" })
      .eq("id", tenantId);

    await supabase.from("activity_log").insert({
      tenant_id: tenantId,
      action: "tenant_provisioned",
      entity_type: "tenant",
      entity_id: tenantId,
      metadata: {
        agents_created: DEFAULT_AGENTS.length,
        timestamp: new Date().toISOString(),
      },
    });

    console.log(`Successfully provisioned tenant ${tenantId}`);

    return NextResponse.json({
      success: true,
      message: "Tenant provisioned successfully",
      tenantId,
      agentsCreated: DEFAULT_AGENTS.length,
    });
  } catch (error) {
    console.error("Provisioning error:", error);
    return NextResponse.json(
      {
        error: "Failed to provision tenant",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler to check provisioning status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    const { data: tenant } = await supabase
      .from("tenants")
      .select("status")
      .eq("id", tenantId)
      .single();

    const { count: agentCount } = await supabase
      .from("agents")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    return NextResponse.json({
      tenantId,
      status: tenant?.status || "unknown",
      agentsProvisioned: agentCount || 0,
      isReady: tenant?.status === "ready",
    });
  } catch (error) {
    console.error("Provisioning status check error:", error);
    return NextResponse.json(
      { error: "Failed to check provisioning status" },
      { status: 500 }
    );
  }
}
