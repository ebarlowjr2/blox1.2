import { NextRequest, NextResponse } from 'next/server';
import { withTenant, ApiRequest, q } from '@/lib/api-middleware';
import { createSupabaseServer } from '@/lib/supabase-server';

const ACTION_ICONS: Record<string, string> = {
  'sent outreach emails': 'Mail',
  'closed security incident': 'ShieldCheck',
  'scheduled team meeting': 'Calendar',
  'merged PR': 'Github',
  'processed financial data': 'DollarSign',
  'generated creative assets': 'Image',
  'updated HR records': 'Users',
  'posted social media content': 'Share',
  'tenant_provisioned': 'Settings',
  'agent_created': 'Bot',
  'task_completed': 'CheckCircle',
  'message_sent': 'MessageSquare',
};

export const GET = withTenant(async (req: ApiRequest) => {
  try {
    const { tenantId } = req.ctx!;
    const supabase = await createSupabaseServer();

    const { data: activities, error: activitiesError } = await supabase
      .from("activity_log")
      .select(`
        id,
        action,
        created_at,
        agents(name)
      `)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      return NextResponse.json({ 
        error: 'Failed to fetch activity data',
        details: activitiesError.message
      }, { status: 500 });
    }

    const recentActivity = (activities || []).map((activity, index) => {
      const activityDate = new Date(activity.created_at);
      const now = new Date();
      const diffMs = now.getTime() - activityDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      let time = '';
      if (diffMins < 60) {
        time = `${diffMins}m ago`;
      } else if (diffMins < 1440) {
        time = `${Math.floor(diffMins / 60)}h ago`;
      } else {
        time = `${Math.floor(diffMins / 1440)}d ago`;
      }

      const agentName = (activity.agents as any)?.name || 'System';
      const action = activity.action.replace(/_/g, ' ');

      return {
        id: activity.id,
        title: `${agentName} ${action}`,
        time,
        icon: ACTION_ICONS[activity.action] || 'Activity',
        status: 'success',
        agent: agentName,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        recentActivity,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Dashboard activity API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch activity data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
