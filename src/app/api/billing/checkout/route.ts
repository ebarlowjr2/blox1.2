import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { withTenant, ApiRequest } from "@/lib/api-middleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

/**
 * Create a Stripe checkout session for tenant subscription
 */
export const POST = withTenant(async (req: ApiRequest) => {
  try {
    const { tenantId, userId } = req.ctx!;
    const body = await req.json();
    const { priceId, mode = "subscription" } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode as "subscription" | "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
      metadata: {
        tenant_id: tenantId,
        user_id: userId,
      },
      client_reference_id: tenantId,
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
