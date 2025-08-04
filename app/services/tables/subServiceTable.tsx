import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExpandToggleButton } from "../components/ExpandableRow";
import { PlansTable } from "./servicePlanTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export function SubServicesTable({
  subServices,
  expandedSubServiceId,
  onToggleSubService,
  onToggleStatus,
  onAddPlan,
}: any) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/20">
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subServices.map((sub: any) => {
          const subExpanded = expandedSubServiceId === sub._id;
          return (
            <>
              <TableRow key={sub._id}>
                <TableCell>
                  <ExpandToggleButton
                    expanded={subExpanded}
                    onToggle={() => onToggleSubService(sub._id)}
                    children={undefined}
                  />
                </TableCell>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.code}</TableCell>
                <TableCell>
                  <Select defaultValue={sub.provider}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">autopilot</SelectItem>
                      <SelectItem value="airtel">easyaccess</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={sub.status}
                    onCheckedChange={() => onToggleStatus(sub._id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddPlan(sub)}>
                        Add Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              {subExpanded && sub.servicePlans?.length > 0 && (
                <TableRow key={`${sub._id}-plans`} className="bg-muted/5">
                  <TableCell colSpan={6}>
                    <PlansTable plans={sub.servicePlans} subName={sub.name} />
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}
