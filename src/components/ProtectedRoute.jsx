import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children, allowRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowRoles?.length && !allowRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;


