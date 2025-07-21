import type React from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Payonce Dashboard",
  description: "Admin dashboard for VTU services",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50">
        <AuthProvider>
          <ReduxProvider>{children}</ReduxProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
