
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (callData: CallData) => void;
  dossierId: string;
}

export interface CallData {
  duration: number;
  notes: string;
  outcome: string;
  followUpDate?: Date;
}

const LogCallModal: React.FC<LogCallModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dossierId,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [outcome, setOutcome] = useState<string>("discussed");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      duration,
      notes,
      outcome,
      followUpDate,
    });
    resetForm();
  };

  const resetForm = () => {
    setDuration(0);
    setNotes("");
    setOutcome("discussed");
    setFollowUpDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enregistrer un appel</DialogTitle>
            <DialogDescription>
              Enregistrez les détails de l'appel pour le dossier {dossierId.substring(0, 8)}...
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Durée (min)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
                min={0}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="outcome" className="text-right">
                Résultat
              </Label>
              <Select
                value={outcome}
                onValueChange={setOutcome}
              >
                <SelectTrigger id="outcome" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un résultat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussed">Discussion</SelectItem>
                  <SelectItem value="not_answered">Pas de réponse</SelectItem>
                  <SelectItem value="callback">Rappel prévu</SelectItem>
                  <SelectItem value="meeting_scheduled">RDV fixé</SelectItem>
                  <SelectItem value="not_interested">Pas intéressé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {outcome === "callback" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="followUpDate" className="text-right">
                  Date de rappel
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {followUpDate ? (
                          format(followUpDate, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={followUpDate}
                        onSelect={setFollowUpDate}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                rows={4}
                placeholder="Entrez les détails de l'appel..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              onClose();
            }}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogCallModal;
