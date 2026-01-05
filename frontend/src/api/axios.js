import axios from "axios";

// Automatically switch between Localhost (Dev) and Render/Production URL
const backendURL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_BACKEND_URL 
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
// This automatically adds the JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */
// Handle common errors like 401 (Unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or invalid. Logging out...");
      // Optional: localStorage.clear(); window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;