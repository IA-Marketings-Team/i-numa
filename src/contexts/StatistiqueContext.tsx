
import React, { createContext, useContext, useState, useEffect } from "react";
import { Statistique, Agent, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { 
  fetchStatistiques, 
  fetchStatistiquesByPeriode, 
  fetchStatistiquesBetweenDates,
  createStatistique,
  updateStatistique,
  deleteStatistique
} from "@/services/statistiqueService";
import { fetchAgentById, resetAgentStats } from "@/services/agentService";
import { useToast } from "@/hooks/use-toast";

interface StatistiqueContextType {
  statistiques: Array<Statistique>;
  isLoading: boolean;
  error: Error | null;
  refreshStatistiques: () => Promise<void>;
  getStatistiquesForPeriod: (debut: Date, fin: Date) => Promise<Statistique[]>;
  getStatistiquesByPeriodeType: (periode: "jour" | "semaine" | "mois") => Promise<Statistique[]>;
  getAgentStatistics: (agentId: string) => Promise<Agent | undefined>;
  resetAgentStatistics: (agentId: string) => Promise<boolean>;
  getAuthorizedStatistics: (userRole: UserRole) => Partial<Statistique>[];
  addStatistique: (data: Omit<Statistique, "id">) => Promise<Statistique | null>;
  editStatistique: (id: string, data: Partial<Statistique>) => Promise<boolean>;
  removeStatistique: (id: string) => Promise<boolean>;
}

const StatistiqueContext = createContext<StatistiqueContextType | undefined>(undefined);

export const StatistiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
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

  const getAgentStatistics = async (agentId: string): Promise<Agent | undefined> => {
    try {
      const agentData = await fetchAgentById(agentId);
      
      if (!agentData) return undefined;
      
      // Transform to Agent type
      const agent: Agent = {
        id: agentData.id,
        nom: agentData.nom || '',
        prenom: agentData.prenom || '',
        email: agentData.email || '',
        telephone: agentData.telephone || '',
        role: agentData.role as UserRole,
        dateCreation: new Date(),
        statistiques: {
          appelsEmis: agentData.appels_emis || 0,
          appelsDecroches: agentData.appels_decroches || 0,
          appelsTransformes: agentData.appels_transformes || 0,
          rendezVousHonores: agentData.rendez_vous_honores || 0,
          rendezVousNonHonores: agentData.rendez_vous_non_honores || 0,
          dossiersValides: agentData.dossiers_valides || 0,
          dossiersSigne: agentData.dossiers_signe || 0,
        }
      };
      
      return agent;
    } catch (err) {
      console.error(`Error fetching agent statistics for ${agentId}:`, err);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les statistiques de l'agent",
        variant: "destructive"
      });
      return undefined;
    }
  };

  const resetAgentStatistics = async (agentId: string): Promise<boolean> => {
    try {
      const result = await resetAgentStats(agentId);
      if (result) {
        toast({
          title: "Succès",
          description: "Les statistiques de l'agent ont été réinitialisées",
        });
      }
      return result;
    } catch (err) {
      console.error(`Error resetting agent statistics for ${agentId}:`, err);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les statistiques de l'agent",
        variant: "destructive"
      });
      return false;
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

  const addStatistique = async (data: Omit<Statistique, "id">): Promise<Statistique | null> => {
    try {
      const newStat = await createStatistique(data);
      if (newStat) {
        // Assurez-vous que la nouvelle statistique a un ID
        if (!newStat.id) {
          newStat.id = `stat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        }
        
        setStatistiques(prev => [...prev, newStat]);
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
        setStatistiques(prev => prev.map(stat => 
          stat.id === id ? { ...stat, ...data } : stat
        ));
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
        setStatistiques(prev => prev.filter(stat => stat.id !== id));
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

  return (
    <StatistiqueContext.Provider value={{
      statistiques,
      isLoading,
      error,
      refreshStatistiques,
      getStatistiquesForPeriod,
      getStatistiquesByPeriodeType,
      getAgentStatistics,
      resetAgentStatistics,
      getAuthorizedStatistics,
      addStatistique,
      editStatistique,
      removeStatistique
    }}>
      {children}
    </StatistiqueContext.Provider>
  );
};

export const useStatistique = () => {
  const context = useContext(StatistiqueContext);
  if (context === undefined) {
    throw new Error("useStatistique must be used within a StatistiqueProvider");
  }
  return context;
};
