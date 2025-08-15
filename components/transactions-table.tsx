"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function TransactionsTable() {
  const { filteredTransactions, isLoading } = useAppSelector(
    (state) => state.transactions
  );

  const [selectedTx, setSelectedTx] = useState<any>(null); // track selected transaction
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (tx: any) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTx(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading transactions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-pulse h-40 flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Network/Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    TRNS{transaction._id.slice(-3)}
                  </TableCell>
                  <TableCell>{transaction.userId.firstName}</TableCell>
                  <TableCell>{transaction.service}</TableCell>
                  <TableCell>{transaction.network || "Fund"}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openModal(transaction)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View log</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for Failed Transaction Details */}
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Transaction Details</DialogTitle>
      <DialogDescription>
        {selectedTx?.status === "failed"
          ? "This transaction failed. See error details below."
          : "Full transaction details"}
      </DialogDescription>
    </DialogHeader>

    {selectedTx && (
      <div className="space-y-2 mt-4 text-sm">
        <p>
          <strong>Service:</strong> {selectedTx.service}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              selectedTx.status === "success"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {selectedTx.status}
          </span>
        </p>
        <p>
          <strong>Date:</strong>
          {new Date(selectedTx.transaction_date).toLocaleString()}
        </p>
        <p>
          <strong>Amount:</strong> ₦{selectedTx.amount?.toLocaleString()}
        </p>
        {selectedTx.network && (
          <p>
            <strong>Network:</strong> {selectedTx.network}
          </p>
        )}
        {selectedTx.mobile_no && (
          <p>
            <strong>Mobile No:</strong> {selectedTx.mobile_no}
          </p>
        )}
        {selectedTx.data_type && (
          <p>
            <strong>Data Type:</strong> {selectedTx.data_type}
          </p>
        )}
        {selectedTx.previous_balance !== undefined && (
          <p>
            <strong>Previous Balance:</strong> ₦
            {selectedTx.previous_balance?.toLocaleString()}
          </p>
        )}
        {selectedTx.new_balance !== undefined && (
          <p>
            <strong>New Balance:</strong> ₦
            {selectedTx.new_balance?.toLocaleString()}
          </p>
        )}

        {selectedTx.message && (
          <p>
            <strong>Message:</strong> {selectedTx.message}
          </p>
        )}

        {selectedTx.reference_no && (
          <p>
            <strong>Reference No:</strong> {selectedTx.reference_no}
          </p>
        )}

        {selectedTx.raw_response && (
          <div>
            <strong>Raw Response:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm max-h-48 overflow-auto w-96">
              {JSON.stringify(
                typeof selectedTx.raw_response === "string"
                  ? JSON.parse(selectedTx.raw_response)
                  : selectedTx.raw_response,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    )}

    <DialogFooter>
      <Button onClick={closeModal}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </>
  );
}
