
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export type AppointmentType = "visio" | "phone";

export interface AppointmentData {
  date: Date | undefined;
  time: string;
  type: AppointmentType;
}

interface AppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAppointment: (appointment: AppointmentData) => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  isOpen,
  onOpenChange,
  onCreateAppointment
}) => {
  const { toast } = useToast();
  const [newAppointment, setNewAppointment] = useState<AppointmentData>({
    date: undefined,
    time: "",
    type: "visio"
  });

  const handleCreateAppointment = () => {
    if (!newAppointment.date || !newAppointment.time) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure pour le rendez-vous.",
      });
      return;
    }

    onCreateAppointment(newAppointment);
    setNewAppointment({
      date: undefined,
      time: "",
      type: "visio"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Planifier un rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Date du rendez-vous</label>
            </div>
            <div className="border rounded-md p-2 overflow-hidden">
              <Calendar
                mode="single"
                selected={newAppointment.date}
                onSelect={date => setNewAppointment(prev => ({ ...prev, date }))}
                disabled={(date) => {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  return date < now || date.getDay() === 0 || date.getDay() === 6;
                }}
                className="border-none shadow-none"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Heure du rendez-vous</label>
            </div>
            <Select
              value={newAppointment.time}
              onValueChange={time => setNewAppointment(prev => ({ ...prev, time }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de rendez-vous</label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="visio"
                  checked={newAppointment.type === "visio"}
                  onChange={() => setNewAppointment(prev => ({ ...prev, type: "visio" }))}
                  className="mr-2"
                />
                <label htmlFor="visio">Visioconférence</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="phone"
                  checked={newAppointment.type === "phone"}
                  onChange={() => setNewAppointment(prev => ({ ...prev, type: "phone" }))}
                  className="mr-2"
                />
                <label htmlFor="phone">Téléphone</label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateAppointment}>
              Confirmer le rendez-vous
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
