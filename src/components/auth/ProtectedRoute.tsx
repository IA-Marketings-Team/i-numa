
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { hasPermission, getDefaultRouteForRole } from "@/utils/accessControl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

/**
 * Composant pour protéger les routes en fonction des rôles
 * Redirige vers la page de connexion si non authentifié
 * Redirige vers une page appropriée si l'utilisateur n'a pas les permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles = ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable'] 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with current location for post-login redirect
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }

  if (!hasPermission(user?.role, roles)) {
    // Redirect to appropriate route based on user role
    const fallbackRoute = user ? getDefaultRouteForRole(user.role) : '/connexion';
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
