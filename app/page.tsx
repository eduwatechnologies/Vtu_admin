"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { RecentTransactions } from "@/components/recent-transactions";
import { RevenueChart } from "@/components/revenue-chart";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authSlice";
import { fetchTransactions } from "@/lib/redux/slices/transactionSlice";
import {
  fetchStaff,
  fetchRoles,
  fetchPermissions,
} from "@/lib/redux/slices/staffSlice";
import { PermissionGuard } from "@/components/rbac/permission-guard";
import { StaffActivityWidget } from "@/components/dashboard/staff-activity-widget";
import { SystemHealthWidget } from "@/components/dashboard/system-health-widget";
import { QuickActionsWidget } from "@/components/dashboard/quick-actions-widget";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set user in Redux store from NextAuth session
    if (session?.user) {
      dispatch(setUser(session.user));
    }

    // Fetch initial data
    dispatch(fetchTransactions());
    dispatch(fetchStaff());
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [session, dispatch]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your VTU platform.
            </p>
          </div>

          {/* Stats Cards - Visible to all users */}
          <StatsCards />

          {/* Quick Actions - Only for users with specific permissions */}
          <PermissionGuard
            requiredPermissions={[
              "perm_users_edit",
              "perm_transactions_manage",
              "perm_services_manage",
            ]}
            requireAll={false}
          >
            <QuickActionsWidget />
          </PermissionGuard>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Transactions - Requires transaction view permission */}
            <PermissionGuard
              requiredPermission="perm_transactions_view"
              fallback={
                <Alert variant="default" className="lg:col-span-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Access Restricted</AlertTitle>
                  <AlertDescription>
                    You don't have permission to view transaction information.
                  </AlertDescription>
                </Alert>
              }
              className="lg:col-span-2"
            >
              <div className="lg:col-span-2">
                <RecentTransactions />
              </div>
            </PermissionGuard>

            {/* Revenue Chart - Requires revenue view permission */}
            <PermissionGuard
              requiredPermission="perm_dashboard"
              fallback={
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Access Restricted</AlertTitle>
                  <AlertDescription>
                    You don't have permission to view revenue information.
                  </AlertDescription>
                </Alert>
              }
            >
              <RevenueChart />
            </PermissionGuard>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Staff Activity - Only for users with staff view permission */}
            <PermissionGuard requiredPermission="perm_staff_view">
              <StaffActivityWidget />
            </PermissionGuard>

            {/* System Health - Only for administrators */}
            <PermissionGuard requiredPermission="perm_settings_view">
              <SystemHealthWidget />
            </PermissionGuard>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
