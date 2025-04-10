import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dossier, DossierStatus } from '@/types';
import { Calendar, Briefcase, FileText, Package, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useDossier } from '@/contexts/DossierContext';

interface VisioLimitedInfoProps {
  dossier: Dossier;
}

const VisioLimitedInfo: React.FC<VisioLimitedInfoProps> = ({ dossier }) => {
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [newNotes, setNewNotes] = useState(dossier.notes || '');
  const [isValidating, setIsValidating] = useState(false);
  const { updateDossier, updateDossierStatus } = useDossier();
  const { toast } = useToast();

  const handleNotesSubmit = () => {
    updateDossier(dossier.id, { notes: newNotes });
    setIsAddingNotes(false);
    toast({
      title: 'Notes mises à jour',
      description: 'Les notes du dossier ont été mises à jour avec succès.'
    });
  };

  const handleValidate = () => {
    updateDossierStatus(dossier.id, 'valide');
    setIsValidating(false);
    toast({
      title: 'Dossier validé',
      description: 'Le statut du dossier a été mis à jour à "validé".'
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Informations Client (Vue Limitée)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Secteur d'activité */}
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Secteur d'activité</p>
              <p className="font-medium">{dossier.client.secteurActivite}</p>
            </div>
          </div>
          
          {/* Besoins du client */}
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Besoins</p>
              <p className="font-medium">{dossier.notes || "Non spécifiés"}</p>
            </div>
          </div>
          
          {/* Date de rendez-vous */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de rendez-vous</p>
              <p className="font-medium">
                {dossier.dateRdv 
                  ? new Date(dossier.dateRdv).toLocaleDateString() 
                  : "Non planifiée"}
              </p>
            </div>
          </div>
          
          {/* Offres (sans montant) */}
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Offres</p>
              {dossier.offres && dossier.offres.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {dossier.offres.map((offre, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {offre.nom}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium">Aucune offre sélectionnée</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-amber-50 rounded-md text-amber-700 text-sm">
          <p className="font-medium">Note de confidentialité:</p>
          <p>Les informations personnelles du client ne sont pas accessibles depuis votre interface. Conformément à notre politique de confidentialité, vous avez uniquement accès aux informations nécessaires pour effectuer votre mission d'agent visio.</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {/* Dialog pour ajouter des notes */}
        <Dialog open={isAddingNotes} onOpenChange={setIsAddingNotes}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Ajouter des notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter des notes au dossier</DialogTitle>
            </DialogHeader>
            <Textarea 
              value={newNotes} 
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Entrez vos notes concernant ce dossier..."
              className="min-h-[150px]"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddingNotes(false)}>Annuler</Button>
              <Button onClick={handleNotesSubmit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour valider le dossier */}
        {dossier.status === 'rdv_honore' && (
          <Dialog open={isValidating} onOpenChange={setIsValidating}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Valider le dossier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la validation du dossier</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                Êtes-vous sûr de vouloir valider ce dossier ? Cette action changera son statut à "Validé".
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsValidating(false)}>Annuler</Button>
                <Button onClick={handleValidate}>Confirmer la validation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default VisioLimitedInfo;
