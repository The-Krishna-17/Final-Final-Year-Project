import axios from "axios";
import Cookies from "js-cookie";
import process from "process";
import { toast } from "sonner";
// import { triggerOpenLogin } from "./authEvents";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access = Cookies.get("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = Cookies.get("refresh");

      if (!refresh) {
        // Only redirect if we are not already on login/home
        if (window.location.pathname !== "/") {
          Cookies.remove("access");
          Cookies.remove("refresh");
          toast.error("Please login", { richColors: true });
          window.location.replace("/");
        }
        return Promise.reject("No refresh token.");
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh`,
          {
            refresh,
          },
        );

        Cookies.set("access", res.data.access, { expires: 1 });
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        Cookies.remove("access");
        Cookies.remove("refresh");
        if (window.location.pathname !== "/") {
          window.location.replace("/");
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
