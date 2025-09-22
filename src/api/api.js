// src/api/api.js
import axios from "axios";
import { useAuthStore } from "../store";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",     // 👈 bắt buộc để backend nhận đúng JSON
        Accept: "application/json",
    },
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        // Nếu đang gọi /api/auth/login hoặc /api/auth/register thì đừng logout khi 401
        const url = err?.config?.url || "";
        const isAuth = url.includes("/api/auth/login") || url.includes("/api/auth/register");
        if (!isAuth && err?.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(err);
    }
);

export default api;
