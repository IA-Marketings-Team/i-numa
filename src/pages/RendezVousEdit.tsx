
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import RendezVousForm from "@/components/rendezVous/RendezVousForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const RendezVousEdit = () => {
  const { dossierId, id } = useParams<{ dossierId: string; id: string }>();
  const { getDossierById, getRendezVousByDossierId } = useDossier();
  const navigate = useNavigate();
  const isCreating = id === "nouveau";

  const dossier = dossierId ? getDossierById(dossierId) : undefined;
  const rendezVous = !isCreating && id && dossierId 
    ? getRendezVousByDossierId(dossierId).find(rdv => rdv.id === id)
    : undefined;

  useEffect(() => {
    if (!dossier) {
      navigate("/dossiers");
    } else if (!isCreating && !rendezVous) {
      navigate(`/dossiers/${dossierId}`);
    }
  }, [dossier, rendezVous, isCreating, dossierId, navigate]);

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
        <Button 
          variant="outline" 
          onClick={() => navigate(`/dossiers/${dossierId}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Annuler
        </Button>
      </div>
      
      <RendezVousForm 
        dossier={dossier}
        rendezVous={rendezVous}
        isEditing={!isCreating}
      />
    </div>
  );
};

export default RendezVousEdit;
