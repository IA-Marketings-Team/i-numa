
import { useState, useEffect } from "react";
import { Statistique, UserRole } from "@/types";
import { 
  fetchStatistiques, 
  fetchStatistiquesByPeriode, 
  fetchStatistiquesBetweenDates 
} from "@/services/statistiqueService";
import { useToast } from "@/hooks/use-toast";

export function useStatistiqueData() {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadStatistiques = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStatistiques();
      
      // Assurer que toutes les statistiques ont un ID
      const statsWithId = data.map(stat => {
        if (!stat.id) {
          console.warn("Statistique sans ID détectée, génération d'un ID aléatoire");
          return { 
            ...stat, 
            id: `stat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` 
          };
        }
        return stat;
      });
      
      setStatistiques(statsWithId);
      setError(null);
    } catch (err) {
      console.error("Error loading statistiques:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatistiques();
  }, []);

  const refreshStatistiques = async () => {
    await loadStatistiques();
  };

  const getStatistiquesForPeriod = async (debut: Date, fin: Date): Promise<Statistique[]> => {
    try {
      return await fetchStatistiquesBetweenDates(debut, fin);
    } catch (err) {
      console.error("Error fetching statistiques for period:", err);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les statistiques pour cette période",
        variant: "destructive"
      });
      return [];
    }
  };

  const getStatistiquesByPeriodeType = async (periode: "jour" | "semaine" | "mois"): Promise<Statistique[]> => {
    try {
      return await fetchStatistiquesByPeriode(periode);
    } catch (err) {
      console.error(`Error fetching statistiques for periode ${periode}:`, err);
      toast({
        title: "Erreur",
        description: `Impossible de récupérer les statistiques pour la période ${periode}`,
        variant: "destructive"
      });
      return [];
    }
  };

  const getAuthorizedStatistics = (userRole: UserRole): Partial<Statistique>[] => {
    // Cloner les statistiques pour éviter de modifier les originales
    const authorizedStats = statistiques.map(stat => ({ ...stat }));
    
    // Appliquer les restrictions selon le rôle
    if (userRole !== 'responsable' && userRole !== 'superviseur') {
      // Supprimer les informations financières pour les autres rôles
      authorizedStats.forEach(stat => {
        delete stat.chiffreAffaires;
      });
    }
    
    // Limiter l'historique à 3 mois pour les agents
    if (userRole === 'agent_phoner' || userRole === 'agent_visio') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      return authorizedStats.filter(stat => {
        if (!stat.dateDebut) return false;
        return new Date(stat.dateDebut) >= threeMonthsAgo;
      });
    }
    
    return authorizedStats;
  };

  return {
    statistiques,
    isLoading,
    error,
    refreshStatistiques,
    getStatistiquesForPeriod,
    getStatistiquesByPeriodeType,
    getAuthorizedStatistics
  };
}
