
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DossierProvider } from "@/contexts/DossierContext";
import { useDossier } from "@/contexts/DossierContext";
import DossierForm from "@/components/dossier/DossierForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dossier } from "@/types";

const DossierEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getDossierById } = useDossier();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDossier = async () => {
      setIsLoading(true);
      if (id) {
        try {
          const loadedDossier = await getDossierById(id);
          if (loadedDossier) {
            setDossier(loadedDossier);
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Le dossier demandé n'existe pas."
            });
            navigate("/dossiers");
          }
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

  if (isLoading || !dossier) {
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Modifier le dossier</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/dossiers/${id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au dossier
        </Button>
      </div>
      
      <DossierForm dossier={dossier} isEditing={true} userRole={user?.role} />
    </div>
  );
};

export default DossierEdit;
