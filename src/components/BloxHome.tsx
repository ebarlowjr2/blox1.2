import React from "react";
import { Brain, LineChart, Settings2, Zap, ShieldCheck, Users2, Calendar, Mail, Play, Pause, UploadCloud, Search, CheckCircle2, AlertTriangle, Wifi, Wrench, Plus, Sparkles, Github, Cloud, Database, MessageSquare } from "lucide-react";

const kpis = [
  { label: "Agents Online", value: 5, suffix: "/8" },
  { label: "Tools Connected", value: 29 },
  { label: "System Health", value: 98, suffix: "%" },
  { label: "Tasks in Queue", value: 14 },
];

const agents = [
  {
    key: "MARK",
    name: "M.A.R.K.",
    subtitle: "Marketing, Automation, Research & Knowledge",
    color: "bg-sky-500",
    status: "online",
    tools: ["Gmail", "Google Drive", "Google Search", "Twilio SMS", "HubSpot"],
  },
  {
    key: "CORY",
    name: "C.O.R.Y.",
    subtitle: "Creative Output & Rendering Yield",
    color: "bg-violet-500",
    status: "offline",
    tools: ["Canva", "Adobe", "YouTube", "Figma", "Unsplash"],
  },
  {
    key: "ALEX",
    name: "A.L.E.X.",
    subtitle: "Administrative Logistics Executive",
    color: "bg-emerald-500",
    status: "online",
    tools: ["Google Calendar", "Slack", "Notion", "DocuSign", "Zoom"],
  },
  {
    key: "HALI",
    name: "H.A.L.I.",
    subtitle: "Human Assistance & Labor Intelligence",
    color: "bg-orange-500",
    status: "online",
    tools: ["LinkedIn", "BambooHR", "Workday", "Indeed", "Glassdoor"],
  },
  {
    key: "FINT",
    name: "F.I.N.T.",
    subtitle: "Financial Insights & Transactions",
    color: "bg-green-600",
    status: "offline",
    tools: ["QuickBooks", "Stripe", "PayPal", "Excel", "Mint"],
  },
  {
    key: "CYRA",
    name: "C.Y.R.A.",
    subtitle: "Cybersecurity Response & Analysis",
    color: "bg-rose-500",
    status: "online",
    tools: ["LastPass", "Norton", "Cloudflare", "VPN", "Firewall"],
  },
  {
    key: "TONY",
    name: "T.O.N.Y.",
    subtitle: "Technical Operations & Network Yield",
    color: "bg-indigo-500",
    status: "online",
    tools: ["GitHub", "AWS", "Docker", "Jenkins", "Monitoring"],
  },
  {
    key: "SAGE",
    name: "S.A.G.E.",
    subtitle: "Social Automation & Growth Engine",
    color: "bg-pink-500",
    status: "offline",
    tools: ["Twitter", "Instagram", "Facebook", "TikTok", "Buffer"],
  },
];

const recentActivity = [
  { id: 1, icon: Mail, title: "MARK sent 42 outreach emails", time: "2m ago" },
  { id: 2, icon: ShieldCheck, title: "CYRA closed phishing incident #4821", time: "14m ago" },
  { id: 3, icon: Calendar, title: "ALEX scheduled Ops sync for Tue 10:00", time: "25m ago" },
  { id: 4, icon: Github, title: "TONY merged PR #223 (API ratelimiting)", time: "1h ago" },
];

const healthSignals = [
  { label: "Incidents", value: 1, icon: AlertTriangle },
  { label: "Latency", value: "112ms", icon: Wifi },
  { label: "Integrations", value: 29, icon: Wrench },
  { label: "Throughput", value: "3.2k/min", icon: Zap },
];

const QuickAction = ({ icon: Icon, label }) => (
  <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2 transition-colors">
    <Icon className="size-4" /> {label}
  </button>
);

const StatusPill = ({ status }) => (
  <div className="flex items-center gap-2">
    <span className={`inline-block size-2 rounded-full ${status === "online" ? "bg-emerald-500" : "bg-slate-400"}`} />
    <span className="text-xs text-gray-500 capitalize">{status}</span>
  </div>
);

const AgentCard = ({ name, subtitle, color, status, tools }) => {
  return (
    <div className="h-full border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`size-9 ${color} text-white rounded-full grid place-content-center font-semibold`}>
              {name.split(".")[0]}
            </div>
            <div>
              <h3 className="text-base font-semibold leading-tight">{name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <StatusPill status={status} />
        </div>
      </div>
      <div className="p-6 pt-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {tools.slice(0, 5).map((t) => (
            <div key={t} className="inline-flex items-center rounded-lg border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors">{t}</div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {status === "online" ? (
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 gap-2 transition-colors"><Play className="size-4" /> Start Task</button>
          ) : (
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 h-9 px-3 gap-2 transition-colors"><Play className="size-4" /> Wake Agent</button>
          )}
          <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-gray-100 h-9 px-3 gap-2 transition-colors"><Pause className="size-4" /> Pause</button>
          <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-gray-100 h-9 px-3 gap-2 transition-colors"><Settings2 className="size-4" /> Settings</button>
        </div>
      </div>
    </div>
  );
};

export default function BloxHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200/60">
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
            <QuickAction icon={Search} label="Ask BLOX" />
            <QuickAction icon={UploadCloud} label="Upload Brief" />
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4 gap-2 transition-colors"><Sparkles className="size-4" /> New Initiative</button>
          </div>
        </div>
      </header>

      {/* Hero / KPIs */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6">
        <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 text-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm/6 opacity-90">Control Center</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">BLOX Agent Command Center</h2>
              <p className="mt-2 text-white/90 max-w-prose">Orchestrate your organization's agents, tools, and workflows. Launch initiatives, track progress, and let BLOX automate the busywork.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {kpis.map((k) => (
                <div key={k.label} className="rounded-2xl bg-white/15 px-4 py-3">
                  <div className="text-xs/5 text-white/80">{k.label}</div>
                  <div className="text-2xl font-semibold">{k.value}<span className="text-sm font-medium ml-1">{k.suffix ?? ""}</span></div>
                </div>
              ))}
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
            <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 h-10 py-2 px-4 gap-2 transition-colors"><Plus className="size-4" /> Add Agent</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((a) => (
              <AgentCard key={a.key} name={a.name} subtitle={a.subtitle} color={a.color} status={a.status} tools={a.tools} />
            ))}
          </div>
        </section>

        {/* Right Rail */}
        <aside className="space-y-4">
          {/* System Health */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <h3 className="text-sm font-semibold leading-none tracking-tight">System Health</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Uptime</span><span>99.95%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-blue-600 transition-all" style={{ width: '98%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {healthSignals.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                    <s.icon className="size-4 text-slate-600" />
                    <div>
                      <div className="text-sm font-medium leading-tight">{s.value}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-row items-center justify-between p-6 pb-2">
              <h3 className="text-sm font-semibold leading-none tracking-tight">Recent Activity</h3>
              <div className="inline-flex items-center rounded-lg border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 px-2.5 py-0.5 text-xs font-semibold">Live</div>
            </div>
            <div className="p-6 pt-0 space-y-3">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="mt-0.5 text-slate-600"><a.icon className="size-4" /></div>
                  <div className="flex-1">
                    <div className="text-sm leading-tight">{a.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.time}</div>
                  </div>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <h3 className="text-sm font-semibold leading-none tracking-tight">Quick Actions</h3>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 gap-2">
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2 transition-colors"><LineChart className="size-4" /> Weekly Review</button>
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2 transition-colors"><Users2 className="size-4" /> Team Update</button>
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2 transition-colors"><MessageSquare className="size-4" /> Compose Brief</button>
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 py-2 px-4 gap-2 transition-colors"><Cloud className="size-4" /> Sync Integrations</button>
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
