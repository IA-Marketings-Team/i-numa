
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

export interface CallData {
  content: string;
  duration: number;
  notes?: string;
  outcome?: string;
  followUpDate?: Date;
}

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CallData) => Promise<void>;
  dossierId: string;
}

const LogCallModal: React.FC<LogCallModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dossierId,
}) => {
  const [notes, setNotes] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const durationInMinutes = hours * 60 + minutes;
    setIsSubmitting(true);

    try {
      await onSubmit({
        content: notes,
        notes: notes,
        duration: durationInMinutes,
        outcome: "discussed"
      });
      // Modal will be closed by parent after successful submission
    } catch (error) {
      console.error("Error logging call:", error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes("");
      setHours(0);
      setMinutes(5);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Enregistrer un appel
          </DialogTitle>
          <DialogDescription>
            Saisissez les détails de l'appel effectué avec le client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Durée de l'appel</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  id="hours"
                  type="number"
                  min={0}
                  max={24}
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <Label htmlFor="hours" className="text-xs text-center block mt-1">
                  Heures
                </Label>
              </div>
              <div className="text-xl font-bold">:</div>
              <div className="flex-1">
                <Input
                  id="minutes"
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <Label htmlFor="minutes" className="text-xs text-center block mt-1">
                  Minutes
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes d'appel</Label>
            <Textarea
              id="notes"
              placeholder="Saisissez les détails de votre appel..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!notes.trim() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer l'appel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogCallModal;
