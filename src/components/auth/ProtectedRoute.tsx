
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles = ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable'] 
}) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Chargement...</p>
          <div className="mt-4 animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with current location for post-login redirect
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }

  if (!hasPermission(roles)) {
    // Redirect to dashboard if user doesn't have required permissions
    const fallbackRoute = user?.role === 'client' ? '/mes-offres' : '/tableau-de-bord';
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
