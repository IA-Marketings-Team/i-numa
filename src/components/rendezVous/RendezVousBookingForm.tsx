
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { addDays, format, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

const availableHours = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const RendezVousBookingForm: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [time, setTime] = useState<string>('10:00');
  const [type, setType] = useState<string>('visio');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date pour le rendez-vous.",
        variant: "destructive",
      });
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const rendezVousDate = setMinutes(setHours(date, hours), minutes);
    
    try {
      // Show confirmation dialog
      setIsConfirmationOpen(true);
    } catch (error) {
      console.error('Erreur lors de la prise de rendez-vous:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la prise de rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const confirmBooking = async () => {
    // Here you would call the API to create the rendez-vous
    // For now, we'll just simulate it
    
    toast({
      title: "Rendez-vous confirmé",
      description: "Un email de confirmation vient de vous être envoyé.",
    });
    
    // Close confirmation dialog
    setIsConfirmationOpen(false);
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigate('/tableau-de-bord');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Prendre un rendez-vous</CardTitle>
        <CardDescription>
          Choisissez une date et une heure pour discuter de votre offre
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
              className="rounded-md border mx-auto"
              locale={fr}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heure</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure" />
              </SelectTrigger>
              <SelectContent>
                {availableHours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type de rendez-vous</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visio">Visioconférence</SelectItem>
                <SelectItem value="telephone">Téléphonique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-4">
            Confirmer le rendez-vous
          </Button>
        </form>
      </CardContent>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer votre rendez-vous</DialogTitle>
            <DialogDescription>
              Un email de confirmation vous sera envoyé avec un lien pour valider ce rendez-vous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Date:</div>
              <div>{date ? format(date, 'EEEE d MMMM yyyy', { locale: fr }) : '--'}</div>
              
              <div className="font-medium">Heure:</div>
              <div>{time}</div>
              
              <div className="font-medium">Type:</div>
              <div>{type === 'visio' ? 'Visioconférence' : 'Téléphonique'}</div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmationOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={confirmBooking}>
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RendezVousBookingForm;
