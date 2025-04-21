'use client'

import AppHeader from '@/components/app-header'
import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <AppHeader />
        <div className="mt-[67px] p-4 w-full">
        {children}
        </div>
      </SidebarProvider>
    </div>
  )
}