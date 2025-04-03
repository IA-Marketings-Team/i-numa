
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";

const secteurs = [
  "Restaurant",
  "Commerce",
  "Artisan",
  "Bâtiment",
  "PME",
  "Autre...",
];

const SecteurActiviteDialog: React.FC = () => {
  const { state, setSecteurActivite, setCurrentStep } = useOnboarding();
  
  const handleNext = () => {
    if (state.secteurActivite) {
      setCurrentStep(1);
    }
  };

  return (
    <Dialog open={state.currentStep === 0} modal>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            ÉTAPE 1: Sélection du Secteur d'Activité
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-center mb-4 text-sm font-medium">
            Sélectionnez votre secteur d'activité:
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {secteurs.map((secteur) => (
              <Button
                key={secteur}
                variant={state.secteurActivite === secteur ? "default" : "outline"}
                className="h-12"
                onClick={() => setSecteurActivite(secteur)}
              >
                {secteur}
              </Button>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleNext} 
              disabled={!state.secteurActivite}
              className="w-40"
            >
              Suivant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecteurActiviteDialog;
