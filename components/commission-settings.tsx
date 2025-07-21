"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus } from "lucide-react"

const commissions = [
  {
    id: "COM001",
    service: "MTN Airtime",
    type: "percentage",
    value: "2.5",
    minAmount: "₦100",
    maxAmount: "₦50,000",
    status: "active",
  },
  {
    id: "COM002",
    service: "Airtel Data",
    type: "fixed",
    value: "₦50",
    minAmount: "₦500",
    maxAmount: "₦20,000",
    status: "active",
  },
  {
    id: "COM003",
    service: "Glo Airtime",
    type: "percentage",
    value: "3.0",
    minAmount: "₦100",
    maxAmount: "₦30,000",
    status: "active",
  },
  {
    id: "COM004",
    service: "DSTV Subscription",
    type: "fixed",
    value: "₦100",
    minAmount: "₦2,000",
    maxAmount: "₦50,000",
    status: "active",
  },
  {
    id: "COM005",
    service: "Electricity Bills",
    type: "percentage",
    value: "1.5",
    minAmount: "₦1,000",
    maxAmount: "₦100,000",
    status: "active",
  },
]

export function CommissionSettings() {
  const [editingCommission, setEditingCommission] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (commission: any) => {
    setEditingCommission(commission)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    // In a real app, this would call an API to save the commission settings
    console.log("Saving commission:", editingCommission)
    setIsDialogOpen(false)
    setEditingCommission(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Settings</CardTitle>
        <CardDescription>Configure commission rates for different services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCommission({})} className="text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Commission Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCommission?.id ? "Edit Commission" : "Add Commission Rule"}</DialogTitle>
                <DialogDescription>Configure commission settings for a service</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn-airtime">MTN Airtime</SelectItem>
                      <SelectItem value="airtel-airtime">Airtel Airtime</SelectItem>
                      <SelectItem value="glo-airtime">Glo Airtime</SelectItem>
                      <SelectItem value="9mobile-airtime">9mobile Airtime</SelectItem>
                      <SelectItem value="mtn-data">MTN Data</SelectItem>
                      <SelectItem value="airtel-data">Airtel Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Commission Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Commission Value</Label>
                  <Input id="value" placeholder="e.g., 2.5 or 50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minAmount">Min Amount</Label>
                    <Input id="minAmount" placeholder="₦100" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxAmount">Max Amount</Label>
                    <Input id="maxAmount" placeholder="₦50,000" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="text-white bg-blue-600 hover:bg-blue-700">
                  Save Commission
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Amount</TableHead>
              <TableHead>Max Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-medium">{commission.service}</TableCell>
                <TableCell className="capitalize">{commission.type}</TableCell>
                <TableCell>{commission.type === "percentage" ? `${commission.value}%` : commission.value}</TableCell>
                <TableCell>{commission.minAmount}</TableCell>
                <TableCell>{commission.maxAmount}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                    {commission.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(commission)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
