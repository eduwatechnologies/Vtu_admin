"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Smartphone,
  FileText,
  Server,
  BarChart3,
  DollarSign,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Wallet,
  Wifi,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  // { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  // { icon: Users, label: "Users & Resellers", href: "/dashboard/users" },
  // { icon: CreditCard, label: "Transactions & Wallets", href: "/dashboard/transactions" },
  // { icon: Smartphone, label: "Services & Pricing", href: "/dashboard/services-pricing" },
  // { icon: Smartphone, label: "Airtime & Data", href: "/dashboard/airtime-data" },
  // { icon: FileText, label: "Bills Payment", href: "/dashboard/bills" },
  // { icon: Server, label: "API Vendors", href: "/dashboard/vendors" },
  // { icon: BarChart3, label: "Reports & Analytics", href: "/dashboard/reports" },
  // { icon: DollarSign, label: "Revenue Management", href: "/dashboard/revenue" },
  // { icon: Shield, label: "Security & Logs", href: "/dashboard/security" },
  // { icon: Settings, label: "Settings", href: "/dashboard/settings" },

  { title: "Dashboard", href: "/", icon: Home },
  { title: "Transactions", href: "/transactions", icon: CreditCard },
  { title: "Users", href: "/users", icon: Users },
  { title: "Services", href: "/services", icon: Wifi },
  { title: "Network Providers", href: "/networkProvider", icon: DollarSign },
  { title: "Logs", href: "/logs", icon: BarChart3 },
  { title: "Payments", href: "/payment", icon: Wallet },
  { title: "Staff", href: "/staff", icon: Wallet },
  { title: "Role", href: "/role", icon: Wallet },
  { title: "API Documentation", href: "/payment", icon: Wallet },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <aside
      className={cn(
        "h-full flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ backgroundColor: "#0A1F44" }}
    >
      <div
        className="flex h-16 items-center justify-between border-b px-4"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {!collapsed && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={onNavigate}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <span className="text-xl font-bold" style={{ color: "#0A1F44" }}>
                P
              </span>
            </div>
            <span className="text-xl font-bold text-white">Payonce</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white mx-auto">
            <span className="text-xl font-bold" style={{ color: "#0A1F44" }}>
              B
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden md:block text-white/70 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#0E7AFE] text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className="p-3 border-t"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <Link
          href="/login"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-all hover:text-red-300 hover:bg-white/10"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
