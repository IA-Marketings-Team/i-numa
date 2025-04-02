
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import DossierDetail from "@/components/dossier/DossierDetail";
import { useToast } from "@/hooks/use-toast";
import { Dossier, DossierStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DossierProvider } from "@/contexts/DossierContext";

const DossierDetailsContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, updateDossierStatus, deleteDossier } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDossier = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const dossierData = await getDossierById(id);
        if (dossierData) {
          setDossier(dossierData);
        } else {
          toast({
            variant: "destructive",
            title: "Dossier introuvable",
            description: "Le dossier demandé n'existe pas ou a été supprimé."
          });
          navigate("/dossiers");
        }
      } catch (error) {
        console.error("Error fetching dossier:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du dossier."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossier();
  }, [id, getDossierById, navigate, toast]);

  const handleStatusChange = async (status: DossierStatus) => {
    if (!dossier) return;
    
    try {
      setIsLoading(true);
      await updateDossierStatus(dossier.id, status);
      
      // Update local state
      setDossier({
        ...dossier,
        status: status
      });
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut du dossier a été modifié avec succès.`,
      });
    } catch (error) {
      console.error("Error updating dossier status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteDossier = async () => {
    if (!dossier) return;
    
    try {
      setIsLoading(true);
      await deleteDossier(dossier.id);
      
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès.",
      });
      
      navigate("/dossiers");
    } catch (error) {
      console.error("Error deleting dossier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du dossier."
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-600 mb-4">Dossier introuvable</p>
          <Button variant="outline" onClick={() => navigate("/dossiers")} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Détail du dossier</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/dossiers")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
      
      <DossierDetail 
        dossier={dossier} 
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteDossier}
        loading={isLoading}
        userRole={user?.role}
      />
    </div>
  );
};

// Wrapper component that provides the DossierProvider context
const DossierDetailsPage: React.FC = () => {
  return (
    <DossierProvider>
      <DossierDetailsContent />
    </DossierProvider>
  );
};

export default DossierDetailsPage;
