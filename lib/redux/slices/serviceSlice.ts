// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// interface Service {
//   id: string
//   name: string
//   category: string
//   provider: string
//   status: "enabled" | "disabled"
//   lastUpdated: string
// }

// interface ServiceState {
//   services: Service[]
//   serviceStatuses: Record<string, boolean>
//   isLoading: boolean
//   error: string | null
// }

// const initialState: ServiceState = {
//   services: [],
//   serviceStatuses: {},
//   isLoading: false,
//   error: null,
// }

// export const fetchServices = createAsyncThunk("services/fetchServices", async () => {
//   // Simulating API fetch
//   const services: Service[] = [
//     {
//       id: "SRV001",
//       name: "MTN Airtime",
//       category: "Airtime",
//       provider: "VTpass",
//       status: "enabled",
//       lastUpdated: "2024-01-15 10:30 AM",
//     },
//     // More services would be here
//   ]

//   return services
// })

// const serviceSlice = createSlice({
//   name: "services",
//   initialState,
//   reducers: {
//     toggleServiceStatus: (state, action: PayloadAction<{ serviceId: string; enabled: boolean }>) => {
//       const { serviceId, enabled } = action.payload
//       state.serviceStatuses[serviceId] = enabled

//       // Update the actual service status
//       const service = state.services.find((service) => service.id === serviceId)
//       if (service) {
//         service.status = enabled ? "enabled" : "disabled"
//       }
//     },
//     setInitialServiceStatuses: (state) => {
//       const statusMap: Record<string, boolean> = {}
//       state.services.forEach((service) => {
//         statusMap[service.id] = service.status === "enabled"
//       })
//       state.serviceStatuses = statusMap
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchServices.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(fetchServices.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.services = action.payload
//         // Initialize service statuses
//         const statusMap: Record<string, boolean> = {}
//         action.payload.forEach((service) => {
//           statusMap[service.id] = service.status === "enabled"
//         })
//         state.serviceStatuses = statusMap
//       })
//       .addCase(fetchServices.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.error.message || "Failed to fetch services"
//       })
//   },
// })

// export const { toggleServiceStatus, setInitialServiceStatuses } = serviceSlice.actions
// export default serviceSlice.reducer


// src/features/vtu/vtuSlice.ts
import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

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
}

export interface Service {
  _id: string;
  name: string;
  type: "airtime" | "data" | "electricity" | "cable" | "other";
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  subServices: SubService[];
}

interface VtuState {
  services: Service[];
  filteredServices: Service[];
  selectedService: Service | null;
  selectedSubService: SubService | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: VtuState = {
  services: [],
  filteredServices: [],
  selectedService: null,
  selectedSubService: null,
  searchQuery: "",
  isLoading: false,
  error: null,
};

// Fetch all services with subservices
export const fetchServices = createAsyncThunk(
  "vtu/fetchServices",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/services/with-subservices");
      return res.data as Service[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch services"
      );
    }
  }
);

// Toggle subservice status
export const toggleSubServiceStatus = createAsyncThunk(
  "vtu/toggleSubServiceStatus",
  async (id: string, thunkAPI) => {
    try {
      const res = await axiosInstance.patch(`/subservices/${id}/toggle-status`);
      return res.data.data as SubService;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to toggle subservice"
      );
    }
  }
);

// Add a new service
export const addService = createAsyncThunk(
  "vtu/addService",
  async (
    serviceData: Omit<Service, "_id" | "createdAt" | "updatedAt" | "subServices">,
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.post("/services", serviceData);
      return { ...res.data.data, subServices: [] } as Service;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to add service"
      );
    }
  }
);

// Add a new subservice
export const addSubService = createAsyncThunk(
  "vtu/addSubService",
  async (
    subServiceData: Omit<SubService, "_id" | "createdAt" | "updatedAt">,
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.post("/subservices", subServiceData);
      return res.data.data as SubService;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to add subservice"
      );
    }
  }
);
const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setServiceSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredServices = state.services.filter((service) =>
        service.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    selectService: (state, action: PayloadAction<string>) => {
      state.selectedService =
        state.services.find((s) => s._id === action.payload) || null;
    },
    selectSubService: (state, action: PayloadAction<string>) => {
      for (const service of state.services) {
        const sub = service.subServices.find((s) => s._id === action.payload);
        if (sub) {
          state.selectedSubService = sub;
          return;
        }
      }
      state.selectedSubService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
        state.filteredServices = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Toggle subservice status
      .addCase(toggleSubServiceStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const parent = state.services.find(
          (s) => s._id === updated.serviceId
        );
        if (parent) {
          const sub = parent.subServices.find((s) => s._id === updated._id);
          if (sub) {
            sub.status = updated.status;
          }
        }
      })

      // Add service
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
        state.filteredServices = state.services;
      })

      // Add subservice
      .addCase(addSubService.fulfilled, (state, action) => {
        const sub = action.payload;
        const parent = state.services.find((s) => s._id === sub.serviceId);
        if (parent) {
          parent.subServices.push(sub);
        }
      });
  },
});

export const { setServiceSearchQuery, selectService, selectSubService } =
  serviceSlice.actions;

export default serviceSlice.reducer;

