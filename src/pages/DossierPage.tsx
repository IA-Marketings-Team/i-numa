
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import DossierDetail from "@/components/dossier/DossierDetail";
import VisioLimitedInfo from "@/components/dossier/VisioLimitedInfo";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const DossierPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, setCurrentDossier, currentDossier } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAgentVisio = user?.role === 'agent_visio';

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

  // Afficher une version limitée pour les agents visio
  if (isAgentVisio) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Détails du dossier</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dossiers")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à la liste
          </Button>
        </div>
        
        <VisioLimitedInfo dossier={currentDossier} />
        
        {/* Afficher les rendez-vous car l'agent visio y a accès */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Rendez-vous</h2>
          <DossierDetail dossier={currentDossier} />
        </div>
      </div>
    );
  }

  // Affichage normal pour les autres utilisateurs
  return <DossierDetail dossier={currentDossier} />;
};

export default DossierPage;
