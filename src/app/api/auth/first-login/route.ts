import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { cookies } from "next/headers";

/**
 * First-login handler that creates a tenant and membership for new users
 * This should be called after successful authentication
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

    const { data: existingMembership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (existingMembership) {
      return NextResponse.json({
        success: true,
        message: "User already has tenant access",
        tenantId: existingMembership.tenant_id,
      });
    }

    const companyName = user.email?.split("@")[0] || "My Company";
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: `${companyName}'s Organization`,
        owner_user_id: user.id,
        plan: "free",
        status: "provisioning",
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      console.error("Error creating tenant:", tenantError);
      return NextResponse.json(
        { error: "Failed to create tenant" },
        { status: 500 }
      );
    }

    const { error: membershipError } = await supabase
      .from("tenant_members")
      .insert({
        tenant_id: tenant.id,
        user_id: user.id,
        role: "owner",
      });

    if (membershipError) {
      console.error("Error creating membership:", membershipError);
      return NextResponse.json(
        { error: "Failed to create membership" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("active_tenant_id", tenant.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/provision-tenant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenant.id }),
      });
    } catch (error) {
      console.error("Error triggering provisioning:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Tenant created successfully",
      tenantId: tenant.id,
      redirectTo: "/onboarding",
    });
  } catch (error) {
    console.error("First-login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET handler to check if user needs first-login setup
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { needsSetup: false, authenticated: false },
        { status: 200 }
      );
    }

    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    return NextResponse.json({
      needsSetup: !membership,
      authenticated: true,
      userId: user.id,
    });
  } catch (error) {
    console.error("First-login check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
