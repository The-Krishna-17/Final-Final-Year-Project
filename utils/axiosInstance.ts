import axios from "axios";
import { toast } from "sonner";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept auth-related routes to avoid infinite retry loops
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token.
        // We use a fresh axios instance to prevent interceptor loops.
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        // If successful, the backend automatically sets the new HttpOnly cookies.
        // We can now retry the original request.
        return axiosInstance(originalRequest);
      } catch (err) {
        // If the refresh token request fails (e.g., refresh token expired)
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          toast.error("Session expired. Please login again.", {
            richColors: true,
          });
          window.location.replace("/login");
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
