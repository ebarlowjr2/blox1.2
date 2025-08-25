import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email;
    
    if (!email) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Email is required' 
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    console.log('Subscription request for email:', email);
    
    return NextResponse.json({ 
      ok: true, 
      email: email,
      message: 'Successfully subscribed to updates'
    });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
