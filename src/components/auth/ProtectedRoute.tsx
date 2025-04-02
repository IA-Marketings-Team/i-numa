
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
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    // en sauvegardant le chemin actuel pour rediriger après connexion
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }

  if (!hasPermission(roles)) {
    // Rediriger vers le tableau de bord si l'utilisateur n'a pas les permissions nécessaires
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
