
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import SecteurActiviteDialog from "./SecteurActiviteDialog";
import BesoinsDialog from "./BesoinsDialog";
import CoordonneesDialog from "./CoordonneesDialog";
import RendezVousDialog from "./RendezVousDialog";

const OnboardingWorkflow: React.FC = () => {
  const { isWorkflowActive } = useOnboarding();

  if (!isWorkflowActive) {
    return null;
  }

  return (
    <>
      <SecteurActiviteDialog />
      <BesoinsDialog />
      <CoordonneesDialog />
      <RendezVousDialog />
    </>
  );
};

export default OnboardingWorkflow;
