"use client";
import { NotificationSettings } from "@/components/notification-settings";
import { AdminLayout } from "@/components/admin-layout";

export default function NotificationsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Configure email and SMS notifications for important events
          </p>
        </div>

        <NotificationSettings />
      </main>
    </AdminLayout>
  );
}
