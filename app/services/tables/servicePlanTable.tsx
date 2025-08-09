import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicePlan } from "@/lib/redux/slices/service/type";
import { ConfirmDeleteDialog } from "@/components/commons/alert/confirm";

export function PlansTable({
  plans,
  subName,
  onEdit,
  onDelete,
}: {
  subName: string;
  plans: ServicePlan[];
  onEdit: (plan: ServicePlan) => void;
  onDelete: (planId: string) => void;
}) {
  return (
    <div className="p-4">
      <h4 className="font-semibold mb-2">{subName} Plans</h4>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead>Plan Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.category}</TableCell>
                <TableCell>{plan.ourPrice}</TableCell>
                <TableCell>{plan.validity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(plan)}>
                        Edit
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() => onDelete(plan?._id as any)}
                      >
                        Delete
                      </DropdownMenuItem> */}

                      <ConfirmDeleteDialog
                        itemName={plan?.name}
                        onConfirm={() => onDelete(plan?._id as any)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
