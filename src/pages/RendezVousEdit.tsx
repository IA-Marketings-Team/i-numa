
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import RendezVousForm from "@/components/rendezVous/RendezVousForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Dossier, RendezVous } from "@/types";

const RendezVousEdit = () => {
  const { dossierId, id } = useParams<{ dossierId: string; id: string }>();
  const { getDossierById, getRendezVousByDossierId, addRendezVous, updateRendezVous, deleteRendezVous } = useDossier();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCreating = id === "nouveau";
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [rendezVous, setRendezVous] = useState<RendezVous | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (!dossierId) {
        navigate("/dossiers");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Paramètres manquants."
        });
        return;
      }
      
      try {
        // Charger le dossier
        const loadedDossier = await getDossierById(dossierId);
        if (!loadedDossier) {
          navigate("/dossiers");
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Le dossier demandé n'existe pas."
          });
          return;
        }
        
        setDossier(loadedDossier);
        
        // Si on est en mode édition, charger le RDV
        if (!isCreating && id) {
          const rdvs = await getRendezVousByDossierId(dossierId);
          const rdv = rdvs.find(r => r.id === id);
          
          if (!rdv) {
            navigate(`/dossiers/${dossierId}`);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Le rendez-vous demandé n'existe pas."
            });
            return;
          }
          
          setRendezVous(rdv);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des données."
        });
        navigate("/dossiers");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dossierId, id, isCreating, getDossierById, getRendezVousByDossierId, navigate, toast]);

  const handleDelete = async () => {
    if (id && id !== "nouveau") {
      await deleteRendezVous(id);
      navigate(`/dossiers/${dossierId}`);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès."
      });
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Chargement des données...</p>
        <Button variant="outline" onClick={() => navigate("/dossiers")} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Dossier non trouvé</p>
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
        rendezVous={rendezVous || undefined}
        isEditing={!isCreating}
        onRendezVousAdded={async (newRdv) => {
          await addRendezVous(newRdv);
          navigate(`/dossiers/${dossierId}`);
          toast({
            title: "Rendez-vous créé",
            description: "Le rendez-vous a été créé avec succès."
          });
        }}
        onRendezVousUpdated={async (id, updates) => {
          await updateRendezVous(id, updates);
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
