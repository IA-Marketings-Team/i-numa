
import React, { createContext, useContext, useState } from "react";
import { Statistique, Agent, UserRole } from "@/types";
import { statistiques as mockStatistiques, agents as mockAgents } from "@/data/mockData";
import { useAuth } from "./AuthContext";

interface StatistiqueContextType {
  statistiques: Statistique[];
  getStatistiquesForPeriod: (debut: Date, fin: Date) => Statistique[];
  getAgentStatistics: (agentId: string) => Agent | undefined;
  resetAgentStatistics: (agentId: string) => void;
  getAuthorizedStatistics: (userRole: UserRole) => Partial<Statistique>[];
}

const StatistiqueContext = createContext<StatistiqueContextType | undefined>(undefined);

export const StatistiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistiques, setStatistiques] = useState<Statistique[]>(mockStatistiques);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const { user } = useAuth();

  const getStatistiquesForPeriod = (debut: Date, fin: Date): Statistique[] => {
    return statistiques.filter(stat => 
      stat.dateDebut >= debut && stat.dateFin <= fin
    );
  };

  const getAgentStatistics = (agentId: string): Agent | undefined => {
    return agents.find(agent => agent.id === agentId);
  };

  const resetAgentStatistics = (agentId: string) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId
          ? {
              ...agent,
              statistiques: {
                appelsEmis: 0,
                appelsDecroches: 0,
                appelsTransformes: 0,
                rendezVousHonores: 0,
                rendezVousNonHonores: 0,
                dossiersValides: 0,
                dossiersSigne: 0
              }
            }
          : agent
      )
    );
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
      
      return authorizedStats.filter(stat => stat.dateDebut >= threeMonthsAgo);
    }
    
    return authorizedStats;
  };

  return (
    <StatistiqueContext.Provider value={{
      statistiques,
      getStatistiquesForPeriod,
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
