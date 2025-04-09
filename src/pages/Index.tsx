
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultRouteForRole } from "@/utils/accessControl";

const Index = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Utiliser la route par défaut basée sur le rôle
        const defaultRoute = getDefaultRouteForRole(user.role);
        navigate(defaultRoute, { replace: true });
      } else if (!isAuthenticated) {
        navigate("/connexion", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Rendu d'un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  return null;
};

export default Index;
