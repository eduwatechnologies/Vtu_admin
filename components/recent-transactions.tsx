"use client";

import { Badge } from "@/components/ui/badge";
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

interface Transaction {
  transactionData: any;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge className="bg-green-100 text-green-700">Success</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getNetworkColor = (network: string) => {
  const colors: Record<string, string> = {
    MTN: "text-warning font-semibold",
    AIRTEL: "text-destructive font-semibold",
    GLO: "text-success font-semibold",
    Fund: "text-primary font-semibold",
  };
  return colors[network] || "text-foreground";
};

export function RecentTransactions({ transactionData }: Transaction) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Latest VTU transactions from your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-muted-foreground font-medium">
                Transaction ID
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                User
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Type
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Network
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Amount
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData.map((transaction: any) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium text-primary  ">
                  TRNS{transaction._id.slice(-5)}
                </TableCell>

                <TableCell className="font-medium text-foreground">
                  {transaction.userId?.firstName || "N/A"}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {transaction.service}
                </TableCell>

                <TableCell className={getNetworkColor(transaction.network)}>
                  {transaction?.network?.toUpperCase() || "Fund"}
                </TableCell>

                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {/* <TableBody>
            {transactionData.map((transaction: any, index: number) => (
              <TableRow
                key={transaction.id}
                className="hover:bg-muted/50 transition-colors border-border"
                // style={{
                //   animation: "slideUp 0.3s ease-out forwards",
                //   animationDelay: `${500 + index * 50}ms`,
                //   opacity: 0,
                // }}
              >
                <TableCell className="font-medium text-primary">
                  {transaction.id}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {transaction.user}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.type}
                </TableCell>
                <TableCell className={getNetworkColor(transaction.network)}>
                  {transaction.network}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "Success"
                        ? "default"
                        : transaction.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      transaction.status === "Success"
                        ? "bg-success/10 text-success hover:bg-success/20 border-0"
                        : ""
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      </CardContent>
    </Card>
  );
}
