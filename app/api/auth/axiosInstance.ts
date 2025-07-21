import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    // Log the request
    console.log(
      `[REQUEST] ${config.method?.toUpperCase()} ${config.url}`,
      config
    );
    return config;
  },
  (error) => {
    console.error("[REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `[RESPONSE] ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error("[RESPONSE ERROR]", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
