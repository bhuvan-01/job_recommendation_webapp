import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const getToken = () => {
  return JSON.parse(localStorage.getItem("token"));
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp < currentTime;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      if (isTokenExpired(token)) {
        clearToken();
        toast.error("Login expired!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default apiClient;
