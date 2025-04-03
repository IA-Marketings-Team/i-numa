
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/OnboardingContext";

const CoordonneesDialog: React.FC = () => {
  const { state, setCoordonnees, setCurrentStep } = useOnboarding();
  const [fonction, setFonction] = useState(state.coordonnees.fonction);
  const [societe, setSociete] = useState(state.coordonnees.societe);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!fonction || !societe) {
      setError("Tous les champs sont obligatoires");
      return;
    }
    
    setCoordonnees({ fonction, societe });
    setCurrentStep(3);
  };

  return (
    <Dialog open={state.currentStep === 2} modal>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            ÉTAPE 3: Complément d'information
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-center mb-4 text-sm font-medium">
            Veuillez renseigner vos coordonnées:
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fonction">Fonction:</Label>
              <Input
                id="fonction"
                value={fonction}
                onChange={(e) => setFonction(e.target.value)}
                placeholder="Votre fonction"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="societe">Nom de la société:</Label>
              <Input
                id="societe"
                value={societe}
                onChange={(e) => setSociete(e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
            >
              Retour
            </Button>
            <Button onClick={handleSubmit}>
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoordonneesDialog;
