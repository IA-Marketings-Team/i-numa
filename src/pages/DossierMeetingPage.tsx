
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { DossierProvider } from "@/contexts/DossierContext";

const DossierMeetingContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, addRendezVous, currentDossier } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const [meetingForm, setMeetingForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    notes: "",
    location: "",
    meetingLink: ""
  });

  // Charger les données du dossier
  useEffect(() => {
    const loadDossier = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        await getDossierById(id);
        setIsLoading(false);
      } catch (error) {
        console.error("[DossierMeetingPage] Error fetching dossier:", error);
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

  const handleAddMeeting = async () => {
    if (!currentDossier || !id) return;
    
    try {
      // Créer une date à partir des champs
      const dateTime = new Date(`${meetingForm.date}T${meetingForm.time}`);
      
      // Vérifier que la date est valide
      if (isNaN(dateTime.getTime())) {
        throw new Error("Date ou heure invalide");
      }
      
      // Créer le rendez-vous
      const newRendezVous = {
        dossierId: id,
        date: dateTime,
        honore: false,
        location: meetingForm.location,
        meetingLink: meetingForm.meetingLink,
        notes: meetingForm.notes,
        dossier: currentDossier
      };
      
      await addRendezVous(newRendezVous);
      
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été créé avec succès."
      });
      
      navigate(`/dossiers/${id}`);
    } catch (error) {
      console.error("[DossierMeetingPage] Error creating meeting:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le rendez-vous."
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
        <h1 className="text-3xl font-bold">Planifier un rendez-vous</h1>
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
              <Calendar className="h-5 w-5" />
              Rendez-vous avec {currentDossier.client.prenom} {currentDossier.client.nom}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input
                    id="date"
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">Heure</label>
                  <Input
                    id="time"
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Lieu (optionnel)</label>
                <Input
                  id="location"
                  value={meetingForm.location}
                  onChange={(e) => setMeetingForm({...meetingForm, location: e.target.value})}
                  placeholder="Adresse, bureau, etc."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="meetingLink" className="text-sm font-medium">Lien de visioconférence (optionnel)</label>
                <Input
                  id="meetingLink"
                  value={meetingForm.meetingLink}
                  onChange={(e) => setMeetingForm({...meetingForm, meetingLink: e.target.value})}
                  placeholder="https://meet.google.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</label>
                <Textarea
                  id="notes"
                  value={meetingForm.notes}
                  onChange={(e) => setMeetingForm({...meetingForm, notes: e.target.value})}
                  placeholder="Informations complémentaires..."
                />
              </div>

              <Button 
                onClick={handleAddMeeting} 
                className="w-full mt-4"
              >
                <Save className="mr-2 h-4 w-4" />
                Créer le rendez-vous
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Wrapper component that provides the DossierProvider context
const DossierMeetingPage: React.FC = () => {
  return (
    <DossierProvider>
      <DossierMeetingContent />
    </DossierProvider>
  );
};

export default DossierMeetingPage;
