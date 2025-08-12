import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface Transaction {
  _id: string;
  userId: {
    firstName:string,
    email:string,
  };
  transaction_type: string; // previously `type`
  network?: string; // if applicable
  amount: number;
  status: "completed" | "pending" | "failed" | "delivered"; // include "delivered" if used
  service:string;
  network: string;
  transaction_date: string; // ISO string from VTpass response
  request_id?: string; // if you still need this for tracking
  response_data: {
    request_id?: string;
    accountNumber?: string | null;
    amount?: number;
    status?: string;
    product_name?: string;
    transaction_date?: string;
    token?: string | null;
    phone?: string;
    dataName?: string | null;
  };
  product_name: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionFilter {
  user: string;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  currentFilter: TransactionFilter;
  isLoading: boolean;
  error: string | null;
}

const initialFilter: TransactionFilter = {
  user: "",
  type: "all",
  status: "all",
  startDate: undefined,
  endDate: undefined,
};

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  currentFilter: initialFilter,
  isLoading: false,
  error: null,
};

// ✅ Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/transactions/transactions");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionFilter: (
      state,
      action: PayloadAction<Partial<TransactionFilter>>
    ) => {
      state.currentFilter = {
        ...state.currentFilter,
        ...action.payload,
      };

      // Apply filters
      state.filteredTransactions = state.transactions.filter((transaction) => {
        // Filter by user
        if (
          state.currentFilter.user &&
          !transaction.userId
            .toLowerCase()
            .includes(state.currentFilter.user.toLowerCase())
        ) {
          return false;
        }

        // Filter by type
        if (
          state.currentFilter.type !== "all" &&
          transaction.transaction_type !== state.currentFilter.type
        ) {
          return false;
        }

        // Filter by status
        if (
          state.currentFilter.status !== "all" &&
          transaction.status !== state.currentFilter.status
        ) {
          return false;
        }

        // Filter by date range
        if (state.currentFilter.startDate || state.currentFilter.endDate) {
          const txDate = new Date(transaction.transaction_date);

          if (
            state.currentFilter.startDate &&
            txDate < state.currentFilter.startDate
          ) {
            return false;
          }

          if (state.currentFilter.endDate) {
            // Set end date to end of day
            const endOfDay = new Date(state.currentFilter.endDate);
            endOfDay.setHours(23, 59, 59, 999);

            if (txDate > endOfDay) {
              return false;
            }
          }
        }

        return true;
      });
    },
    resetTransactionFilters: (state) => {
      state.currentFilter = initialFilter;
      state.filteredTransactions = state.transactions;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.filteredTransactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      });
  },
});

export const { setTransactionFilter, resetTransactionFilters } =
  transactionSlice.actions;
export default transactionSlice.reducer;
