
import React from "react";
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
import { Dossier } from "@/types";

interface RendezVousFormValues {
  date: string;
  time: string;
  dossierId: string;
  notes: string;
  honore: boolean;
}

interface RendezVousFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  values: RendezVousFormValues;
  onChange: (values: Partial<RendezVousFormValues>) => void;
  onSubmit: () => void;
  dossiers: Dossier[];
  submitLabel: string;
  isEditMode?: boolean;
}

const RendezVousFormDialog: React.FC<RendezVousFormDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  values,
  onChange,
  onSubmit,
  dossiers,
  submitLabel,
  isEditMode = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isEditMode && (
            <div className="grid gap-2">
              <Label htmlFor="dossier">Dossier</Label>
              <select 
                id="dossier"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={values.dossierId}
                onChange={(e) => onChange({ dossierId: e.target.value })}
                required
              >
                <option value="">Sélectionnez un dossier</option>
                {dossiers.map(dossier => (
                  <option key={dossier.id} value={dossier.id}>
                    {dossier.client.nom} {dossier.client.prenom} - {dossier.client.secteurActivite}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={values.date} 
                onChange={(e) => onChange({ date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time" 
                type="time" 
                value={values.time} 
                onChange={(e) => onChange({ time: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={values.notes} 
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </div>
          {isEditMode && (
            <div className="flex items-center gap-2">
              <Label htmlFor="honore">Rendez-vous honoré</Label>
              <input 
                id="honore" 
                type="checkbox" 
                checked={values.honore} 
                onChange={(e) => onChange({ honore: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RendezVousFormDialog;
