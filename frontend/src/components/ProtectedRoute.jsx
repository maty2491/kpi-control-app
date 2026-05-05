import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="vh-100 d-flex align-items-center justify-content-center">Cargando...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
