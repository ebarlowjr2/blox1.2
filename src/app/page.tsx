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
    name: "MARK – Marketing",
    short: "Plans campaigns, drafts copy, schedules posts.",
    bullets: ["CRM sync", "Email + SMS", "Auto A/B tests"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 3l8 4v10l-8 4-8-4V7l8-4zm0 2.3L6 7.7v8.6l6 3.2 6-3.2V7.7L12 5.3zM9 9h2v6H9V9zm4 0h2v6h-2V9z"/>
      </svg>
    ),
  },
  {
    name: "Content Creator",
    short: "Blogs, landing pages, product shots, and reels.",
    bullets: ["Brand voice", "SEO briefs", "Image/Video gen"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"/>
      </svg>
    ),
  },
  {
    name: "Sales Assistant",
    short: "Qualifies leads, books demos, follows up.",
    bullets: ["Lead scoring", "Auto outreach", "CRM updates"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
  },
  {
    name: "Customer Success",
    short: "Onboards users, handles support, prevents churn.",
    bullets: ["Health scoring", "Auto check-ins", "Issue routing"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    name: "Operations Manager",
    short: "Automates workflows, manages tasks, tracks KPIs.",
    bullets: ["Process automation", "Task routing", "Performance tracking"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
  },
  {
    name: "Finance Assistant",
    short: "Tracks expenses, generates reports, manages invoices.",
    bullets: ["Expense tracking", "Invoice automation", "Financial reporting"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      </svg>
    ),
  },
  {
    name: "HR Coordinator",
    short: "Screens candidates, schedules interviews, onboards.",
    bullets: ["Resume screening", "Interview scheduling", "Onboarding automation"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H17c-.8 0-1.54.37-2.01.99l-2.98 3.93-.69-.69A1.5 1.5 0 0 0 10.26 11H8c-.83 0-1.5.67-1.5 1.5S7.17 14 8 14h1.74l3.5 3.5c.39.39 1.02.39 1.41 0l3.5-3.5H20v6h-2z"/>
      </svg>
    ),
  },
  {
    name: "Product Manager",
    short: "Gathers feedback, prioritizes features, tracks roadmap.",
    bullets: ["Feature prioritization", "User feedback analysis", "Roadmap tracking"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
  },
  {
    name: "Data Analyst",
    short: "Analyzes metrics, creates dashboards, finds insights.",
    bullets: ["Data visualization", "Trend analysis", "Automated reporting"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
  },
  {
    name: "IT Support",
    short: "Monitors systems, handles tickets, maintains security.",
    bullets: ["System monitoring", "Ticket automation", "Security compliance"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
      </svg>
    ),
  },
];

const integrations = [
  "Google", "Gmail", "Drive", "Slack", "Twilio", "Linear", "Jira", "Notion", "Vercel", "AWS"
];

const faqs = [
  {
    q: "How does BLOX AI CEO work?",
    a: "BLOX AI CEO is an intelligent business automation platform that deploys specialized AI agents to handle various business functions. Each agent is trained for specific roles like marketing, sales, customer success, and operations, working together to automate your business processes."
  },
  {
    q: "What makes BLOX different from other AI tools?",
    a: "Unlike generic AI assistants, BLOX provides role-specific agents that understand business context and can take autonomous actions. Our agents integrate with your existing tools and workflows, providing transparent, uncompromised automation without vendor lock-in."
  },
  {
    q: "How quickly can I get started?",
    a: "You can start using BLOX immediately after signing up. Our onboarding process takes just a few minutes, and you can begin deploying agents to automate your first business processes within the same day."
  },
  {
    q: "Is my data secure with BLOX?",
    a: "Yes, we take security seriously. All data is encrypted in transit and at rest, we follow SOC 2 compliance standards, and we never use your data to train our models. You maintain full control and ownership of your business data."
  },
  {
    q: "Can BLOX integrate with my existing tools?",
    a: "BLOX integrates with over 100+ popular business tools including Google Workspace, Slack, Salesforce, HubSpot, Notion, and many more. Our agents can work seamlessly within your existing tech stack."
  },
  {
    q: "What kind of support do you provide?",
    a: "We provide comprehensive support including documentation, video tutorials, live chat support, and dedicated customer success managers for enterprise customers. Our team is here to help you maximize the value of BLOX."
  }
];

export default function HomePage() {
  return (
    <main id="top" className="bg-[#0a1630] text-white min-h-screen antialiased selection:bg-emerald-300/30 selection:text-emerald-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-[#0a1630]/70">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[#0a1630] font-bold text-sm">
              B
            </div>
            <span className="text-xl font-semibold">BLOX AI CEO</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <Link
            href="/signin"
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="relative pt-20 pb-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Your AI-powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              business automation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Deploy specialized AI agents to automate marketing, sales, customer success, and operations. 
            No limits, no surprises, no vendor lock-in.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/signin"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Start free
            </Link>
            <button className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Live demo
            </button>
          </div>
          
          <div className="text-sm text-slate-400 mb-8">
            Trusted by 500+ businesses to automate their operations
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {integrations.map((integration) => (
              <div key={integration} className="text-slate-400 font-medium">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet your AI workforce
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Each agent is specialized for specific business functions, working together to automate your entire operation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[#0a1630]">
                    {agent.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                </div>
                
                <p className="text-slate-300 mb-4">{agent.short}</p>
                
                <ul className="space-y-2">
                  {agent.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20 bg-slate-800/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How it works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get started in minutes, not months. Our AI agents integrate seamlessly with your existing tools and workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[#0a1630] font-bold text-xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect your tools</h3>
              <p className="text-slate-300">
                Integrate with your existing business tools in just a few clicks. No complex setup required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[#0a1630] font-bold text-xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Deploy AI agents</h3>
              <p className="text-slate-300">
                Choose from our library of specialized agents or create custom ones for your specific needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[#0a1630] font-bold text-xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Watch them work</h3>
              <p className="text-slate-300">
                Monitor your agents' performance and let them handle the repetitive tasks while you focus on strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="integrations" className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Works with your favorite tools
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            BLOX integrates with 100+ popular business tools, so your agents can work within your existing workflow.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-60">
            {integrations.map((integration) => (
              <div key={integration} className="text-slate-400 font-medium text-lg">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-emerald-600/20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to automate your business?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join hundreds of businesses already using BLOX to scale their operations with AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signin"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Get started
            </Link>
            <button className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Schedule demo
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently asked questions
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to know about BLOX AI CEO.
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-700 pb-8">
                <h3 className="text-xl font-semibold mb-4">{faq.q}</h3>
                <p className="text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[#0a1630] font-bold text-sm">
                B
              </div>
              <span className="text-xl font-semibold">BLOX AI CEO</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            © 2025 BLOX AI CEO. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
