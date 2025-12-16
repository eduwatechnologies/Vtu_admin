import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================
   REQUEST INTERCEPTOR
======================= */
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error("[REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error;

    console.error("[RESPONSE ERROR]", status, message);

    // 🔥 JWT expired or unauthorized
    if (status === 401) {
      console.warn("JWT expired or invalid. Logging out...");

      // Prevent infinite redirect loops
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
