"use client";

import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Smartphone,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/lib/rbac/permissions";
import { useEffect } from "react";
import { fetchUsers } from "@/lib/redux/slices/userSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/redux/hooks";

const stats = [
  {
    title: "Total Revenue",
    value: "₦2,450,000",
    change: "+12.5%",
    changeType: "increase" as const,
    icon: DollarSign,
    description: "From last month",
    requiredPermission: "perm_dashboard",
  },
  {
    title: "Total Users",
    value: "1,234",
    change: "+8.2%",
    changeType: "increase" as const,
    icon: Users,
    description: "Active users",
    requiredPermission: "perm_users_view",
  },
  {
    title: "Transactions",
    value: "45,231",
    change: "+23.1%",
    changeType: "increase" as const,
    icon: CreditCard,
    description: "This month",
    requiredPermission: "perm_transactions_view",
  },
  {
    title: "Airtime Sales",
    value: "₦1,850,000",
    change: "-2.4%",
    changeType: "decrease" as const,
    icon: Smartphone,
    description: "From last month",
    requiredPermission: "perm_services_view",
  },
];

export function StatsCards() {
  const { hasPermission } = usePermissions();

  // Filter stats based on permissions
  const visibleStats = stats.filter((stat) =>
    hasPermission(stat.requiredPermission)
  );

  // If no stats are visible, show a default stat
  if (visibleStats.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">VTU Admin</div>
            <div className="text-xs text-muted-foreground">
              Your access is limited. Contact an administrator for more
              permissions.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {visibleStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.changeType === "increase" ? (
                <ArrowUp className="mr-1 h-3 w-3 text-blue-600" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-blue-600" />
              )}
              <span className="text-blue-600">{stat.change}</span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
