"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, TestTube, Mail, MessageSquare, Bell } from "lucide-react"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    failedTransactions: true,
    largeFunding: true,
    systemDowntime: true,
    dailyReports: false,
    weeklyReports: true,
    userRegistrations: false,
    lowBalance: true,
  })

  const [smsNotifications, setSmsNotifications] = useState({
    criticalErrors: true,
    systemDowntime: true,
    largeFunding: true,
    failedTransactions: false,
  })

  const handleEmailToggle = (key: string, value: boolean) => {
    setEmailNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleSmsToggle = (key: string, value: boolean) => {
    setSmsNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    console.log("Saving notification settings...")
  }

  const handleTestEmail = () => {
    console.log("Sending test email...")
  }

  const handleTestSms = () => {
    console.log("Sending test SMS...")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Configure email notifications for various events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="emailRecipients">Email Recipients</Label>
              <Input
                id="emailRecipients"
                placeholder="admin@yourvtu.com, support@yourvtu.com"
                defaultValue="admin@yourvtu.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emailFrom">From Email</Label>
              <Input id="emailFrom" defaultValue="noreply@yourvtu.com" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Email Notification Events</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Failed Transactions</Label>
                  <p className="text-sm text-muted-foreground">Get notified when transactions fail</p>
                </div>
                <Switch
                  checked={emailNotifications.failedTransactions}
                  onCheckedChange={(checked) => handleEmailToggle("failedTransactions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Large Funding</Label>
                  <p className="text-sm text-muted-foreground">Notify for wallet funding above ₦50,000</p>
                </div>
                <Switch
                  checked={emailNotifications.largeFunding}
                  onCheckedChange={(checked) => handleEmailToggle("largeFunding", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Downtime</Label>
                  <p className="text-sm text-muted-foreground">Alert when VTpass API is down</p>
                </div>
                <Switch
                  checked={emailNotifications.systemDowntime}
                  onCheckedChange={(checked) => handleEmailToggle("systemDowntime", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Balance Alert</Label>
                  <p className="text-sm text-muted-foreground">Alert when platform balance is low</p>
                </div>
                <Switch
                  checked={emailNotifications.lowBalance}
                  onCheckedChange={(checked) => handleEmailToggle("lowBalance", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Reports</Label>
                  <p className="text-sm text-muted-foreground">Daily transaction summary</p>
                </div>
                <Switch
                  checked={emailNotifications.dailyReports}
                  onCheckedChange={(checked) => handleEmailToggle("dailyReports", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Weekly performance summary</p>
                </div>
                <Switch
                  checked={emailNotifications.weeklyReports}
                  onCheckedChange={(checked) => handleEmailToggle("weeklyReports", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registrations</Label>
                  <p className="text-sm text-muted-foreground">Notify when new users register</p>
                </div>
                <Switch
                  checked={emailNotifications.userRegistrations}
                  onCheckedChange={(checked) => handleEmailToggle("userRegistrations", checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleTestEmail}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Send Test Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>Configure SMS notifications for critical events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="smsRecipients">SMS Recipients</Label>
              <Input id="smsRecipients" placeholder="+234 800 123 4567, +234 801 234 5678" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="smsProvider">SMS Provider</Label>
              <Select defaultValue="termii">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="termii">Termii</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="nexmo">Nexmo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">SMS Notification Events</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Critical System Errors</Label>
                  <p className="text-sm text-muted-foreground">Immediate alerts for critical issues</p>
                </div>
                <Switch
                  checked={smsNotifications.criticalErrors}
                  onCheckedChange={(checked) => handleSmsToggle("criticalErrors", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Downtime</Label>
                  <p className="text-sm text-muted-foreground">Alert when services are unavailable</p>
                </div>
                <Switch
                  checked={smsNotifications.systemDowntime}
                  onCheckedChange={(checked) => handleSmsToggle("systemDowntime", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Large Funding</Label>
                  <p className="text-sm text-muted-foreground">SMS for funding above ₦100,000</p>
                </div>
                <Switch
                  checked={smsNotifications.largeFunding}
                  onCheckedChange={(checked) => handleSmsToggle("largeFunding", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Failed Transactions</Label>
                  <p className="text-sm text-muted-foreground">SMS alerts for transaction failures</p>
                </div>
                <Switch
                  checked={smsNotifications.failedTransactions}
                  onCheckedChange={(checked) => handleSmsToggle("failedTransactions", checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleTestSms}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Send Test SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Thresholds
          </CardTitle>
          <CardDescription>Set thresholds for automatic notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="largeFundingThreshold">Large Funding Threshold</Label>
              <Input id="largeFundingThreshold" type="number" defaultValue="50000" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lowBalanceThreshold">Low Balance Threshold</Label>
              <Input id="lowBalanceThreshold" type="number" defaultValue="10000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="failedTransactionThreshold">Failed Transaction Alert (per hour)</Label>
              <Input id="failedTransactionThreshold" type="number" defaultValue="10" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="responseTimeThreshold">Slow Response Alert (seconds)</Label>
              <Input id="responseTimeThreshold" type="number" defaultValue="10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>Customize notification message templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="failedTransactionTemplate">Failed Transaction Template</Label>
            <Textarea
              id="failedTransactionTemplate"
              placeholder="Transaction failed: {transaction_id} for user {user_name}..."
              defaultValue="ALERT: Transaction {transaction_id} failed for user {user_name}. Amount: {amount}. Reason: {failure_reason}. Time: {timestamp}"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="downtimeTemplate">System Downtime Template</Label>
            <Textarea
              id="downtimeTemplate"
              placeholder="System downtime detected..."
              defaultValue="CRITICAL: VTU services are currently unavailable. Downtime detected at {timestamp}. Investigating the issue."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="largeFundingTemplate">Large Funding Template</Label>
            <Textarea
              id="largeFundingTemplate"
              placeholder="Large funding detected..."
              defaultValue="Large funding alert: User {user_name} funded wallet with {amount} at {timestamp}. New balance: {new_balance}"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="text-white bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
