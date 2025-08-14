"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchUserDetail } from "@/lib/redux/slices/userSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

type Transaction = {
  createdAt?: string;
  date?: string;
  amount: number | string;
  network?: string;
  transaction_type?: string;
  status: "Success" | "Pending" | "Failed";
};

type TransactionTab =
  | "airtime"
  | "data"
  | "electricity"
  | "cable_tv"
  | "wallet"
  | "others";

export default function UserDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    selectedUserDetail: user,
    transactions,
    detailLoading,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (id) dispatch(fetchUserDetail(id as string));
  }, [dispatch, id]);

  const getTotals = (txs: Transaction[] = []) => ({
    totalAmount: txs.reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    totalCount: txs.length,
  });

  const allTxs: Transaction[] = [
    ...(transactions.airtime || []),
    ...(transactions.data || []),
    ...(transactions.electricity || []),
    ...(transactions.cable_tv || []),
    ...(transactions.wallet || []),
    ...(transactions.others || []),
  ];
  const overallTotals = getTotals(allTxs);

  const renderTable = (data: Transaction[] = []) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((tx, index) => (
            <TableRow key={index}>
              <TableCell>
                {new Date(tx.createdAt || tx.date || "").toLocaleDateString()}
              </TableCell>
              <TableCell>₦{Number(tx.amount).toLocaleString()}</TableCell>
              <TableCell>
                {tx.network?.toUpperCase() || tx.transaction_type}
              </TableCell>
              <TableCell
                className={
                  tx.status === "Success"
                    ? "text-green-600  font-semibold"
                    : tx.status === "Pending"
                    ? "text-yellow-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {tx.status}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-gray-500">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          {detailLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading user details...</p>
            </div>
          ) : !user ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">User not found.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              <Card className="p-4 shadow-lg">
                <CardHeader className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="capitalize">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account</p>
                    <p>{`${user.account?.bankName} : ${user.account?.accountNumber}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={
                        user.status === "active"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {user.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p>{user.lastLogin || "Never"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p>{user.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wallet Balance</p>
                    <p className="text-blue-600 font-semibold">
                      ₦{Number(user.balance).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="font-semibold">{overallTotals.totalCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-green-600 font-semibold">
                      ₦{overallTotals.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <Tabs defaultValue="airtime" className="w-full">
                  <CardHeader>
                    <TabsList className="mb-4">
                      {(
                        [
                          "airtime",
                          "data",
                          "electricity",
                          "cable_tv",
                          "wallet",
                          "others",
                        ] as TransactionTab[]
                      ).map((tab) => (
                        <TabsTrigger key={tab} value={tab}>
                          {tab.replace("_", " ").toUpperCase()}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    {(
                      [
                        "airtime",
                        "data",
                        "electricity",
                        "cable_tv",
                        "wallet",
                        "others",
                      ] as TransactionTab[]
                    ).map((tab) => {
                      const totals = getTotals(transactions[tab]);
                      return (
                        <TabsContent key={tab} value={tab}>
                          <div className="mb-2 flex justify-between text-sm text-gray-600">
                            <span>Total Transactions: {totals.totalCount}</span>
                            <span>
                              Total Amount: ₦
                              {totals.totalAmount.toLocaleString()}
                            </span>
                          </div>
                          {renderTable(transactions[tab])}
                        </TabsContent>
                      );
                    })}
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
