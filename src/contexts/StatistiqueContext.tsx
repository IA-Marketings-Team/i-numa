
import React, { createContext, useContext, useState } from "react";
import { Statistique, Agent, UserRole } from "@/types";
import { useStatistiqueData } from "@/hooks/useStatistiqueData";
import { useStatistiqueActions } from "@/hooks/useStatistiqueActions";
import { useAgentStatistics } from "@/hooks/useAgentStatistics";

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
  // Utiliser les hooks personnalisés pour séparer la logique
  const {
    statistiques,
    isLoading,
    error,
    refreshStatistiques,
    getStatistiquesForPeriod,
    getStatistiquesByPeriodeType,
    getAuthorizedStatistics
  } = useStatistiqueData();

  const {
    addStatistique,
    editStatistique,
    removeStatistique
  } = useStatistiqueActions(refreshStatistiques);

  const {
    getAgentStatistics,
    resetAgentStatistics
  } = useAgentStatistics();

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
