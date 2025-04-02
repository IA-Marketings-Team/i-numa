
import React, { createContext, useContext, useState, useEffect } from "react";
import { Statistique, Agent, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { fetchStatistiques, fetchStatistiquesByPeriode, fetchStatistiquesBetweenDates } from "@/services/statistiqueService";
import { fetchAgentById, resetAgentStats } from "@/services/agentService";

interface StatistiqueContextType {
  statistiques: Statistique[];
  isLoading: boolean;
  error: Error | null;
  getStatistiquesForPeriod: (debut: Date, fin: Date) => Promise<Statistique[]>;
  getStatistiquesByPeriodeType: (periode: "jour" | "semaine" | "mois") => Promise<Statistique[]>;
  getAgentStatistics: (agentId: string) => Promise<Agent | undefined>;
  resetAgentStatistics: (agentId: string) => Promise<boolean>;
  getAuthorizedStatistics: (userRole: UserRole) => Partial<Statistique>[];
}

const StatistiqueContext = createContext<StatistiqueContextType | undefined>(undefined);

export const StatistiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadStatistiques = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStatistiques();
        setStatistiques(data);
        setError(null);
      } catch (err) {
        console.error("Error loading statistiques:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistiques();
  }, []);

  const getStatistiquesForPeriod = async (debut: Date, fin: Date): Promise<Statistique[]> => {
    try {
      return await fetchStatistiquesBetweenDates(debut, fin);
    } catch (err) {
      console.error("Error fetching statistiques for period:", err);
      return [];
    }
  };

  const getStatistiquesByPeriodeType = async (periode: "jour" | "semaine" | "mois"): Promise<Statistique[]> => {
    try {
      return await fetchStatistiquesByPeriode(periode);
    } catch (err) {
      console.error(`Error fetching statistiques for periode ${periode}:`, err);
      return [];
    }
  };

  const getAgentStatistics = async (agentId: string): Promise<Agent | undefined> => {
    try {
      return await fetchAgentById(agentId);
    } catch (err) {
      console.error(`Error fetching agent statistics for ${agentId}:`, err);
      return undefined;
    }
  };

  const resetAgentStatistics = async (agentId: string): Promise<boolean> => {
    try {
      return await resetAgentStats(agentId);
    } catch (err) {
      console.error(`Error resetting agent statistics for ${agentId}:`, err);
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
      
      return authorizedStats.filter(stat => new Date(stat.dateDebut) >= threeMonthsAgo);
    }
    
    return authorizedStats;
  };

  return (
    <StatistiqueContext.Provider value={{
      statistiques,
      isLoading,
      error,
      getStatistiquesForPeriod,
      getStatistiquesByPeriodeType,
      getAgentStatistics,
      resetAgentStatistics,
      getAuthorizedStatistics
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
