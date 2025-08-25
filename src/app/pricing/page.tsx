import React from 'react';

export default function Pricing() {
  return (
    <main className='min-h-screen bg-[#0b1222] text-white p-8'>
      <div className="max-w-4xl mx-auto">
        <h1 className='text-3xl font-semibold mb-6'>Pricing</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Starter</h2>
            <p className="text-white/70 mb-4">Perfect for small teams getting started with AI automation</p>
            <div className="text-3xl font-bold mb-6">$29<span className="text-lg text-white/70">/month</span></div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Up to 3 AI agents</li>
              <li>• 1,000 tasks per month</li>
              <li>• Basic integrations</li>
              <li>• Email support</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Professional</h2>
            <p className="text-white/70 mb-4">For growing businesses that need more automation power</p>
            <div className="text-3xl font-bold mb-6">$99<span className="text-lg text-white/70">/month</span></div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Up to 10 AI agents</li>
              <li>• 10,000 tasks per month</li>
              <li>• Advanced integrations</li>
              <li>• Priority support</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Enterprise</h2>
            <p className="text-white/70 mb-4">Custom solutions for large organizations</p>
            <div className="text-3xl font-bold mb-6">Custom</div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Unlimited AI agents</li>
              <li>• Unlimited tasks</li>
              <li>• Custom integrations</li>
              <li>• Dedicated support</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
