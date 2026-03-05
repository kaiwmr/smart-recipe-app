import api from "../api/api";

/**
 * ==========================================
 * AUTHENTIFIZIERUNGS-HILFSFUNKTIONEN
 * ==========================================
 * Verwaltet den UI-Status für das Frontend-Routing.
 * WICHTIG: Der echte Token liegt sicher in einem HttpOnly-Cookie
 * und wird vom Browser verwaltet. Hier setzen wir nur ein 
 *  "Dummy-Flag", damit React weiß, ob der User eingeloggt ist.
 */

/**
 * Meldet den Benutzer ab.
 * Ruft den Backend-Logout auf (um den Cookie zu zerstören) und
 * löscht danach garantiert das lokale UI-Flag.
 */
export const logout = async () => {
    try {
        await api.post("/logout");
    } catch (error) {
        console.error("Fehler beim Logout", error);
    } finally {
        logoutUser();
        window.location.href = "/login";
    }
};

/** Setzt das UI-Flag beim erfolgreichen Login */
export const loginUser = () => {
  localStorage.setItem('isAuthenticated', 'true');
};

/** Entfernt das UI-Flag (wird beim Logout oder bei 401-Fehlern genutzt) */
export const logoutUser = () => {
  localStorage.removeItem('isAuthenticated');
};

/** Prüft den UI-Status für das Frontend-Routing */
export const getIsAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};