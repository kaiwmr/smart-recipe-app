import { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { getIsAuthenticated } from '../../utils/auth';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface PrivateRouteProps {
  // children repräsentiert die geschützte Komponente (z.B. Dashboard)
  children: ReactNode;
}

/**
 * Higher-Order Component zur Absicherung von Frontend-Routen.
 * ACHTUNG: Prüft nur das lokale "isAuthenticated" UI-Flag. 
 * Die echte Autorisierung passiert bei jedem Request im Backend 
 * durch die Überprüfung des HttpOnly-Cookies
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  
  // ==========================================
  // 2. AUTH-LOGIK (UI-ZUGANGSPRÜFUNG)
  // ==========================================
  // Wir prüfen unser harmloses Dummy-Flag aus dem LocalStorage
  const isAuthenticated = getIsAuthenticated();

  // ==========================================
  // 3. RENDERING
  // ==========================================
  
  // Flag vorhanden -> Komponente rendern.
  // Flag fehlt -> Automatisch zum Login weiterleiten.
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}