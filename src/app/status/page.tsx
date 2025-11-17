import React from 'react';

export default function Status() {
  return (
    <main className='min-h-screen bg-[#0b1222] text-white p-8'>
      <div className="max-w-4xl mx-auto">
        <h1 className='text-3xl font-semibold mb-6'>System Status</h1>
        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold">All Systems Operational</h2>
            </div>
            <p className="text-white/70">All BLOX services are running normally.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">API Services</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Operational</span>
                </div>
              </div>
              <p className="text-xs text-white/60">Response time: 120ms</p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">AI Agents</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Operational</span>
                </div>
              </div>
              <p className="text-xs text-white/60">8/8 agents online</p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Integrations</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Operational</span>
                </div>
              </div>
              <p className="text-xs text-white/60">All connections stable</p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Dashboard</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Operational</span>
                </div>
              </div>
              <p className="text-xs text-white/60">Load time: 1.2s</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="font-semibold mb-4">Recent Incidents</h3>
            <p className="text-white/70 text-sm">No incidents in the last 30 days.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
