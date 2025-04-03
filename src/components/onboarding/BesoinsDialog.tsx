
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const besoins = [
  "Générer des leads",
  "Animer",
  "Créer des contenus",
  "Valoriser vos expertises",
  "Augmenter visibilité",
  "Générer des avis positifs",
  "Gagner en efficacité",
  "Fidéliser vos clients",
  "Exploiter données clients",
  "Développer activité",
  "Piloter votre activité",
  "Diminuer vos coûts",
];

const BesoinsDialog: React.FC = () => {
  const { state, toggleBesoin, setCurrentStep } = useOnboarding();
  
  const handleNext = () => {
    if (state.besoins.length >= 3) {
      setCurrentStep(2);
    }
  };

  return (
    <Dialog open={state.currentStep === 1} modal>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            ÉTAPE 2: Sélection des Besoins
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-center mb-4 text-sm font-medium">
            Sélectionnez au moins 3 besoins:
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {besoins.map((besoin) => (
              <Button
                key={besoin}
                variant={state.besoins.includes(besoin) ? "default" : "outline"}
                className="h-12 relative"
                onClick={() => toggleBesoin(besoin)}
              >
                {state.besoins.includes(besoin) && (
                  <Check className="h-4 w-4 absolute top-1 right-1" />
                )}
                <span className="text-sm">{besoin}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <Badge variant="secondary">
              Sélection: {state.besoins.length}/3
            </Badge>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(0)}
              >
                Retour
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={state.besoins.length < 3}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BesoinsDialog;
