import { NextRequest, NextResponse } from 'next/server';
import { withTenant, ApiRequest, q } from '@/lib/api-middleware';
import { createSupabaseServer } from '@/lib/supabase-server';

const AGENT_COLORS: Record<string, string> = {
  CEO: "bg-purple-500",
  Marketing: "bg-sky-500",
  Content: "bg-violet-500",
  Admin: "bg-emerald-500",
  Finance: "bg-green-600",
  Cyber: "bg-rose-500",
  Tech: "bg-indigo-500",
  Social: "bg-pink-500",
};

const AGENT_SUBTITLES: Record<string, string> = {
  CEO: "Chief Executive Operations",
  Marketing: "Marketing, Automation, Research & Knowledge",
  Content: "Creative Output & Rendering Yield",
  Admin: "Administrative Logistics Executive",
  Finance: "Financial Insights & Transactions",
  Cyber: "Cybersecurity Response & Analysis",
  Tech: "Technical Operations & Network Yield",
  Social: "Social Automation & Growth Engine",
};

export const GET = withTenant(async (req: ApiRequest) => {
  try {
    const { tenantId } = req.ctx!;
    const supabase = await createSupabaseServer();

    const { data: agents, error: agentsError } = await q(supabase, "agents", req.ctx!)
      .select(`
        id,
        kind,
        name,
        status,
        created_at,
        updated_at
      `)
      .order('kind', { ascending: true });

    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
      return NextResponse.json({ 
        error: 'Failed to fetch agent data',
        details: agentsError.message
      }, { status: 500 });
    }

    const agentsWithTools = await Promise.all(
      (agents || []).map(async (agent) => {
        const { data: tools } = await supabase
          .from("agent_tools")
          .select("tool_key, status")
          .eq("tenant_id", tenantId)
          .eq("agent_id", agent.id);

        const { data: recentActivity } = await supabase
          .from("activity_log")
          .select("created_at")
          .eq("tenant_id", tenantId)
          .eq("agent_id", agent.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const { count: tasksCompleted } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenantId)
          .eq("agent_id", agent.id)
          .eq("status", "completed");

        let lastActivity = "Never";
        if (recentActivity?.created_at) {
          const activityDate = new Date(recentActivity.created_at);
          const now = new Date();
          const diffMs = now.getTime() - activityDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          
          if (diffMins < 60) {
            lastActivity = `${diffMins}m ago`;
          } else if (diffMins < 1440) {
            lastActivity = `${Math.floor(diffMins / 60)}h ago`;
          } else {
            lastActivity = `${Math.floor(diffMins / 1440)}d ago`;
          }
        }

        return {
          key: agent.kind,
          name: agent.name,
          subtitle: AGENT_SUBTITLES[agent.kind] || agent.kind,
          color: AGENT_COLORS[agent.kind] || "bg-gray-500",
          status: agent.status,
          tools: (tools || []).map(t => t.tool_key),
          lastActivity,
          tasksCompleted: tasksCompleted || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        agents: agentsWithTools,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Dashboard agents API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch agent data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
