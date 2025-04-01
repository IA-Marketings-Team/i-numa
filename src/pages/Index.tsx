
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tableau-de-bord");
    } else {
      navigate("/connexion");
    }
  }, [isAuthenticated, navigate]);

  return null;
};

export default Index;
