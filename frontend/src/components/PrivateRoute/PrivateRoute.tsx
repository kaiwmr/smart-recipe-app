import { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { getIsAuthenticated } from '../../utils/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Route guard for frontend access control.
 * Note: Real authorization is enforced server-side via HttpOnly cookies.
 * This component only checks the local UI authentication state.
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  
  // --- UI Access Check ---------------------
  const isAuthenticated = getIsAuthenticated();

  // --- Conditional Rendering ---------------
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}