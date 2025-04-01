
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles = ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable'] 
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (!hasPermission(roles)) {
    // Rediriger vers le tableau de bord si l'utilisateur n'a pas les permissions nécessaires
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
