import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Service {
  id: string
  name: string
  category: string
  provider: string
  status: "enabled" | "disabled"
  lastUpdated: string
}

interface ServiceState {
  services: Service[]
  serviceStatuses: Record<string, boolean>
  isLoading: boolean
  error: string | null
}

const initialState: ServiceState = {
  services: [],
  serviceStatuses: {},
  isLoading: false,
  error: null,
}

export const fetchServices = createAsyncThunk("services/fetchServices", async () => {
  // Simulating API fetch
  const services: Service[] = [
    {
      id: "SRV001",
      name: "MTN Airtime",
      category: "Airtime",
      provider: "VTpass",
      status: "enabled",
      lastUpdated: "2024-01-15 10:30 AM",
    },
    // More services would be here
  ]

  return services
})

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    toggleServiceStatus: (state, action: PayloadAction<{ serviceId: string; enabled: boolean }>) => {
      const { serviceId, enabled } = action.payload
      state.serviceStatuses[serviceId] = enabled

      // Update the actual service status
      const service = state.services.find((service) => service.id === serviceId)
      if (service) {
        service.status = enabled ? "enabled" : "disabled"
      }
    },
    setInitialServiceStatuses: (state) => {
      const statusMap: Record<string, boolean> = {}
      state.services.forEach((service) => {
        statusMap[service.id] = service.status === "enabled"
      })
      state.serviceStatuses = statusMap
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = action.payload
        // Initialize service statuses
        const statusMap: Record<string, boolean> = {}
        action.payload.forEach((service) => {
          statusMap[service.id] = service.status === "enabled"
        })
        state.serviceStatuses = statusMap
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch services"
      })
  },
})

export const { toggleServiceStatus, setInitialServiceStatuses } = serviceSlice.actions
export default serviceSlice.reducer
