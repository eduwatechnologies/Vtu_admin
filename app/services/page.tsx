"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServicesUsage } from "@/components/services-usage"
import { ServicesPerformance } from "@/components/services-performance"

export default function ServicesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Monitoring</h1>
            <p className="text-muted-foreground">Track usage and performance of VTU services</p>
          </div>

          <ServicesUsage />

          <ServicesPerformance />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
