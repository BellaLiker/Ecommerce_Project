import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { ROUTES } from "../constants/routes.js";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!isAdmin)         return <Navigate to={ROUTES.HOME} replace />;
  return children;
}
