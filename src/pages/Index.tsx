
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Page Index - État d'authentification:", isAuthenticated);
    
    if (isAuthenticated) {
      console.log("Utilisateur authentifié, redirection vers le tableau de bord");
      navigate("/tableau-de-bord", { replace: true });
    } else {
      console.log("Utilisateur non authentifié, redirection vers la page de connexion");
      navigate("/connexion", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return null;
};

export default Index;
