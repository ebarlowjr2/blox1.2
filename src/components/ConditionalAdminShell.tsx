'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

const AUTHENTICATED_ROUTES = ['/app', '/dashboard']

export default function ConditionalAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const shouldShowAdminShell = AUTHENTICATED_ROUTES.some(authRoute => 
    pathname.startsWith(authRoute)
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
