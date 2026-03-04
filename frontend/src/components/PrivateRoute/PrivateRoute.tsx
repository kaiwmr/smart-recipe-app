import { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
};