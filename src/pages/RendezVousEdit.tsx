
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import RendezVousForm from "@/components/rendezVous/RendezVousForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const RendezVousEdit = () => {
  const { dossierId, id } = useParams<{ dossierId: string; id: string }>();
  const { getDossierById, getRendezVousByDossierId, addRendezVous, updateRendezVous, deleteRendezVous } = useDossier();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCreating = id === "nouveau";
  const [isDeleting, setIsDeleting] = useState(false);

  const dossier = dossierId ? getDossierById(dossierId) : undefined;
  const rendezVous = !isCreating && id && dossierId 
    ? getRendezVousByDossierId(dossierId).find(rdv => rdv.id === id)
    : undefined;

  useEffect(() => {
    if (!dossier) {
      navigate("/dossiers");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le dossier demandé n'existe pas."
      });
    } else if (!isCreating && !rendezVous) {
      navigate(`/dossiers/${dossierId}`);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le rendez-vous demandé n'existe pas."
      });
    }
  }, [dossier, rendezVous, isCreating, dossierId, navigate, toast]);

  const handleDelete = () => {
    if (id && id !== "nouveau") {
      deleteRendezVous(id);
      navigate(`/dossiers/${dossierId}`);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès."
      });
    }
    setIsDeleting(false);
  };

  if (!dossier) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Chargement du dossier...</p>
        <Button variant="outline" onClick={() => navigate("/dossiers")} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isCreating ? "Nouveau rendez-vous" : "Modifier le rendez-vous"}
        </h1>
        <div className="flex gap-2">
          {!isCreating && (
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleting(true)}
            >
              Supprimer
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate(`/dossiers/${dossierId}`)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </div>
      
      <RendezVousForm 
        dossier={dossier}
        rendezVous={rendezVous}
        isEditing={!isCreating}
        onRendezVousAdded={(newRdv) => {
          addRendezVous(newRdv);
          navigate(`/dossiers/${dossierId}`);
          toast({
            title: "Rendez-vous créé",
            description: "Le rendez-vous a été créé avec succès."
          });
        }}
        onRendezVousUpdated={(id, updates) => {
          updateRendezVous(id, updates);
          navigate(`/dossiers/${dossierId}`);
          toast({
            title: "Rendez-vous mis à jour",
            description: "Le rendez-vous a été mis à jour avec succès."
          });
        }}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4">Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RendezVousEdit;
