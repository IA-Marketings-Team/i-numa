
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { Dossier, RendezVous } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [meetingLink, setMeetingLink] = useState(rendezVous?.meetingLink || "");
  const [location, setLocation] = useState(rendezVous?.location || "Visioconférence (Google Meet)");
  const [notes, setNotes] = useState(rendezVous?.notes || "");
  const [honore, setHonore] = useState(rendezVous?.honore || false);

  // Générer des options pour les heures et les minutes
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesOptions = ["00", "15", "30", "45"];

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
        meetingLink,
        location,
        notes,
        honore
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
        meetingLink,
        location,
        notes,
        honore
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "EEEE d MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Heure</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Select value={hours} onValueChange={setHours}>
                    <SelectTrigger>
                      <SelectValue placeholder="Heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {hoursOptions.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={minutes} onValueChange={setMinutes}>
                    <SelectTrigger>
                      <SelectValue placeholder="Minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutesOptions.map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Visioconférence (Google Meet)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingLink">Lien de la réunion</Label>
            <Input
              id="meetingLink"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Ex: https://meet.google.com/abc-defg-hij"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations supplémentaires..."
              rows={4}
            />
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="honore" 
                checked={honore}
                onCheckedChange={(checked) => setHonore(checked === true)}
              />
              <Label htmlFor="honore" className="cursor-pointer">Rendez-vous honoré</Label>
            </div>
          )}
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
