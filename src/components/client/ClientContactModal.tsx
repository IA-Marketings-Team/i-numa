
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Client } from "@/types";
import { Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ClientContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  type: "email" | "call";
}

const ClientContactModal: React.FC<ClientContactModalProps> = ({ 
  isOpen, 
  onClose, 
  client, 
  type 
}) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState("");
  const [callDate, setCallDate] = useState<Date | undefined>(new Date());
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send an actual email
      // For now we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email envoyé",
        description: `Un email a été envoyé à ${client.prenom} ${client.nom}.`,
      });
      
      handleClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogCall = async () => {
    if (!callNotes.trim()) {
      toast({
        title: "Notes requises",
        description: "Veuillez ajouter des notes pour cet appel.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would log the call in the database
      // For now we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Appel enregistré",
        description: `L'appel avec ${client.prenom} ${client.nom} a été enregistré.`,
      });
      
      handleClose();
    } catch (error) {
      console.error("Error logging call:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'appel.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubject("");
    setMessage("");
    setCallDuration(0);
    setCallNotes("");
    setCallDate(new Date());
    setFollowUpDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "email" ? (
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Envoyer un email à {client.prenom} {client.nom}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>Enregistrer un appel avec {client.prenom} {client.nom}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {type === "email" ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="to">Destinataire</Label>
                <Input id="to" value={client.email} readOnly className="bg-muted" />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="subject">Sujet*</Label>
                <Input 
                  id="subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="message">Message*</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px]"
                  placeholder="Contenu de l'email..."
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input 
                  id="phone" 
                  value={client.telephone || "Non renseigné"} 
                  readOnly 
                  className="bg-muted" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="callDate">Date de l'appel</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !callDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {callDate ? format(callDate, "dd/MM/yyyy") : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={callDate}
                        onSelect={setCallDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="callDuration">Durée (minutes)</Label>
                  <Input 
                    id="callDuration" 
                    type="number" 
                    min="0" 
                    value={callDuration} 
                    onChange={(e) => setCallDuration(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="followUpDate">Date de rappel (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !followUpDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {followUpDate ? format(followUpDate, "dd/MM/yyyy") : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={followUpDate}
                      onSelect={setFollowUpDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="callNotes">Notes d'appel*</Label>
                <Textarea 
                  id="callNotes" 
                  value={callNotes} 
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Détails de l'appel..."
                  required
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={type === "email" ? handleSendEmail : handleLogCall} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Traitement en cours..." : (
              type === "email" ? "Envoyer" : "Enregistrer l'appel"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientContactModal;
