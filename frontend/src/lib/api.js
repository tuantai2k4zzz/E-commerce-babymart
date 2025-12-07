import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-babymart-tt.onrender.com"+"/api"
});

// Tự động gắn Bearer token từ localStorage
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem("bm_auth");
  if (saved) {
    const { token } = JSON.parse(saved);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
