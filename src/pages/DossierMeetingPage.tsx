import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DossierMeetingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, currentDossier } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDossier = async () => {
      setIsLoading(true);
      if (id) {
        try {
          await getDossierById(id);
        } catch (error) {
          console.error("Error fetching dossier:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors du chargement du dossier."
          });
          navigate("/dossiers");
        }
      }
      setIsLoading(false);
    };
    
    loadDossier();
  }, [id, getDossierById, navigate, toast]);

  if (isLoading || !currentDossier) {
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rendez-vous pour le dossier {currentDossier.id}</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/dossiers/${id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au dossier
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-muted-foreground mb-4">
          Interface de gestion des rendez-vous pour le dossier {currentDossier.client.nom}.
        </p>
        
        {/* Ici, vous pouvez ajouter le contenu spécifique à la gestion des rendez-vous */}
        
        <div className="flex justify-end mt-4">
          <Button onClick={() => navigate(`/dossiers/${id}`)}>
            Terminer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DossierMeetingPage;
