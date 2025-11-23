import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

/**
 * Test endpoint for CrewAI integration
 * Forwards requests to the Python crew service
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!membership?.tenant_id) {
      return NextResponse.json(
        { error: "No tenant found for user" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const crewServiceUrl = process.env.CREW_SERVICE_URL || "http://localhost:8001";
    const response = await fetch(`${crewServiceUrl}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenantId: membership.tenant_id,
        actorUserId: user.id,
        message,
        channel: "web",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Crew service error:", error);
      return NextResponse.json(
        { error: "Crew service error", details: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Crew test error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
