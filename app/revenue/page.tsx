"use client";
import { useEffect } from "react";
import { RevenueOverview } from "@/components/revenue-overview";
import { FailedTransactions } from "@/components/failed-transactions";
import { AdminLayout } from "@/components/admin-layout";

export default function RevenuePage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor revenue and failed transactions
          </p>
        </div>

        <RevenueOverview />

        <FailedTransactions />
      </main>
    </AdminLayout>
  );
}
