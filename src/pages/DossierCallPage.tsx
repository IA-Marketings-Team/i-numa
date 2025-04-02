
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Phone, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const DossierCallPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, updateDossier, currentDossier } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [callNotes, setCallNotes] = useState("");

  // Charger les données du dossier
  useEffect(() => {
    const loadDossier = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        await getDossierById(id);
        setIsLoading(false);
      } catch (error) {
        console.error("[DossierCallPage] Error fetching dossier:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations du dossier."
        });
        navigate("/dossiers");
      }
    };
    
    loadDossier();
  }, [id, getDossierById, navigate, toast]);

  const handleSaveCall = async () => {
    if (!currentDossier || !id) return;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('fr-FR');
    const timeFormatted = now.toLocaleTimeString('fr-FR');
    
    // Préparer les notes d'appel avec la date et l'heure
    const newCallNote = `--- Appel du ${dateFormatted} à ${timeFormatted} ---\n${callNotes}\n\n`;
    
    // Mettre à jour les notes du dossier
    const updatedNotes = currentDossier.notes 
      ? currentDossier.notes + "\n" + newCallNote
      : newCallNote;

    try {
      await updateDossier(id, { notes: updatedNotes });
      
      toast({
        title: "Appel enregistré",
        description: "Les notes d'appel ont été enregistrées avec succès.",
      });
      
      navigate(`/dossiers/${id}`);
    } catch (error) {
      console.error("[DossierCallPage] Error saving call notes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les notes d'appel."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Chargement des informations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appel client</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/dossiers/${id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au dossier
        </Button>
      </div>

      {currentDossier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Appel avec {currentDossier.client.prenom} {currentDossier.client.nom}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-xl">{currentDossier.client.telephone || "Non renseigné"}</p>
              </div>
              
              <div className="pt-4">
                <p className="font-medium mb-2">Notes d'appel</p>
                <Textarea 
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Saisissez vos notes d'appel ici..."
                  className="min-h-[150px]"
                />
              </div>

              <Button 
                onClick={handleSaveCall} 
                className="w-full mt-4"
                disabled={!callNotes.trim()}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer l'appel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DossierCallPage;
