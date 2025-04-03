
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Types
export interface OnboardingState {
  currentStep: number;
  secteurActivite: string;
  besoins: string[];
  coordonnees: {
    fonction: string;
    societe: string;
  };
  rendezVous: {
    date: Date | null;
    heure: string;
    type: "visio" | "telephonique";
  };
}

interface OnboardingContextType {
  state: OnboardingState;
  setCurrentStep: (step: number) => void;
  setSecteurActivite: (secteur: string) => void;
  toggleBesoin: (besoin: string) => void;
  setCoordonnees: (coordonnees: Partial<OnboardingState["coordonnees"]>) => void;
  setRendezVous: (rendezVous: Partial<OnboardingState["rendezVous"]>) => void;
  resetOnboarding: () => void;
  isWorkflowActive: boolean;
  setWorkflowActive: (active: boolean) => void;
}

const initialState: OnboardingState = {
  currentStep: 0,
  secteurActivite: "",
  besoins: [],
  coordonnees: {
    fonction: "",
    societe: "",
  },
  rendezVous: {
    date: null,
    heure: "",
    type: "visio",
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [isWorkflowActive, setWorkflowActive] = useState(false);
  const navigate = useNavigate();

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
    
    // Si c'est l'étape 5 (index 4), naviguer vers le dashboard
    if (step === 4) {
      navigate("/dashboard");
    }
  };

  const setSecteurActivite = (secteur: string) => {
    setState((prev) => ({ ...prev, secteurActivite: secteur }));
  };

  const toggleBesoin = (besoin: string) => {
    setState((prev) => {
      if (prev.besoins.includes(besoin)) {
        return { ...prev, besoins: prev.besoins.filter((b) => b !== besoin) };
      } else {
        return { ...prev, besoins: [...prev.besoins, besoin] };
      }
    });
  };

  const setCoordonnees = (coordonnees: Partial<OnboardingState["coordonnees"]>) => {
    setState((prev) => ({
      ...prev,
      coordonnees: { ...prev.coordonnees, ...coordonnees },
    }));
  };

  const setRendezVous = (rendezVous: Partial<OnboardingState["rendezVous"]>) => {
    setState((prev) => ({
      ...prev,
      rendezVous: { ...prev.rendezVous, ...rendezVous },
    }));
  };

  const resetOnboarding = () => {
    setState(initialState);
    setWorkflowActive(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setCurrentStep,
        setSecteurActivite,
        toggleBesoin,
        setCoordonnees,
        setRendezVous,
        resetOnboarding,
        isWorkflowActive,
        setWorkflowActive,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
