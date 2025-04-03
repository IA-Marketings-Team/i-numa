
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";

// Routes accessibles après le workflow mais avant la confirmation du rendez-vous
const ALLOWED_ROUTES = ["/dashboard", "/agenda"];

export const useWorkflowNavigation = () => {
  const { state, isWorkflowActive } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si le workflow est actif et que l'utilisateur a atteint l'étape 4 (confirmation)
    if (isWorkflowActive && state.currentStep === 4) {
      // Si l'utilisateur n'est pas sur une route autorisée, le rediriger vers le tableau de bord
      if (!ALLOWED_ROUTES.includes(location.pathname)) {
        navigate("/dashboard");
      }
    }
  }, [isWorkflowActive, state.currentStep, location.pathname, navigate]);

  return {
    isRestricted: isWorkflowActive && state.currentStep === 4 && !ALLOWED_ROUTES.includes(location.pathname),
  };
};
