"use client";

import {
  CreditCard,
  DollarSign,
  Smartphone,
  Users,
  Tv,
  Zap,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/lib/rbac/permissions";
import {
  OverallStats,
  ServiceBreakdown,
} from "@/lib/redux/slices/statisticSlice";

/* ---------------- UI CARD ---------------- */

interface StatUIProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  delay?: number;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  delay = 0,
}: StatUIProps) {
  return (
    <div
      className="rounded-xl bg-card p-6 shadow-card transition-all hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-semibold text-muted-foreground">
          {title}
        </span>
        <div className="p-2 bg-purple-500  rounded-md">
          <Icon className="h-5 w-5 text-white " />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p
          className={cn(
            "mt-1 text-sm",
            changeType === "positive" ? "text-success" : "text-destructive"
          )}
        >
          {changeType === "positive" ? "↑" : "↓"} {change}
          <span className="ml-1 text-muted-foreground">From last month</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------- CONTAINER ---------------- */

interface StatsCardsProps {
  overall: OverallStats; // ✅ guaranteed by your conditional render
  breakdown?: ServiceBreakdown[]; // ✅ may be undefined
}

export function StatsCards({ overall, breakdown = [] }: StatsCardsProps) {
  const { hasPermission } = usePermissions();

  const baseStats = [
    {
      title: "Total Account Balance",
      value: `₦${overall.totalUserBalance?.toLocaleString() || 0}`,
      change: "12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      permission: "perm_dashboard",
    },
    {
      title: "Total Users",
      value: overall.totalUsers?.toLocaleString() || "0",
      change: "8.2%",
      changeType: "positive" as const,
      icon: Users,
      permission: "perm_users_view",
    },
    {
      title: "Transactions",
      value: overall.totalTransactions?.toLocaleString() || "0",
      change: "23.1%",
      changeType: "positive" as const,
      icon: CreditCard,
      permission: "perm_transactions_view",
    },
  ];

  const serviceIcons: Record<string, LucideIcon> = {
    airtime: Smartphone,
    data: Smartphone,
    tv: Tv,
    electricity: Zap,
  };

  const serviceStats = breakdown
    .filter((b) => b._id?.toLowerCase() !== "wallet")
    .map((b) => ({
      title: `${b._id} Sales`,
      value: `₦${b.totalAmount?.toLocaleString() || 0}`,
      change: "2.4%",
      changeType: "negative" as const,
      icon: serviceIcons[b._id] || CreditCard,
      permission: "perm_services_view",
    }));

  // const stats = [...baseStats, ...serviceStats].filter(
  //   (s) => !s.permission || hasPermission(s.permission)
  // );
  const stats = [...baseStats, ...serviceStats];

  if (stats.length === 0) {
    return (
      <div className="grid gap-4">
        <StatCard
          title="Welcome"
          value="VTU Admin"
          change="Limited access"
          changeType="negative"
          icon={Users}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.title} {...stat} delay={i * 80} />
      ))}
    </div>
  );
}
