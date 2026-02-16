import axios from "axios"
import { logout, getToken } from "../utils/auth";


const api = axios.create( {baseURL: import.meta.env.VITE_API_URL});


// Request-Interceptor: Token automatisch anhängen
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response-Interceptor: 401 automatisch ausloggen
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);


export default api;
