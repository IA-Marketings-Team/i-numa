
import { Statistique } from "@/types";
import { 
  createStatistique, 
  updateStatistique, 
  deleteStatistique 
} from "@/services/statistiqueService";
import { useToast } from "@/hooks/use-toast";

export function useStatistiqueActions(onUpdate: () => void) {
  const { toast } = useToast();

  const addStatistique = async (data: Omit<Statistique, "id">): Promise<Statistique | null> => {
    try {
      const newStat = await createStatistique(data);
      if (newStat) {
        // Assurez-vous que la nouvelle statistique a un ID
        if (!newStat.id) {
          newStat.id = `stat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        }
        
        onUpdate();
        toast({
          title: "Succès",
          description: "La statistique a été ajoutée avec succès",
        });
      }
      return newStat;
    } catch (err) {
      console.error("Error adding statistique:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la statistique",
        variant: "destructive"
      });
      return null;
    }
  };

  const editStatistique = async (id: string, data: Partial<Statistique>): Promise<boolean> => {
    try {
      const success = await updateStatistique(id, data);
      if (success) {
        onUpdate();
        toast({
          title: "Succès",
          description: "La statistique a été mise à jour avec succès",
        });
      }
      return success;
    } catch (err) {
      console.error(`Error updating statistique ${id}:`, err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la statistique",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeStatistique = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteStatistique(id);
      if (success) {
        onUpdate();
        toast({
          title: "Succès",
          description: "La statistique a été supprimée avec succès",
        });
      }
      return success;
    } catch (err) {
      console.error(`Error removing statistique ${id}:`, err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la statistique",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    addStatistique,
    editStatistique,
    removeStatistique
  };
}
