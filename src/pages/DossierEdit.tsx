
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import DossierForm from "@/components/dossier/DossierForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const DossierEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, setCurrentDossier, currentDossier } = useDossier();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const isCreating = id === "nouveau";

  useEffect(() => {
    // Si nous sommes en mode création, initialiser un dossier vide
    if (isCreating) {
      setCurrentDossier(null);
    } else if (id) {
      // Sinon charger le dossier existant
      const dossier = getDossierById(id);
      if (dossier) {
        setCurrentDossier(dossier);
      } else {
        navigate("/dossiers");
      }
    }
    
    return () => {
      setCurrentDossier(null);
    };
  }, [id, isCreating, getDossierById, setCurrentDossier, navigate]);

  // Vérifier que l'utilisateur a les permissions nécessaires pour cette page
  useEffect(() => {
    if (!hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])) {
      navigate("/dossiers");
    }
  }, [hasPermission, navigate]);

  if (!isCreating && !currentDossier) {
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
          {isCreating ? "Nouveau dossier" : "Modifier le dossier"}
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/dossiers")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Annuler
        </Button>
      </div>
      
      <DossierForm 
        dossier={currentDossier} 
        isEditing={!isCreating} 
        userRole={user?.role}
      />
    </div>
  );
};

export default DossierEdit;
