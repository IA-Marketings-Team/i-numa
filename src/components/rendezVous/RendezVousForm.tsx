
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { Dossier, RendezVous } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Composants refactorisés
import DateTimePicker from "./DateTimePicker";
import MeetingDetails from "./MeetingDetails";

interface RendezVousFormProps {
  dossier: Dossier;
  rendezVous?: RendezVous;
  isEditing?: boolean;
  onRendezVousAdded?: (newRdv: Omit<RendezVous, "id">) => void;
  onRendezVousUpdated?: (id: string, updates: Partial<RendezVous>) => void;
}

const RendezVousForm: React.FC<RendezVousFormProps> = ({ 
  dossier, 
  rendezVous, 
  isEditing = false,
  onRendezVousAdded,
  onRendezVousUpdated
}) => {
  const navigate = useNavigate();
  const { addRendezVous, updateRendezVous } = useDossier();
  
  const [date, setDate] = useState<Date | undefined>(rendezVous?.date ? new Date(rendezVous.date) : undefined);
  const [hours, setHours] = useState<string>(rendezVous?.date ? format(new Date(rendezVous.date), "HH") : "09");
  const [minutes, setMinutes] = useState<string>(rendezVous?.date ? format(new Date(rendezVous.date), "mm") : "00");
  const [timeField, setTimeField] = useState<string>(rendezVous?.heure || "");
  const [meetingLink, setMeetingLink] = useState(rendezVous?.meetingLink || "");
  const [location, setLocation] = useState(rendezVous?.location || "Visioconférence (Google Meet)");
  const [notes, setNotes] = useState(rendezVous?.notes || "");
  const [honore, setHonore] = useState(rendezVous?.honore || false);
  const [statut, setStatut] = useState(rendezVous?.statut || "planifie");
  const [solutionProposee, setSolutionProposee] = useState(rendezVous?.solutionProposee || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      alert("Veuillez sélectionner une date");
      return;
    }
    
    // Combine date and time
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    
    if (isEditing && rendezVous) {
      const updates = {
        date: dateTime,
        heure: timeField,
        meetingLink,
        location,
        notes,
        honore,
        statut,
        solutionProposee
      };
      
      if (onRendezVousUpdated) {
        onRendezVousUpdated(rendezVous.id, updates);
      } else {
        updateRendezVous(rendezVous.id, updates);
        navigate(`/dossiers/${dossier.id}`);
      }
    } else {
      const newRdv = {
        dossierId: dossier.id,
        dossier,
        date: dateTime,
        heure: timeField,
        meetingLink,
        location,
        notes,
        honore,
        statut,
        solutionProposee
      };
      
      if (onRendezVousAdded) {
        onRendezVousAdded(newRdv);
      } else {
        addRendezVous(newRdv);
        navigate(`/dossiers/${dossier.id}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Modifier le rendez-vous" : "Planifier un rendez-vous"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateTimePicker 
            date={date}
            onDateChange={setDate}
            hours={hours}
            onHoursChange={setHours}
            minutes={minutes}
            onMinutesChange={setMinutes}
            timeField={timeField}
            onTimeFieldChange={setTimeField}
          />

          <MeetingDetails 
            location={location}
            onLocationChange={setLocation}
            meetingLink={meetingLink}
            onMeetingLinkChange={setMeetingLink}
            notes={notes}
            onNotesChange={setNotes}
            honore={honore}
            onHonoreChange={setHonore}
            isEditing={isEditing}
            statut={statut}
            onStatutChange={setStatut}
            solutionProposee={solutionProposee}
            onSolutionProposeeChange={setSolutionProposee}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(`/dossiers/${dossier.id}`)}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditing ? "Enregistrer les modifications" : "Planifier le rendez-vous"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default RendezVousForm;
