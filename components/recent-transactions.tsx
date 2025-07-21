"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  {
    id: "TXN001",
    user: "John Doe",
    type: "Airtime",
    network: "MTN",
    amount: "₦1,000",
    status: "completed",
    date: "2024-01-15 10:30 AM",
  },
  {
    id: "TXN002",
    user: "Jane Smith",
    type: "Data Bundle",
    network: "Airtel",
    amount: "₦2,500",
    status: "completed",
    date: "2024-01-15 09:45 AM",
  },
  {
    id: "TXN003",
    user: "Mike Johnson",
    type: "Bill Payment",
    network: "NEPA",
    amount: "₦5,000",
    status: "pending",
    date: "2024-01-15 09:15 AM",
  },
  {
    id: "TXN004",
    user: "Sarah Wilson",
    type: "Airtime",
    network: "Glo",
    amount: "₦500",
    status: "failed",
    date: "2024-01-15 08:30 AM",
  },
  {
    id: "TXN005",
    user: "David Brown",
    type: "Data Bundle",
    network: "9mobile",
    amount: "₦1,500",
    status: "completed",
    date: "2024-01-15 08:00 AM",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Completed</Badge>
    case "pending":
      return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-200">Pending</Badge>
    case "failed":
      return <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Failed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest VTU transactions from your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.user}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.network}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
