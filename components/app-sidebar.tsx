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

  {
    title: "Staff",
    url: "/staff",
    icon: UserCog,
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
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
    <Sidebar className="w-64 bg-white">
      <SidebarHeader className="bg-white">
        <div className="flex items-center gap-2 px-2 py-2 bg-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">VTU Platform</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
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
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                          isActive
                            ? "bg-blue-600/10 border-l-2 border-primary font-medium !text-primary"
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <child.icon className="w-6 h-6" />
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
      <SidebarFooter className="bg-white border-t">
        <div className="px-3 pb-3 space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/help"}>
                <Link href="/help" className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 " />
                  <span className="text-sm">Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
