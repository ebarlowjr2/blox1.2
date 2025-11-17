import React from 'react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <main className='min-h-screen bg-[#0b1222] text-white p-8'>
      <div className="max-w-4xl mx-auto">
        <h1 className='text-3xl font-semibold mb-6'>Billing & Subscription</h1>
        
        <div className="space-y-8">
          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Your Subscription</h2>
            <p className="text-white/70 mb-4">
              Access your billing dashboard to manage your BLOX subscription, update payment methods, and view invoices.
            </p>
            <Link 
              href="/api/auth/login?returnTo=%2Fdashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          </section>

          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Pricing Plans</h2>
            <p className="text-white/70 mb-4">
              Choose from our flexible pricing plans designed to scale with your business needs.
            </p>
            <ul className="space-y-2 text-sm text-white/80 mb-4">
              <li>• <strong>Community:</strong> Free - Perfect for getting started</li>
              <li>• <strong>Pro Monthly:</strong> $49/month - Full AI capabilities</li>
              <li>• <strong>Pro Yearly:</strong> $490/year - Best value with 2 months free</li>
            </ul>
            <Link 
              href="/pricing"
              className="inline-block text-blue-400 hover:text-blue-300 transition-colors"
            >
              View detailed pricing →
            </Link>
          </section>

          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Payment & Invoices</h2>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Secure payment processing via Stripe</li>
              <li>• Automatic invoicing and receipts</li>
              <li>• Multiple payment methods supported</li>
              <li>• Cancel or upgrade anytime</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-white/70">
              Have questions about billing or need to make changes to your subscription? 
              Contact our support team for assistance.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
