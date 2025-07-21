"use client";

import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { TransactionsTable } from "@/components/transactions-table";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchTransactions,
  setTransactionFilter,
  resetTransactionFilters,
} from "@/lib/redux/slices/transactionSlice";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { currentFilter } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setTransactionFilter({ [key]: value }));
  };

  const resetFilters = () => {
    dispatch(resetTransactionFilters());
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all transactions on your VTU platform
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Input
                    id="user"
                    placeholder="Search by user"
                    value={currentFilter.user}
                    onChange={(e) => handleFilterChange("user", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select
                    value={currentFilter.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="airtime">Airtime</SelectItem>
                      <SelectItem value="data-bundle">Data Bundle</SelectItem>
                      <SelectItem value="bill-payment">Bill Payment</SelectItem>
                      <SelectItem value="wallet-funding">
                        Wallet Funding
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={currentFilter.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !currentFilter.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentFilter.startDate
                          ? format(currentFilter.startDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentFilter.startDate}
                        onSelect={(date) =>
                          handleFilterChange("startDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !currentFilter.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentFilter.endDate
                          ? format(currentFilter.endDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentFilter.endDate}
                        onSelect={(date) => handleFilterChange("endDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mr-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Reset Filters
                </Button>
                <Button className="text-white bg-blue-600 hover:bg-blue-700">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <TransactionsTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
