"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommissionSettings } from "@/components/commission-settings";
import { ServiceSettings } from "@/components/service-settings";
import { GeneralSettings } from "@/components/general-settings";
import { AdminLayout } from "@/components/admin-layout";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your VTU platform configuration
          </p>
        </div>

        <Tabs defaultValue="commissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="commissions">
            <CommissionSettings />
          </TabsContent>

          <TabsContent value="services">
            <ServiceSettings />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
        </Tabs>
      </main>
    </AdminLayout>
  );
}
