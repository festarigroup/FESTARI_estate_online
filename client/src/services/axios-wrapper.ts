import axios from "axios";
import { getAxiosError } from "./getAxiosError";
import { ApiResponse } from "@/types/axios-types";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

// 🔓 Public client
const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Private client (cookies included)
const privateClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Shared response handler
const handleResponse = <T>(response: any): ApiResponse<T> => ({
  success: true,
  data: response.data,
  status: response.status,
});

// Attach interceptors
[publicClient, privateClient].forEach((client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(getAxiosError(error))
  );
});

export const publicApi = {
  get: <T = unknown>(url: string, config = {}) =>
    publicClient.get<any, ApiResponse<T>>(url, config).then((res) => handleResponse<T>(res)),

  post: <T = unknown>(url: string, data?: unknown, config = {}) =>
    publicClient.post<any, ApiResponse<T>>(url, data, config).then((res) => handleResponse<T>(res)),

  put: <T = unknown>(url: string, data?: unknown, config = {}) =>
    publicClient.put<any, ApiResponse<T>>(url, data, config).then((res) => handleResponse<T>(res)),

  patch: <T = unknown>(url: string, data?: unknown, config = {}) =>
    publicClient.patch<any, ApiResponse<T>>(url, data, config).then((res) => handleResponse<T>(res)),

  delete: <T = unknown>(url: string, config = {}) =>
    publicClient.delete<any, ApiResponse<T>>(url, config).then((res) => handleResponse<T>(res)),
};

export const privateApi = {
  get: <T = unknown>(url: string, config = {}) =>
    privateClient.get<any, ApiResponse<T>>(url, config).then((res) => handleResponse<T>(res)),

  post: <T = unknown>(url: string, data?: unknown, config = {}) =>
    privateClient.post<any, ApiResponse<T>>(url, data, config).then((res) => handleResponse<T>(res)),

  put: <T = unknown>(url: string, data?: unknown, config = {}) =>
    privateClient.put<any, ApiResponse<T>>(url, data, config).then((res) => handleResponse<T>(res)),

  patch: <T = unknown>(url: string, data?: unknown, config = {}) =>
    privateClient.patch<any, ApiResponse<T>>(url, data, config).then((res) => handleResponse<T>(res)),

  delete: <T = unknown>(url: string, config = {}) =>
    privateClient.delete<any, ApiResponse<T>>(url, config).then((res) => handleResponse<T>(res)),
};