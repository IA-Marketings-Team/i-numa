
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
        // Rediriger vers la page appropriée en fonction du rôle
        const defaultRoute = getDefaultRouteForRole(user.role);
        navigate(defaultRoute, { replace: true });
      } else {
        navigate("/connexion", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return null;
};

export default Index;
