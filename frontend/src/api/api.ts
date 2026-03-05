import axios from "axios";
import { logoutUser } from "../utils/auth";

// ==========================================
// 1. API-INSTANZ INITIALISIERUNG
// ==========================================
// Zentrale Instanz mit Basis-URL aus den Umgebungsvariablen.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // Zwingt Axios dazu, den HttpOnly-Cookie bei jeder 
    // Anfrage an das Backend automatisch mitzusenden.
    withCredentials: true 
});

// ==========================================
// 2. RESPONSE-INTERCEPTOR (FEHLER-HANDLING)
// ==========================================
// Fängt Backend-Antworten ab, bevor sie in der aufrufenden Komponente landen.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Wenn das Backend 401 (Unauthorized) meldet (z.B. Cookie abgelaufen/fehlt):
        if (error.response && error.response.status === 401) {
            // 1. Lokales UI-Flag entfernen
            logoutUser();
            // 2. User hart zur Login-Seite zurückwerfen
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;