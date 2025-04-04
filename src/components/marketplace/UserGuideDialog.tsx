
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface UserGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserGuideContent = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Bienvenue sur notre marketplace ! Voici comment utiliser notre application :
    </p>
    
    <div className="space-y-2">
      <h4 className="font-medium">1. Parcourir les offres</h4>
      <p className="text-sm">Explorez les offres filtrées selon votre secteur d'activité.</p>
    </div>
    
    <div className="space-y-2">
      <h4 className="font-medium">2. Ajouter au panier</h4>
      <p className="text-sm">Cliquez sur "Ajouter au panier" pour sélectionner une offre.</p>
    </div>
    
    <div className="space-y-2">
      <h4 className="font-medium">3. Prendre rendez-vous</h4>
      <p className="text-sm">Après avoir ajouté une offre, vous serez redirigé vers l'agenda pour choisir une date et une heure de rendez-vous.</p>
    </div>
    
    <div className="space-y-2">
      <h4 className="font-medium">4. Confirmer par email</h4>
      <p className="text-sm">Vous recevrez un email de confirmation pour valider votre rendez-vous.</p>
    </div>
  </div>
);

const UserGuideDialog: React.FC<UserGuideDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guide d'utilisation</DialogTitle>
        </DialogHeader>
        <UserGuideContent />
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideDialog;
