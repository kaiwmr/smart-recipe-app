import api from "../api/api";

/**
 * AUTHENTICATION HELPERS
 * * Manages UI-state for frontend routing.
 * Note: Real session security is handled via HttpOnly cookies by the browser.
 * The 'isAuthenticated' flag is purely for UI/UX synchronization.
 */

/**
 * Standard logout flow:
 * 1. Invalidates server-side session (Cookie)
 * 2. Clears local UI-state
 * 3. Redirects to login
 */
export const logout = async () => {
    try {
        await api.post("/logout");
    } catch (error) {
        console.error("Logout failed", error);
    } finally {
        logoutUser();
        window.location.href = "/login";
    }
};

export const loginUser = () => {
  localStorage.setItem('isAuthenticated', 'true');
};

export const logoutUser = () => {
  localStorage.removeItem('isAuthenticated');
};

export const getIsAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};