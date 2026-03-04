/**
 * ==========================================
 * AUTHENTIFIZIERUNGSFUNKTION
 * ==========================================
 * verwaltet den Zugriff auf den Session-Token im Browser-Speicher.
 */

/**
 * Meldet den Benutzer ab.
 * Entfernt den Token aus dem LocalStorage und erzwingt eine Weiterleitung.
 */
export const logout = () => {
    // 1. Token aus dem Browser-Speicher löschen
    localStorage.removeItem("BiteWiseToken");
    
    // 2. Harte Weiterleitung zur Login-Seite
    // nutzen von window.location.href statt navigate, um den gesamten 
    // React-State der App sicherheitshalber zu löschen.
    window.location.href = "/login"; 
};

/**
 * Ruft den aktuell gespeicherten Token ab.
 * @returns Den Token als String oder null, falls kein User eingeloggt ist.
 */
export const getToken = () => localStorage.getItem("BiteWiseToken");