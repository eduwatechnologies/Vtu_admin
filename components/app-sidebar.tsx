"use client";

import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Settings,
  Users,
  Wifi,
  Zap,
  LogOut,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Transactions", url: "/transactions", icon: CreditCard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Services", url: "/services", icon: Wifi },
  { title: "Network Providers", url: "/networkProvider", icon: DollarSign },
  { title: "Logs", url: "/logs", icon: BarChart3 },
  { title: "Payments", url: "/payment", icon: Wallet },
  { title: "Staff", url: "/payment", icon: Wallet },
  { title: "Role", url: "/payment", icon: Wallet },
  { title: "API Documentation", url: "/payment", icon: Wallet },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const onLogout = () => {
    console.log("User logged out");
    // window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-purple-600 border-r shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b bg-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
          <Zap className="h-5 w-5 " />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-800">Payonce</span>
          <span className="text-xs text-gray-500">Admin Dashboard</span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto bg-green-200">
        <nav className="flex flex-col p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-150 text-sm font-medium",
                  isActive
                    ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-green-700"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t bg-green-200 px-4 py-4">
        <button
          onClick={onLogout}
          className="flex items-center w-full gap-3 text-sm text-red-500 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
