'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  {
    section: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
      { href: '/dashboard/activity', label: 'Activity', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ]
  },
  {
    section: 'Agents',
    items: [
      { href: '/dashboard/agents', label: 'All Agents', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
      { href: '/dashboard/agents/mark', label: 'M.A.R.K.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { href: '/dashboard/agents/admin', label: 'A.D.M.I.N.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      { href: '/dashboard/agents/finance', label: 'F.I.N.T.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
      { href: '/dashboard/agents/dash', label: 'D.A.S.H.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ]
  },
  {
    section: 'Work',
    items: [
      { href: '/dashboard/tickets', label: 'Tickets', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { href: '/dashboard/plans', label: 'Plans', icon: 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v2m0-2h2a2 2 0 012 2v6a2 2 0 01-2 2H9' },
      { href: '/dashboard/tests', label: 'Tests', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { href: '/dashboard/prs', label: 'PRs', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    ]
  },
  {
    section: 'Data & Keys',
    items: [
      { href: '/dashboard/data', label: 'Data Sources', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
      { href: '/dashboard/keys', label: 'API Keys', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
    ]
  },
  {
    section: 'Settings',
    items: [
      { href: '/pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
      { href: '/security', label: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { href: '/status', label: 'Status', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    ]
  }
]

function NavIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileOpen])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-slate-900 to-slate-800 transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="text-lg font-semibold text-white">BLOX Admin</span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            {NAV.map((section) => (
              <div key={section.section} className="mb-6">
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.section}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <NavIcon path={item.icon} className="h-5 w-5 flex-shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:bg-gradient-to-b lg:from-slate-900 lg:to-slate-800 lg:transition-all lg:duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Desktop header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">B</span>
                </div>
                <span className="text-lg font-semibold text-white">BLOX Admin</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            {NAV.map((section) => (
              <div key={section.section} className="mb-6">
                {!isCollapsed && (
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {section.section}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <NavIcon path={item.icon} className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 ${isCollapsed ? 'lg:pl-16' : ''}`}>
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur px-4 shadow-sm lg:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <span className="text-lg font-semibold text-white">BLOX Admin</span>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
