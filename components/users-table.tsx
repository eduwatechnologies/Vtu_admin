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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  CreditCard,
  Ban,
  CheckCircle,
  Wallet,
  Key,
  Lock,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  DefundUser,
  RefundUser,
  toggleUserStatus,
  updatePassword,
  updatePin,
  updateStatus,
} from "@/lib/redux/slices/userSlice";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export function UsersTable() {
  const dispatch = useAppDispatch();
  const { filteredUsers } = useAppSelector((state) => state.users);

  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"credit" | "debit">(
    "credit"
  );
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetType, setResetType] = useState<"pin" | "password">("pin");
  const router = useRouter();

  const selectedUser = filteredUsers.find(
    (user) => user._id === selectedUserId
  );
  const selectedUsers = useSelector(
    (state: RootState) => state.users.selectedUser
  );

  const handleWalletAction = (userId: string, type: "credit" | "debit") => {
    setSelectedUserId(userId);
    setTransactionType(type);
    setWalletDialogOpen(true);
  };

  const handleResetAction = (userId: string, type: "pin" | "password") => {
    setSelectedUserId(userId);
    setResetType(type);
    setResetDialogOpen(true);
  };

  const handleStatusToggle = (userId: string) => {
    dispatch(updateStatus(userId));
  };

  const handleWalletSubmit = async () => {
    if (selectedUserId && amount) {
      try {
        if (transactionType === "credit") {
          await dispatch(
            RefundUser({ userId: selectedUserId, amount })
          ).unwrap();
        } else {
          await dispatch(
            DefundUser({ userId: selectedUserId, amount })
          ).unwrap();
        }

        toast({
          title: "Wallet Updated",
          description: `₦${amount} ${
            transactionType === "credit" ? "added to" : "removed from"
          } wallet.`,
        });

        setWalletDialogOpen(false);
        setAmount("");
      } catch (error) {
        toast({
          title: "Update failed",
          description: "Could not update wallet balance.",
        });
        console.error(error);
      }
    }
  };

  // const handleResetSubmit = async () => {
  //   try {
  //     if (!selectedUser?._id) {
  //       toast({
  //         title: "User not selected",
  //         description: "Please select a user before resetting.",
  //       });
  //       return;
  //     }

  //     if (resetType === "password") {
  //       await dispatch(
  //         updatePassword({
  //           userId: selectedUser._id,
  //           newPassword: "1111111111",
  //         })
  //       ).unwrap();
  //     } else {
  //       await dispatch(
  //         updatePin({ userId: selectedUser._id, newpin: "2323" })
  //       ).unwrap();
  //     }

  //     toast({
  //       title: "Wallet Updated",
  //       description: `₦${amount} ${
  //         transactionType === "credit" ? "added to" : "removed from"
  //       } wallet.`,
  //     });
  //     setResetDialogOpen(false);
  //   } catch (error) {
  //     toast({
  //       title: "Update failed",
  //       description: "Could not update wallet balance.",
  //     });
  //     console.error(error);
  //   }
  // };

  // PAGINATION

  const handleResetSubmit = async () => {
    try {
      if (!selectedUser?._id) {
        toast({
          title: "User not selected",
          description: "Please select a user before resetting credentials.",
        });
        return;
      }

      if (resetType === "password") {
        await dispatch(
          updatePassword({
            userId: selectedUser._id,
            newPassword: "100001",
          })
        ).unwrap();

        toast({
          title: "Password Reset Successful",
          description: `Password for ${
            selectedUser?.firstName || "this user"
          } has been reset to default.`,
        });
      } else {
        await dispatch(
          updatePin({
            userId: selectedUser._id,
            newpin: "1001",
          })
        ).unwrap();

        toast({
          title: "PIN Reset Successful",
          description: `Transaction PIN for ${
            selectedUser?.firstName || "this user"
          } has been reset to default.`,
        });
      }

      setResetDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Reset Failed",
        description:
          "An error occurred while resetting the user’s credentials.",
      });
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 100;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Showing {filteredUsers.length} users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>PIN Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user._id as any}>
                <TableCell className="font-medium">
                  USR{user._id.slice(-3)}
                </TableCell>
                <TableCell>
                  {user.firstName} {user?.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>N{user.balance}</TableCell>
                <TableCell>
                  {user.pinStatus === true ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Set
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border border-gray-300">
                      Not Set
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.status === "active" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      Suspended
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
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
                        onClick={() => router.push(`/users/${user._id}`)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>View Detail</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleWalletAction(user._id, "credit")}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Credit Wallet</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleWalletAction(user._id, "debit")}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Debit Wallet</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleResetAction(user._id, "pin")}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        <span>Reset PIN</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleResetAction(user._id, "password")}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Reset Password</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(user._id)}
                      >
                        {user.status === "active" ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Suspend Account</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Activate Account</span>
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>

        {/* Wallet Dialog */}
        <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {transactionType === "credit" ? "Credit" : "Debit"} User Wallet
              </DialogTitle>
              <DialogDescription>
                {selectedUser && (
                  <span>
                    {transactionType === "credit"
                      ? "Add funds to"
                      : "Remove funds from"}{" "}
                    {selectedUser.lastName}'s wallet. Current balance:{" "}
                    {selectedUser.balance}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setWalletDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWalletSubmit}
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                {transactionType === "credit" ? "Credit" : "Debit"} Wallet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Dialog */}
        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Reset User {resetType === "pin" ? "PIN" : "Password"}
              </DialogTitle>
              <DialogDescription>
                {selectedUser && (
                  <span>
                    This will reset the{" "}
                    {resetType === "pin" ? "PIN" : "password"} for{" "}
                    {selectedUser.lastName}.
                    {resetType === "pin"
                      ? " A new PIN will be generated and sent to the user's phone number."
                      : " A temporary password will be generated and sent to the user's email address."}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setResetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetSubmit}
                variant="destructive"
                className="text-white"
              >
                Reset {resetType === "pin" ? "PIN" : "Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
