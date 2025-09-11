import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'stripe_not_configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { tenantId, email } = await request.json();
    
    if (!tenantId || !email) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    const customerId = customer?.id || (await stripe.customers.create({ email })).id;

    const response = await fetch(`${process.env.API_BASE}/api/billing/stripe-hook`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-key': process.env.BLOX_ADMIN_KEY!,
      },
      body: JSON.stringify({
        type: 'community.activate',
        data: { tenant_id: tenantId, stripe_customer_id: customerId }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Community billing error:', error);
    return NextResponse.json({ error: 'community_billing_failed' }, { status: 500 });
  }
}
