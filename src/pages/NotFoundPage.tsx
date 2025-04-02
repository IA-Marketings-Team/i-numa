
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate("/tableau-de-bord");
    } else {
      navigate("/connexion");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-lg text-muted-foreground mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button onClick={handleGoBack}>
        {isAuthenticated ? "Retour au tableau de bord" : "Aller à la connexion"}
      </Button>
    </div>
  );
};

export default NotFoundPage;
