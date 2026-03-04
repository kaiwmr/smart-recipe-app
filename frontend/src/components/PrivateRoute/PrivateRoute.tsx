import { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface PrivateRouteProps {
  // children repräsentiert die geschützte Komponente (z.B. Dashboard)
  children: ReactNode;
}

/**
 * Higher-Order Component zur Absicherung von Routen.
 * Prüft, ob ein gültiger Token vorhanden ist, bevor der Inhalt gerendert wird.
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  
  // ==========================================
  // 2. AUTH-LOGIK (ZUGANGSPRÜFUNG)
  // ==========================================
  const token = getToken();

  // ==========================================
  // 3. RENDERING / REDIRECT
  // ==========================================
  
  // Wenn ein Token existiert, darf der User die "children" sehen.
  // Falls nicht, wird er automatisch zur Login-Seite umgeleitet.
  return token ? <>{children}</> : <Navigate to="/login" />;
}