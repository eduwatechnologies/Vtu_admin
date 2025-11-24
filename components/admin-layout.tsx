"use client";

import type React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ProtectedRoute from "@/lib/function/session";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <div
            className={cn(
              "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            <AdminSidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div
          className={cn(
            "transition-all duration-300",
            "md:ml-64",
            sidebarCollapsed && "md:ml-16"
          )}
        >
          <AdminTopbar onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="p-4 md:p-6 bg-white min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
