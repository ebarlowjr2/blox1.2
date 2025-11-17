import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe webhook handler for subscription events
 * Handles checkout.session.completed and customer.subscription.deleted
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenant_id;
        const customerId = session.customer as string;

        if (!tenantId) {
          console.error("No tenant_id in checkout session metadata");
          break;
        }

        const { error: updateError } = await supabase
          .from("tenants")
          .update({
            stripe_customer_id: customerId,
            plan: "pro",
          })
          .eq("id", tenantId);

        if (updateError) {
          console.error("Error updating tenant:", updateError);
          break;
        }

        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/provision-tenant`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenantId }),
          });
        } catch (error) {
          console.error("Error triggering provisioning:", error);
        }

        console.log(`Tenant ${tenantId} upgraded to pro plan`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error: downgradeError } = await supabase
          .from("tenants")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);

        if (downgradeError) {
          console.error("Error downgrading tenant:", downgradeError);
          break;
        }

        console.log(`Tenant with customer ${customerId} downgraded to free plan`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        if (status === "active") {
          await supabase
            .from("tenants")
            .update({ plan: "pro" })
            .eq("stripe_customer_id", customerId);
        } else if (status === "canceled" || status === "unpaid") {
          await supabase
            .from("tenants")
            .update({ plan: "free" })
            .eq("stripe_customer_id", customerId);
        }

        console.log(`Subscription updated for customer ${customerId}: ${status}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log(`Payment failed for customer ${customerId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error: "Webhook handler failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
