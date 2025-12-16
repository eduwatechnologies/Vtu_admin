"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StatsCards } from "@/components/stats-cards";
import { RecentTransactions } from "@/components/recent-transactions";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authSlice";
import { fetchTransactions } from "@/lib/redux/slices/transactionSlice";
import { fetchRoles, fetchPermissions } from "@/lib/redux/slices/staffSlice";
import {
  fetchOverallStats,
  fetchServiceBreakdown,
  fetchDailyStats,
} from "@/lib/redux/slices/statisticSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { AdminLayout } from "@/components/admin-layout";

export default function Dashboard() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const { overall, breakdown, daily, isLoading } = useSelector(
    (state: RootState) => state.statistics
  );
  const { transactions, currentPage } = useSelector(
    (state: RootState) => state.transactions
  );

  const [filter, setFilter] = useState<
    "day" | "week" | "month" | "year" | "all"
  >("all");

  // Show only 10 most recent
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    }

    dispatch(fetchTransactions(currentPage));
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [session, dispatch]);

  // 🔥 Refetch statistics when filter changes
  useEffect(() => {
    dispatch(fetchOverallStats(filter));
    dispatch(fetchServiceBreakdown(filter));
    dispatch(fetchDailyStats(filter));
  }, [dispatch, filter]);

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your VTU platform.
            </p>
          </div>

          {/* 🔥 Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-3 text-sm"
          >
            <option value="all">All</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {overall && <StatsCards overall={overall} breakdown={breakdown} />}

        <div className="grid gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions transactionData={recentTransactions} />
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
