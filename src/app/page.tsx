import Link from 'next/link';

const nav = [
  { label: "Home", href: "#top" },
  { label: "Agents", href: "#agents" },
  { label: "How it works", href: "#how" },
  { label: "Integrations", href: "#integrations" },
  { label: "FAQ", href: "#faq" },
];

const agents = [
  {
    name: "M.A.R.K. – Marketing, Automation, Research & Knowledge",
    short: "Plans campaigns, drafts copy, schedules posts.",
    bullets: ["CRM sync", "Email + SMS", "Auto A/B tests"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 3l8 4v10l-8 4-8-4V7l8-4zm0 2.3L6 7.7v8.6l6 3.2 6-3.2V7.7L12 5.3zM9 9h2v6H9V9zm4 0h2v6h-2V9z"/>
      </svg>
    ),
  },
  {
    name: "C.O.R.Y. – Creative Output & Rendering Yield",
    short: "Blogs, landing pages, product shots, and reels.",
    bullets: ["Brand voice", "SEO briefs", "Image/Video gen"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"/>
      </svg>
    ),
  },
  {
    name: "A.L.E.X. – Administrative Logistics Executive",
    short: "Inbox triage, calendars, travel, and docs.",
    bullets: ["Gmail/GSuite", "Calendar", "Doc drafting"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h6v2H7V9zm0 4h10v2H7v-2z"/>
      </svg>
    ),
  },
  {
    name: "H.A.L.I. – Human Assistance & Labor Intelligence",
    short: "Screening, onboarding, policy Q&A.",
    bullets: ["Job posts", "Resume parse", "Handbooks"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0H5z"/>
      </svg>
    ),
  },
  {
    name: "F.I.N.T. – Financial Insights & Transactions",
    short: "Invoices, spend alerts, quick analyses.",
    bullets: ["QBO/Xero", "Forecasts", "AR follow‑ups"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M3 6h18v12H3V6zm2 2v8h14V8H5zm3 2h8v2H8v-2zm0 3h6v2H8v-2z"/>
      </svg>
    ),
  },
  {
    name: "C.Y.R.A. – Cybersecurity Response & Analysis",
    short: "Policy packs, alerts triage, compliance runs.",
    bullets: ["CMMC/NIST", "SIEM hooks", "Asset checks"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4zm0 4.2l-5 2.9V12c0 3.7 2.4 6.9 5 7.9 2.6-1 5-4.2 5-7.9V9.1l-5-2.9z"/>
      </svg>
    ),
  },
  {
    name: "T.O.N.Y. – Technical Operations & Network Yield",
    short: "Web fixes, automations, data cleaning.",
    bullets: ["Git + CI", "APIs", "ETL jobs"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M9 3H5v4h2V7h2V3zm10 0h-4v4h4V3zM9 17H7v-2H5v4h4v-2zm10 2v-4h-2v2h-2v2h4zM8 9h8v6H8V9z"/>
      </svg>
    ),
  },
  {
    name: "S.A.G.E. – Social Automation & Growth Engine",
    short: "Plan, draft, and schedule across channels.",
    bullets: ["Calendar", "Auto‑resize", "Hashtag helper"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M4 4h16v16H4V4zm4 3h8v2H8V7zm0 4h10v2H8v-2zm0 4h6v2H8v-2z"/>
      </svg>
    ),
  },
  {
    name: "D.A.S.H. – DevOps Automation & Systems Handler",
    short: "Ship features, fix build pipelines, watch uptime.",
    bullets: ["CI/CD", "IaC", "Health checks"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8zm-1 1h2v6h-2V9z"/>
      </svg>
    ),
  },
  {
    name: "Create your own",
    short: "Compose skills from tools, data, and workflows.",
    bullets: ["GUI builder", "Secure keys", "Versioned"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4z"/>
      </svg>
    ),
  },
];

const integrations = [
  "Google", "Gmail", "Drive", "Slack", "Twilio", "Linear", "Jira", "Notion", "Vercel", "AWS"
];

export default function HomePage() {
  return (
    <main id="top" className="bg-[#0b1222] text-white min-h-screen antialiased selection:bg-cyan-300/30 selection:text-cyan-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-[#0b1222]/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#top" className="group inline-flex items-center gap-3">
              <span className="inline-grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">B</span>
              <span className="text-lg font-semibold tracking-tight">
                <span className="text-white">BLOX</span>
                <span className="ml-2 hidden text-sm text-cyan-300/80 sm:inline">AI CEO</span>
              </span>
            </a>

            <nav className="hidden items-center gap-6 md:flex">
              {nav.map((n) => (
                <a key={n.href} href={n.href} className="text-sm text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 py-1">
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href="#demo" className="hidden rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/5 md:inline-block">Live demo</a>
              <Link href="/signin" className="rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-3.5 py-2.5 text-sm font-semibold shadow-lg shadow-cyan-600/25 ring-1 ring-white/10 hover:from-cyan-500 hover:to-emerald-500">Get started</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" /> Now with multi‑agent orchestration
              </p>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Your <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">AI CEO</span> that runs the boring parts of your business.
              </h1>
              <p className="mt-5 max-w-[52ch] text-base text-white/70">
                BLOX gives you senior‑level outcomes without hiring a full team. Spin up plug‑and‑play agents for marketing, ops, finance, security—and build your own. No AI degree required.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/signin" className="rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-cyan-600/30 ring-1 ring-white/10 hover:from-cyan-500 hover:to-emerald-500">Start free</Link>
                <a href="#how" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/90 hover:bg-white/5">See how it works</a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-white/60">
                <div className="inline-flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[0,1,2].map((i)=> (
                      <span key={i} className="inline-block h-6 w-6 rounded-full border border-white/20 bg-white/20" />
                    ))}
                  </div>
                  <span>Trusted by growing teams</span>
                </div>
                <span>•</span>
                <span>SOC‑aware · Privacy‑first · Your keys, your data</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-cyan-500/10">
              <div className="rounded-xl bg-[#0e1b36] p-3 ring-1 ring-white/10">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded bg-white/10 px-2 py-1 text-xs">slack</span>
                  <span className="rounded bg-white/10 px-2 py-1 text-xs">linear</span>
                  <span className="ml-auto text-xs text-white/60">#frontend</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-white/80"><b>Silas</b> · Can we make the knowledge fields always editable?</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-white/80"><b>BLOX</b> · On it. Spinning a <span className="text-cyan-300">D.A.S.H.</span> session, updating schema, and opening a PR. <a className="text-cyan-300 underline" href="#">See plan</a>.</p>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {["Ticket","Plan","Test","PR"].map((s, i) => (
                      <div key={s} className={`rounded-lg border border-white/10 p-3 text-center ${i===0?"bg-cyan-500/15":"bg-white/5"}`}>
                        <p className="text-xs text-white/70">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-white/50">Works with your stack</p>
          <div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
            {integrations.map((it) => (
              <div key={it} className="text-white/70">{it}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Agents that ship work</h2>
              <p className="mt-2 max-w-[60ch] text-sm text-white/70">Pick from ready‑made specialists or compose your own from tools, data sources, and policies. BLOX routes tasks to the right agent automatically.</p>
            </div>
            <Link href="/signin" className="hidden rounded-lg border border-white/15 px-3 py-2 text-sm text-white/90 hover:bg-white/5 md:inline-block">Launch BLOX</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agents.map((a) => (
              <article key={a.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:translate-y-[-2px] hover:bg-white/10">
                <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/10 p-2 text-cyan-300">
                  {a.icon}
                  <span className="sr-only">icon</span>
                </div>
                <h3 className="text-base font-semibold leading-tight">{a.name}</h3>
                <p className="mt-1 text-sm text-white/70">{a.short}</p>
                <ul className="mt-3 space-y-1 text-xs text-white/60">
                  {a.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2">
                  <button className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5">Try</button>
                  <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">Docs</button>
                </div>
                <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="relative border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">From request to results in four steps</h2>
          <p className="mx-auto mt-2 max-w-[60ch] text-center text-sm text-white/70">BLOX plugs into chat, helpdesk, or email. It writes a plan, tests changes in sandboxes, and opens native PRs you can review.
          </p>

          <ol className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {k:"Ticket", d:"Open a ticket from Slack, email, or your portal."},
              {k:"Plan", d:"BLOX proposes a safe, auditable plan."},
              {k:"Test", d:"Agents validate changes in staging with checks."},
              {k:"PR", d:"BLOX opens a pull request for your review."},
            ].map((s, i) => (
              <li key={s.k} className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-emerald-600 text-sm font-semibold">{i+1}</div>
                <h3 className="text-base font-semibold">{s.k}</h3>
                <p className="mt-1 text-sm text-white/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="integrations" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Connect tools in minutes</h2>
              <p className="mt-2 max-w-[60ch] text-sm text-white/70">Bring your own APIs and credentials. BLOX uses scoped keys, per‑agent secrets, and detailed logs so your data stays in your control.</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400"/>Google Workspace, Slack, Jira/Linear, Notion, Twilio, AWS, Vercel…</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400"/>Webhooks + Zapier/Make compatible endpoints.</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400"/>SSO and audit trails for teams.</li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/signin" className="rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-cyan-600/30 ring-1 ring-white/10 hover:from-cyan-500 hover:to-emerald-500">Connect my tools</Link>
                <a href="#" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/90 hover:bg-white/5">Security overview</a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {integrations.map((i)=> (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">{i}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative border-y border-white/5 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Put BLOX to work this week</h2>
            <p className="mt-2 text-sm text-white/70">Skip the hiring backlog. Start with a ready‑made agent and grow into a custom AI org chart—on your terms.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signin" className="rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-cyan-600/30 ring-1 ring-white/10 hover:from-cyan-500 hover:to-emerald-500">Start free</Link>
              <a href="#demo" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/90 hover:bg-white/10">Book a walkthrough</a>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked</h2>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                q: "Do I need to be an AI expert?",
                a: "No. BLOX ships with guard‑railed agents and a visual builder. You pick outcomes, connect tools, and BLOX handles the rest.",
              },
              {
                q: "Where does my data live?",
                a: "In your connected systems. Credentials are scoped to agents; activity is logged with exportable audit trails.",
              },
              {
                q: "Can I bring my own models/APIs?",
                a: "Yes. Swap providers per agent or per task. BLOX supports API keys and on‑prem endpoints.",
              },
              {
                q: "How do teams use BLOX?",
                a: "Start with 2–3 agents (e.g., MARK + Admin + D.A.S.H.). Scale to an internal marketplace of reusable skills.",
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/5 p-5 open:bg-white/10">
                <summary className="cursor-pointer list-none text-base font-medium marker:content-none">
                  <span className="inline-flex items-center gap-2">{f.q}
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs group-open:rotate-45 transition">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">B</div>
              <p className="max-w-xs text-sm text-white/70">BLOX by One Circle Solutions. Your AI CEO for modern teams.</p>
            </div>
            <nav className="grid grid-cols-2 gap-6 text-sm text-white/70">
              <div className="space-y-2">
                <div className="text-white/80">Product</div>
                <a href="#agents" className="block hover:text-white">Agents</a>
                <a href="#how" className="block hover:text-white">How it works</a>
                <a href="#integrations" className="block hover:text-white">Integrations</a>
              </div>
              <div className="space-y-2">
                <div className="text-white/80">Company</div>
                <a href="#" className="block hover:text-white">Security</a>
                <a href="#" className="block hover:text-white">Status</a>
                <a href="#" className="block hover:text-white">Contact</a>
              </div>
            </nav>
            <div className="text-sm text-white/60 lg:text-right">© {new Date().getFullYear()} OneCS · All rights reserved.</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
