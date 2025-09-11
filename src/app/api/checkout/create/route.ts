import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { priceId, tenantId, userSub, email, billingInterval = 'month' } = await request.json();
    
    if (!priceId || !tenantId || !userSub || !email) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    const customerId = customer?.id || (await stripe.customers.create({ email })).id;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: tenantId,
      success_url: `${request.nextUrl.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/billing/cancel`,
      metadata: {
        tenant_id: tenantId,
        user_sub: userSub,
        plan: 'pro',
        interval: billingInterval
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
  }
}
