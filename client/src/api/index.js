import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:8000/api"),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("tempToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tempToken");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/reset-password") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const logoutUser = () => api.post("/auth/logout");
export const verify2FALogin = (data) => api.post("/auth/login/verify-2fa", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);

// User
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.patch("/auth/update-profile", data);
export const changePassword = (data) => api.patch("/auth/change-password", data);
export const deleteAccount = (data) => api.delete("/auth/delete-account", { data });

// 2FA Management
export const setup2FA = () => api.post("/auth/setup-2fa");
export const verify2FA = (data) => api.post("/auth/verify-2fa", data);
export const disable2FA = (data) => api.post("/auth/disable-2fa", data);

export default api;
