import axios from "axios";

const getApiBaseUrl = (): string => {
  if (typeof window === "undefined" && process.env.API_SSR_URL) {
    return process.env.API_SSR_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
};

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
