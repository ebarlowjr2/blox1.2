import React from "react";
import { Brain, LineChart, Settings2, Zap, ShieldCheck, Users2, Calendar, Mail, Play, Pause, UploadCloud, Search, CheckCircle2, AlertTriangle, Wifi, Wrench, Plus, Sparkles, Github, Cloud, Database, MessageSquare } from "lucide-react";

export default function BloxHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 grid place-content-center text-white">
              <Brain className="size-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500 leading-none">Barlow Logic Operations Xecutive</div>
              <h1 className="text-xl font-semibold tracking-tight">B.L.O.X — Your AI CEO</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2">
              <Search className="size-4" /> Ask BLOX
            </button>
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2">
              <UploadCloud className="size-4" /> Upload Brief
            </button>
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4 gap-2">
              <Sparkles className="size-4" /> New Initiative
            </button>
          </div>
        </div>
      </header>

      {/* Hero / KPIs */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6">
        <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 text-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm opacity-90">Control Center</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">BLOX Agent Command Center</h2>
              <p className="mt-2 text-white/90 max-w-prose">Orchestrate your organization's agents, tools, and workflows. Launch initiatives, track progress, and let BLOX automate the busywork.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="rounded-2xl bg-white/15 px-4 py-3">
                <div className="text-xs text-white/80">Agents Online</div>
                <div className="text-2xl font-semibold">5<span className="text-sm font-medium ml-1">/8</span></div>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3">
                <div className="text-xs text-white/80">Tools Connected</div>
                <div className="text-2xl font-semibold">29</div>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3">
                <div className="text-xs text-white/80">System Health</div>
                <div className="text-2xl font-semibold">98<span className="text-sm font-medium ml-1">%</span></div>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3">
                <div className="text-xs text-white/80">Tasks in Queue</div>
                <div className="text-2xl font-semibold">14</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-slate-700">Agents</h3>
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 h-10 py-2 px-4 gap-2">
              <Plus className="size-4" /> Add Agent
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agent Cards */}
            <div className="rounded-lg border bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 bg-sky-500 text-white rounded-full grid place-content-center font-semibold">M</div>
                    <div>
                      <h3 className="text-base font-semibold leading-tight">M.A.R.K.</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Marketing, Automation, Research & Knowledge</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs text-gray-500 capitalize">online</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">Gmail</div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">Google Drive</div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">HubSpot</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 gap-2">
                    <Play className="size-4" /> Start Task
                  </button>
                  <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-gray-100 h-9 px-3 gap-2">
                    <Pause className="size-4" /> Pause
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 bg-violet-500 text-white rounded-full grid place-content-center font-semibold">C</div>
                    <div>
                      <h3 className="text-base font-semibold leading-tight">C.O.R.Y.</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Creative Output & Rendering Yield</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-slate-400"></span>
                    <span className="text-xs text-gray-500 capitalize">offline</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">Canva</div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">Adobe</div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">Figma</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 h-9 px-3 gap-2">
                    <Play className="size-4" /> Wake Agent
                  </button>
                  <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-gray-100 h-9 px-3 gap-2">
                    <Pause className="size-4" /> Pause
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Rail */}
        <aside className="space-y-4">
          {/* System Health */}
          <div className="rounded-lg border bg-white text-gray-900 shadow-sm rounded-2xl">
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <h3 className="text-sm font-semibold">System Health</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Uptime</span><span>99.95%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-full flex-1 bg-blue-600 transition-all" style={{transform: 'translateX(-2%)'}}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border p-3">
                  <AlertTriangle className="size-4 text-slate-600" />
                  <div>
                    <div className="text-sm font-medium leading-tight">1</div>
                    <div className="text-xs text-gray-500">Incidents</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border p-3">
                  <Wifi className="size-4 text-slate-600" />
                  <div>
                    <div className="text-sm font-medium leading-tight">112ms</div>
                    <div className="text-xs text-gray-500">Latency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-lg border bg-white text-gray-900 shadow-sm rounded-2xl">
            <div className="flex flex-col space-y-1.5 p-6 pb-2 flex-row items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Activity</h3>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900 rounded-lg">Live</div>
            </div>
            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-slate-600"><Mail className="size-4" /></div>
                <div className="flex-1">
                  <div className="text-sm leading-tight">MARK sent 42 outreach emails</div>
                  <div className="text-xs text-gray-500 mt-0.5">2m ago</div>
                </div>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-slate-600"><ShieldCheck className="size-4" /></div>
                <div className="flex-1">
                  <div className="text-sm leading-tight">CYRA closed phishing incident #4821</div>
                  <div className="text-xs text-gray-500 mt-0.5">14m ago</div>
                </div>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} BLOX • AI CEO Control</span>
          <span className="flex items-center gap-2"><Database className="size-4" /> Region: us-east-1 • Build: 1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
