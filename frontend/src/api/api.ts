import axios from "axios";
import { logout, getToken } from "../utils/auth";

// ==========================================
// 1. API-INSTANZ INITIALISIERUNG
// ==========================================
// Erstellen einer zentralen Instanz mit der Basis-URL aus den Umgebungsvariablen.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// ==========================================
// 2. REQUEST-INTERCEPTOR (TOKEN-HANDLING)
// ==========================================
// Bevor ein Request abgeschickt wird, klinken wir uns hier ein.
api.interceptors.request.use(config => {
    const token = getToken();
    
    // Falls ein Token im Speicher existiert, wird er automatisch 
    // in den Authorization-Header jeder Anfrage gepackt.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

// ==========================================
// 3. RESPONSE-INTERCEPTOR (FEHLER-HANDLING)
// ==========================================
// Sobald eine Antwort vom Server zurückkommt, prüfen wir sie hier zentral.
api.interceptors.response.use(
    response => response, // Erfolgreiche Antworten einfach durchreichen
    error => {
        // Falls der Server mit 401 (Unauthorized) antwortet, 
        // ist der Token vermutlich abgelaufen.
        if (error.response?.status === 401) {
            // Wir loggen den User automatisch aus und räumen auf.
            logout();
        }
        
        // Den Fehler für die aufrufende Komponente (z.B. Dashboard) verfügbar machen/weiterreichen.
        return Promise.reject(error);
    }
);

export default api;