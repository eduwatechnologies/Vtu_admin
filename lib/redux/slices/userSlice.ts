import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: string;
  pinStatus: boolean;
  status: "active" | "suspended";
  createdAt: string;
  lastLogin: string;
}

interface Wallet {
  _id: string;
  balance: string;
}

interface UserState {
  users: User[];
  wallet: Wallet | null;
  filteredUsers: User[];
  searchQuery: string;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  wallet: null,
  filteredUsers: [],
  searchQuery: "",
  selectedUser: null,
  isLoading: false,
  error: null,
};

// ✅ fetchUsers with Axios + Authorization + Logging
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axiosInstance.get("/auth/users");
  return response.data as User[];
});

export const RefundUser = createAsyncThunk(
  "users/refundUser",
  async ({ userId, amount }: { userId: string; amount: string }) => {
    console.log(userId);
    const response = await axiosInstance.post("/billstack/refund", {
      userId,
      amount,
    });
    // Assume the backend returns the updated user or just success
    return { userId, amount, type: "credit" as const };
  }
);

export const DefundUser = createAsyncThunk(
  "users/defundUser",
  async ({ userId, amount }: { userId: string; amount: string }) => {
    const response = await axiosInstance.post("/billstack/defund", {
      userId,
      amount,
    });
    // Assume the backend returns the updated user or just success
    return { userId, amount, type: "debit" as const };
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    data: { userId: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        "/auth//admin/update-user-password",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "UpdatePassword reset failed"
      );
    }
  }
);

export const updatePin = createAsyncThunk(
  "auth/updatePin",
  async (data: { userId: string; newpin: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth//admin/update-user-pin",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Updatepin reset failed"
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "users/updateStatus",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/status", {
        userId,
      });
      return { userId, status: response.data.status };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredUsers = state.users.filter(
        (user) =>
          user.lastName.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.email.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.phone.includes(action.payload)
      );
    },
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUser =
        state.users.find((user) => user._id === action.payload) || null;
    },
    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const user = state.users.find((user) => user._id === action.payload);
      if (user) {
        user.status = user.status === "active" ? "suspended" : "active";
      }

      // Also update in filtered users
      const filteredUser = state.filteredUsers.find(
        (user) => user._id === action.payload
      );
      if (filteredUser) {
        filteredUser.status =
          filteredUser.status === "active" ? "suspended" : "active";
      }
    },
    updateWalletBalance: (
      state,
      action: PayloadAction<{
        userId: string;
        amount: string;
        type: "credit" | "debit";
      }>
    ) => {
      const { userId, amount, type } = action.payload;

      const updateBalance = (user: User | undefined) => {
        if (!user) return;

        const currentBalance =
          typeof user.balance === "string"
            ? Number.parseFloat(user.balance.replace("₦", "").replace(/,/g, ""))
            : Number(user.balance); // Handle number directly

        const amountValue = Number.parseFloat(amount);
        const newBalance =
          type === "credit"
            ? currentBalance + amountValue
            : currentBalance - amountValue;

        user.balance = `₦${newBalance.toLocaleString()}`;
      };

      const user = state.users.find((user) => user._id === userId);
      updateBalance(user);

      const filteredUser = state.filteredUsers.find(
        (user) => user._id === userId
      );
      updateBalance(filteredUser);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(RefundUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(RefundUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const { userId, amount, type } = action.payload;
        // Credit the wallet
        userSlice.caseReducers.updateWalletBalance(state, {
          payload: { userId, amount, type: "credit" },
          type: "users/updateWalletBalance",
        });
      })

      .addCase(RefundUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(DefundUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(DefundUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const { userId, amount, type } = action.payload;
        // Debit the wallet
        userSlice.caseReducers.updateWalletBalance(state, {
          payload: { userId, amount, type: "debit" },
          type: "users/updateWalletBalance",
        });
      })
      .addCase(DefundUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update password";
      })
      .addCase(updatePin.fulfilled, (state, action) => {
        // optional: update pin state
      })
      .addCase(updatePin.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update pin";
      })

      .addCase(updateStatus.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload.userId);
        if (user) user.status = action.payload.status;

        const filteredUser = state.filteredUsers.find(
          (u) => u._id === action.payload.userId
        );
        if (filteredUser) filteredUser.status = action.payload.status;
      });
  },
});

export const {
  setSearchQuery,
  selectUser,
  toggleUserStatus,
  updateWalletBalance,
} = userSlice.actions;
export default userSlice.reducer;
