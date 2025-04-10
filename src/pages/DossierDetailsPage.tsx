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
import { recordDossierConsultation } from "@/services/consultationService";

const DossierDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getDossierById, updateDossierStatus, deleteDossier, addComment, addCallNote } = useDossier();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDossier = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      try {
        const dossierData = await getDossierById(id);
        if (dossierData) {
          setDossier(dossierData);
          
          // Record the consultation
          await recordDossierConsultation(
            id,
            user.id,
            `${user.prenom} ${user.nom}`,
            user.role
          );
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
  }, [id, getDossierById, navigate, toast, user]);

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
  
  const handleAddComment = async (content: string) => {
    if (!dossier || !user) return;
    
    try {
      setIsLoading(true);
      const success = await addComment(dossier.id, content);
      
      if (success) {
        // Refresh dossier data
        const updatedDossier = await getDossierById(dossier.id);
        if (updatedDossier) {
          setDossier(updatedDossier);
        }
        
        toast({
          title: "Commentaire ajouté",
          description: "Votre commentaire a été ajouté avec succès.",
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du commentaire."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCallNote = async (content: string, duration: number) => {
    if (!dossier || !user) return;
    
    try {
      setIsLoading(true);
      const success = await addCallNote(dossier.id, content, duration);
      
      if (success) {
        // Refresh dossier data
        const updatedDossier = await getDossierById(dossier.id);
        if (updatedDossier) {
          setDossier(updatedDossier);
        }
        
        toast({
          title: "Note d'appel ajoutée",
          description: "Votre note d'appel a été ajoutée avec succès.",
        });
      }
    } catch (error) {
      console.error("Error adding call note:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la note d'appel."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dossiers")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
      
      {dossier && (
        <DossierDetail 
          dossier={dossier} 
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteDossier}
          loading={isLoading}
          userRole={user?.role}
          onAddComment={handleAddComment}
          onAddCallNote={handleAddCallNote}
        />
      )}
    </div>
  );
};

export default DossierDetailsPage;
