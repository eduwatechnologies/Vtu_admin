"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ExpandToggleButton } from "./components/ExpandableRow";
import { FormDialog } from "./components/formDailog";
import { SubServicesTable } from "./tables/subServiceTable";
import {
  addService,
  addSubService,
  deleteService,
  fetchServices,
  toggleSubServiceStatus,
  updateService,
} from "@/lib/redux/slices/service/serviceThunk";
import { setServiceSearchQuery } from "@/lib/redux/slices/service/serviceSlice";
import { SubServiceForm } from "./forms/subService";
import { useToast } from "@/hooks/use-toast";

export default function ServicesPage() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { filteredServices, isLoading, error } = useAppSelector(
    (state) => state.services
  );

  useEffect(() => {
    if (error) {
      toast.toast({
        title: "Failed",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
    }
  }, [error]);

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null
  );
  const [expandedSubServiceId, setExpandedSubServiceId] = useState<
    string | null
  >(null);

  const [openDialogForService, setOpenDialogForService] = useState<
    string | null
  >(null);
  const [newSubName, setNewSubName] = useState("");
  const [newSubProvider, setNewSubProvider] = useState("");

  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceType, setNewServiceType] = useState("airtime");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [selectedService, setSelectedService] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setServiceSearchQuery(e.target.value));
  };

  const toggleExpandService = (id: string) => {
    setExpandedServiceId((prev) => (prev === id ? null : id));
    setExpandedSubServiceId(null); // reset subservice expansion
  };

  const toggleExpandSubService = (id: string) => {
    setExpandedSubServiceId((prev) => (prev === id ? null : id));
  };

  const handleToggleStatus = (subId: string) => {
    dispatch(toggleSubServiceStatus(subId));
  };

  const handleAddSubService = (serviceId: string) => {
    if (!newSubName || !newSubProvider) return;
    dispatch(
      addSubService({
        name: newSubName,
        provider: newSubProvider,
        serviceId,
        code: newSubName.toLowerCase().replace(/\s+/g, "-"),
        status: true,
        description: "",
      })
    );
    setNewSubName("");
    setNewSubProvider("");
    setOpenDialogForService(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Services Monitoring
            </h1>
            <p className="text-muted-foreground">
              Track usage and performance of VTU services
            </p>
          </div>

          {/* Search bar */}
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search services..."
              className="max-w-sm"
              onChange={handleSearch}
            />
            <Button onClick={() => setOpenServiceDialog(true)}>
              Add Service
            </Button>
          </div>

          {/* Table Section */}
          {isLoading ? (
            <p>Loading services...</p>
          ) : (
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Subservices</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => {
                    const expanded = expandedServiceId === service._id;
                    return (
                      <>
                        <TableRow
                          key={service._id}
                          className="hover:bg-muted/20"
                        >
                          <TableCell>
                            <ExpandToggleButton
                              expanded={expanded}
                              onToggle={() => toggleExpandService(service._id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {service.name}
                          </TableCell>
                          <TableCell>{service.type}</TableCell>
                          <TableCell>
                            <Switch checked={service.status} disabled />
                          </TableCell>
                          <TableCell>{service.description || "-"}</TableCell>
                          <TableCell className="text-center">
                            {service?.subServices?.length}
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedService(service);
                                    setNewServiceName(service.name);
                                    setNewServiceType(service.type);
                                    setNewServiceDescription(
                                      service.description || ""
                                    );
                                    setOpenServiceDialog(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(deleteService(service._id));
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    setOpenDialogForService(service._id)
                                  }
                                >
                                  Add Subservice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Expandable sub-services table */}
                        {expanded && service.subServices?.length > 0 && (
                          <TableRow className="bg-muted/10">
                            <TableCell colSpan={7}>
                              <div className="p-4 space-y-6">
                                <h3 className="font-semibold">Subservices</h3>
                                <div className="border rounded-lg overflow-hidden">
                                  <SubServicesTable
                                    subServices={service.subServices}
                                    expandedSubServiceId={expandedSubServiceId}
                                    onToggleSubService={toggleExpandSubService}
                                    onToggleStatus={handleToggleStatus}
                                    onAddPlan={(sub: any) =>
                                      console.log("Add plan", sub)
                                    }
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <FormDialog
            open={openServiceDialog}
            onOpenChange={() => {
              setOpenServiceDialog(false);
              setSelectedService(null); // reset when closing
            }}
            title={selectedService ? "Edit Service" : "Add Service"}
          >
            <div className="space-y-4">
              <Input
                placeholder="Service name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
              />
              <Input
                placeholder="Type (airtime, data, electricity, etc.)"
                value={newServiceType}
                onChange={(e) => setNewServiceType(e.target.value)}
              />
              <Input
                placeholder="Description"
                value={newServiceDescription}
                onChange={(e) => setNewServiceDescription(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  if (selectedService) {
                    dispatch(
                      updateService({
                        id: selectedService._id,
                        data: {
                          name: newServiceName,
                          type: newServiceType as any,
                          description: newServiceDescription,
                          status: selectedService.status,
                        },
                      })
                    );
                  } else {
                    dispatch(
                      addService({
                        name: newServiceName,
                        type: newServiceType as any,
                        description: newServiceDescription,
                        status: true,
                      })
                    );
                  }

                  setOpenServiceDialog(false);
                  setSelectedService(null);
                  setNewServiceName("");
                  setNewServiceType("airtime");
                  setNewServiceDescription("");
                }}
              >
                {selectedService ? "Update" : "Add"}
              </Button>
            </div>
          </FormDialog>

          <FormDialog
            open={!!openDialogForService}
            onOpenChange={() => setOpenDialogForService(null)}
            title="Add Subservice"
          >
            {openDialogForService && (
              <SubServiceForm
                serviceId={openDialogForService}
                onSubmitSuccess={() => {
                  setOpenDialogForService(null); // close modal on success
                }}
              />
            )}
          </FormDialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
