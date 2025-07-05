import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Important for Sanctum authentication
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Asumsi token disimpan di localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
