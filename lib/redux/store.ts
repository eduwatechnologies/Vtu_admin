import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import transactionReducer from "./slices/transactionSlice";
import serviceReducer from "./slices/serviceSlice";
import settingReducer from "./slices/settingSlice";
import staffReducer from "./slices/staffSlice";
import networkProviders from "./slices/networkProviderSlice";
import paymentProviders from "./slices/paymentProviderSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    transactions: transactionReducer,
    services: serviceReducer,
    settings: settingReducer,
    staff: staffReducer,
    networkProviders: networkProviders,
    paymentProviders: paymentProviders,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
