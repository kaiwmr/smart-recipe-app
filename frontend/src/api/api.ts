import axios from "axios";
import { logoutUser } from "../utils/auth";

/**
 * Global API Instance
 * Configured with base URL and credentials support for HttpOnly cookies.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true 
});

// --- Response Interceptor: Error Handling ----

/**
 * Intercepts unauthorized responses (401).
 * If the session is invalid or expired, the user is logged out 
 * and redirected to the login page.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            logoutUser();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;