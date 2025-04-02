
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dossier, RendezVous } from "@/types";
import { format } from "date-fns";

interface RendezVousFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dossiers: Dossier[];
  onRendezVousAdded?: (rendezVous: Omit<RendezVous, "id">) => Promise<void>;
  onRendezVousUpdated?: (id: string, updates: Partial<RendezVous>) => Promise<boolean>;
  rendezVous?: RendezVous;
}

const RendezVousFormDialog: React.FC<RendezVousFormDialogProps> = ({
  isOpen,
  onOpenChange,
  dossiers,
  onRendezVousAdded,
  onRendezVousUpdated,
  rendezVous
}) => {
  const isEditMode = !!rendezVous;
  
  const [values, setValues] = useState({
    dossierId: rendezVous?.dossierId || '',
    date: rendezVous ? format(new Date(rendezVous.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    time: rendezVous ? format(new Date(rendezVous.date), 'HH:mm') : '09:00',
    notes: rendezVous?.notes || '',
    honore: rendezVous?.honore || false,
    meetingLink: rendezVous?.meetingLink || '',
    location: rendezVous?.location || 'Visioconférence'
  });

  const handleChange = (field: string, value: any) => {
    setValues({
      ...values,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    if (!values.dossierId) {
      return; // Prevent submission if no dossier is selected
    }

    // Combine date and time into a single Date object
    const dateTimeStr = `${values.date}T${values.time}:00`;
    const dateTime = new Date(dateTimeStr);

    // Get the selected dossier
    const selectedDossier = dossiers.find(d => d.id === values.dossierId);
    if (!selectedDossier) return;

    if (isEditMode && rendezVous && onRendezVousUpdated) {
      // Update existing rendez-vous
      await onRendezVousUpdated(rendezVous.id, {
        date: dateTime,
        notes: values.notes,
        honore: values.honore,
        meetingLink: values.meetingLink,
        location: values.location
      });
    } else if (onRendezVousAdded) {
      // Create new rendez-vous
      await onRendezVousAdded({
        dossierId: values.dossierId,
        dossier: selectedDossier,
        date: dateTime,
        honore: values.honore,
        notes: values.notes,
        meetingLink: values.meetingLink,
        location: values.location
      });
    }

    onOpenChange(false);
  };

  const title = isEditMode 
    ? "Modifier le rendez-vous" 
    : "Planifier un nouveau rendez-vous";
  
  const submitLabel = isEditMode 
    ? "Mettre à jour" 
    : "Créer";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modifiez les détails du rendez-vous existant." 
              : "Remplissez les informations pour planifier un nouveau rendez-vous."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isEditMode && (
            <div className="grid gap-2">
              <Label htmlFor="dossier">Dossier</Label>
              <Select 
                value={values.dossierId || "select_dossier"}
                onValueChange={(value) => handleChange('dossierId', value)}
              >
                <SelectTrigger id="dossier" className="w-full">
                  <SelectValue placeholder="Sélectionnez un dossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select_dossier" disabled>Sélectionnez un dossier</SelectItem>
                  {dossiers.map(dossier => (
                    <SelectItem key={dossier.id} value={dossier.id}>
                      {dossier.client.nom} {dossier.client.prenom} - {dossier.client.secteurActivite || "Non spécifié"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={values.date} 
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time" 
                type="time" 
                value={values.time} 
                onChange={(e) => handleChange('time', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Lieu</Label>
            <Input 
              id="location" 
              value={values.location} 
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Visioconférence, bureau, etc."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="meetingLink">Lien de réunion (optionnel)</Label>
            <Input 
              id="meetingLink" 
              value={values.meetingLink} 
              onChange={(e) => handleChange('meetingLink', e.target.value)}
              placeholder="https://meet.google.com/..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={values.notes} 
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
          {isEditMode && (
            <div className="flex items-center gap-2">
              <Label htmlFor="honore">Rendez-vous honoré</Label>
              <input 
                id="honore" 
                type="checkbox" 
                checked={values.honore} 
                onChange={(e) => handleChange('honore', e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RendezVousFormDialog;
