
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import DossierDetail from "@/components/dossier/DossierDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const DossierPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, setCurrentDossier, currentDossier } = useDossier();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
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
  }, [id, getDossierById, setCurrentDossier, navigate]);

  if (!currentDossier) {
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

  return <DossierDetail dossier={currentDossier} />;
};

export default DossierPage;
