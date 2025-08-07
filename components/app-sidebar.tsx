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
  Bell,
  UserCog,
  Shield,
  HelpCircle,
  LogOut,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Services",
    url: "/services",
    icon: Wifi,
  },
  {
    title: "Netwrork Providers",
    url: "/networkProvider",
    icon: DollarSign,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: BarChart3,
  },

  {
    title: "Payments",
    url: "/payment",
    icon: Wallet,
  },

  // {
  //   title: "Staff",
  //   url: "/staff",
  //   icon: UserCog,
  // },
  // {
  //   title: "Roles",
  //   url: "/roles",
  //   icon: Shield,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  // {
  //   title: "Notifications",
  //   url: "/notifications",
  //   icon: Bell,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();

  const onLogout = () => {
    // Handle logout logic here, e.g., clear user session, redirect to login page,
    // or call an API to log out the user.
    console.log("User logged out");
    // Example: redirect to login page
    // window.location.href = '/login';
  };

  return (
    <Sidebar className="w-64 h-screen bg-[#f9fafb] border-r shadow-sm">
      <SidebarHeader className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-800">
              Almaleek Top Up
            </span>
            <span className="text-xs text-gray-500">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto bg-green-200">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((child) => {
                const isActive = pathname === child.url;
                return (
                  <SidebarMenuItem key={child.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={child.url}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-150 text-sm font-medium",
                          isActive
                            ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                            : "text-gray-600 hover:bg-gray-100 hover:text-green-700"
                        )}
                      >
                        <child.icon className="w-5 h-5" />
                        <span>{child.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-green-200 border-t px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start gap-3 text-sm text-red-500 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
