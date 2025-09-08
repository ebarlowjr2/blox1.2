'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

const AUTH_PAGES = ['/login', '/signin', '/api/auth']

export default function ConditionalAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const shouldShowAdminShell = !AUTH_PAGES.some(authPath => 
    pathname.startsWith(authPath)
  )
  
  if (!shouldShowAdminShell) {
    return <>{children}</>
  }
  
  return (
    <AdminShell>
      {children}
    </AdminShell>
  )
}
