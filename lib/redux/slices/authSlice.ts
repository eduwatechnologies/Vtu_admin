import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { signIn, signOut } from "next-auth/react"

type AuthState = {
  user: {
    id?: string
    name?: string
    email?: string
    role?: string
  } | null
  status: "idle" | "loading" | "authenticated" | "error"
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!response) {
        return rejectWithValue("Network error occurred")
      }

      if (response.error) {
        return rejectWithValue(response.error)
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return rejectWithValue("Login failed. Please try again.")
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut({ redirect: false })
  return true
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload
      state.status = action.payload ? "authenticated" : "idle"
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = "authenticated"
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error"
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.status = "idle"
      })
  },
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer
