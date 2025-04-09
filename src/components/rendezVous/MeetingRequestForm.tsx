
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { createMeeting } from '@/services/meetingService';

interface MeetingRequestFormProps {
  onComplete: () => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const MeetingRequestForm: React.FC<MeetingRequestFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMeetingMutation = useMutation({
    mutationFn: async (meetingData: any) => {
      return await createMeeting(meetingData);
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée",
        description: "Votre demande de rendez-vous a été envoyée avec succès.",
      });
      onComplete();
    },
    onError: (error) => {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre rendez-vous. Veuillez réessayer.",
      });
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !timeSlot) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure pour le rendez-vous.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert date and timeSlot to a proper Date object
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const meetingDate = new Date(date);
    meetingDate.setHours(hours, minutes, 0, 0);
    
    const participants = [user?.id || ''];
    
    // Create a meeting request
    const meetingData = {
      titre: "Rendez-vous suite à signature de contrat",
      description: notes || "Discussion concernant le contrat nouvellement signé",
      date: meetingDate,
      duree: 30, // Default duration: 30 minutes
      lien: "", // Will be filled by the agent
      type: "visio",
      statut: "planifie",
      participants
    };
    
    createMeetingMutation.mutate(meetingData);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const isWeekdayBefore = (date: Date) => {
    // Check if the date is at least one day in the future (excluding weekends)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return date < tomorrow;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Date du rendez-vous</label>
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
                {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => isWeekend(date) || isWeekdayBefore(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Heure du rendez-vous</label>
          <Select value={timeSlot || "default_time"} onValueChange={setTimeSlot}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une heure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default_time" disabled>Sélectionner une heure</SelectItem>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Notes ou informations complémentaires</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Précisez le sujet de la discussion ou toute information utile pour le rendez-vous"
          className="h-24"
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Confirmer le rendez-vous"}
        </Button>
      </div>
    </form>
  );
};

export default MeetingRequestForm;
