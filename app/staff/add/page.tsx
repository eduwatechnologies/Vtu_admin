"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { StaffForm } from "@/components/staff/staff-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addStaffMember, logActivity } from "@/lib/redux/slices/staffSlice";
import { useSession } from "next-auth/react";
import { PermissionGuard } from "@/components/rbac/permission-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";

export default function AddStaffPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      // Add the staff member
      const resultAction = await dispatch(
        addStaffMember({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          password: formData.password,
        })
      );

      // Log the activity
      if (session?.user) {
        await dispatch(
          logActivity({
            staffId: session.user.id,
            staffName: session.user.name,
            action: "CREATE",
            description: `Created new staff member: ${formData.name}`,
            module: "staff",
            metadata: { staffId: resultAction.payload.id },
          })
        );
      }

      // Redirect to staff list
      router.push("/staff");
    } catch (error) {
      console.error("Error adding staff member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Staff Member
          </h1>
          <p className="text-muted-foreground">Create a new staff account</p>
        </div>

        <PermissionGuard
          requiredPermission="perm_staff_manage"
          fallback={
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
                  Access Denied
                </CardTitle>
                <CardDescription>
                  You don't have permission to add staff members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Please contact an administrator if you need access to this
                  feature.
                </p>
              </CardContent>
            </Card>
          }
        >
          <StaffForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </PermissionGuard>
      </main>
    </AdminLayout>
  );
}
