export interface ServicePlan {
  _id: string;
  subServiceId: string;
  name: string;
  category?: string;
  ourPrice: number;
  validity?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubService {
  _id: string;
  serviceId: string;
  name: string;
  code: string;
  provider: string;
  status: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  servicePlans: ServicePlan[]; // Add this
}

export interface Service {
  _id: string;
  name: string;
  type: "airtime" | "data" | "electricity" | "cabletv" | "exampin";
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  subServices: SubService[];
}
