
import React, { createContext, useContext, useState, useEffect } from "react";
import { Statistique, Agent, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface StatistiqueContextType {
  statistiques: Statistique[];
  isLoading: boolean;
  error: string | null;
  getStatistiquesForPeriod: (debut: Date, fin: Date) => Statistique[];
  getStatistiquesByPeriodeType: (periode: "jour" | "semaine" | "mois") => Promise<Statistique[]>;
  getAgentStatistics: (agentId: string) => Promise<Agent | undefined>;
  resetAgentStatistics: (agentId: string) => Promise<void>;
  getAuthorizedStatistics: (userRole: UserRole) => Partial<Statistique>[];
}

const StatistiqueContext = createContext<StatistiqueContextType | undefined>(undefined);

export const StatistiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, getToken } = useAuth();
  const { toast } = useToast();

  // Chargement initial des statistiques
  useEffect(() => {
    const fetchStatistiques = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await fetch('/api/statistiques', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques');
        }
        
        const data = await response.json();
        setStatistiques(data);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les statistiques",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatistiques();
  }, [user, getToken, toast]);

  const getStatistiquesForPeriod = (debut: Date, fin: Date): Statistique[] => {
    return statistiques.filter(stat => 
      new Date(stat.dateDebut) >= debut && new Date(stat.dateFin) <= fin
    );
  };

  const getStatistiquesByPeriodeType = async (periode: "jour" | "semaine" | "mois"): Promise<Statistique[]> => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/statistiques/periode/${periode}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des statistiques par période: ${periode}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques par période:', error);
      return [];
    }
  };

  const getAgentStatistics = async (agentId: string): Promise<Agent | undefined> => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/users/${agentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques de l\'agent');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques de l\'agent:', error);
      return undefined;
    }
  };

  const resetAgentStatistics = async (agentId: string): Promise<void> => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/users/${agentId}/reset-stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation des statistiques');
      }
      
      // Mettre à jour les statistiques locales
      toast({
        title: "Succès",
        description: "Les statistiques de l'agent ont été réinitialisées."
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des statistiques:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser les statistiques de l'agent"
      });
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
