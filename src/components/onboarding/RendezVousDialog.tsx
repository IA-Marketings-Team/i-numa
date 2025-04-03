
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/hooks/use-toast";

const heures = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const RendezVousDialog: React.FC = () => {
  const { state, setRendezVous, setCurrentStep } = useOnboarding();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(state.rendezVous.date || undefined);
  const [heure, setHeure] = useState(state.rendezVous.heure || "");
  const [type, setType] = useState<"visio" | "telephonique">(state.rendezVous.type);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!date || !heure) {
      setError("Veuillez sélectionner une date et une heure");
      return;
    }
    
    setRendezVous({ date, heure, type });
    setCurrentStep(4);
    
    // Afficher le toast de confirmation
    toast({
      title: "Rendez-vous programmé",
      description: "Un email de confirmation vous a été envoyé. Veuillez valider votre rendez-vous en cliquant sur le lien dans l'email.",
    });
  };

  return (
    <Dialog open={state.currentStep === 3} modal>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            ÉTAPE 4: Prise de Rendez-vous
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-center mb-4 text-sm font-medium">
            Agenda - Prise de rendez-vous
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Sélectionnez une date:</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setDate(date)}
                disabled={(date) => {
                  const now = new Date();
                  // Désactiver les dates passées et les weekends
                  return (
                    date < now ||
                    date.getDay() === 0 ||
                    date.getDay() === 6
                  );
                }}
                locale={fr}
                className="border rounded-md"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">
                  {date
                    ? `${format(date, "dd/MM/yyyy", { locale: fr })} - Choisir l'heure:`
                    : "Choisir l'heure:"}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {heures.map((h) => (
                    <Button
                      key={h}
                      type="button"
                      variant={heure === h ? "default" : "outline"}
                      onClick={() => setHeure(h)}
                      className="text-sm"
                    >
                      {h}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Type de rendez-vous:</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={type === "visio" ? "default" : "outline"}
                    onClick={() => setType("visio")}
                    className="flex-1"
                  >
                    Visio
                  </Button>
                  <Button
                    type="button"
                    variant={type === "telephonique" ? "default" : "outline"}
                    onClick={() => setType("telephonique")}
                    className="flex-1"
                  >
                    Téléphonique
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          )}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(2)}
            >
              Retour
            </Button>
            <Button onClick={handleSubmit}>
              Valider mon rendez-vous
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RendezVousDialog;
