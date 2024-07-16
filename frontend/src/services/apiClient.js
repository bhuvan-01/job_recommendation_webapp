import axios from 'axios';

const getToken = () => {
  return JSON.parse(localStorage.getItem('token'));
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default apiClient;
