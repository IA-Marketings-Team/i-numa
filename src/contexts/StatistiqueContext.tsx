
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Statistique, Agent } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/realm';

interface StatistiqueContextType {
  statistiques: Statistique[];
  isLoading: boolean;
  fetchStatistiques: () => Promise<Statistique[]>;
  fetchAgentByMonth: (annee: number, mois: number) => Promise<Agent | null>;
}

const StatistiqueContext = createContext<StatistiqueContextType>({
  statistiques: [],
  isLoading: false,
  fetchStatistiques: async () => [],
  fetchAgentByMonth: async () => null,
});

export const StatistiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Chargement initial des statistiques
    fetchStatistiques();
  }, []);

  const fetchStatistiques = async (): Promise<Statistique[]> => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Pas de token d'authentification disponible");
      }

      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }

      const statistiquesCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("statistiques");
      const result = await statistiquesCollection.find({});
      
      const stats = result.map((stat: any) => ({
        id: stat._id.toString(),
        userId: stat.userId,
        date: new Date(stat.date),
        appelsEmis: stat.appelsEmis,
        appelsDecroches: stat.appelsDecroches,
        appelsTransformes: stat.appelsTransformes,
        rendezVousHonores: stat.rendezVousHonores,
        rendezVousNonHonores: stat.rendezVousNonHonores,
        dossiersValides: stat.dossiersValides,
        dossiersSigne: stat.dossiersSigne
      }));
      
      setStatistiques(stats);
      return stats;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgentByMonth = async (annee: number, mois: number): Promise<Agent | null> => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Pas de token d'authentification disponible");
      }

      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }

      const agentsCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
      
      // Récupérer les agents
      const agent = await agentsCollection.findOne({ 
        role: { $in: ['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing'] } 
      });
      
      if (!agent) {
        return null;
      }

      // Récupérer les statistiques de l'agent pour le mois spécifié
      const debut = new Date(annee, mois - 1, 1);
      const fin = new Date(annee, mois, 0);
      
      const statistiquesCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("statistiques");
      const statsMois = await statistiquesCollection.find({
        userId: agent._id.toString(),
        date: { $gte: debut, $lte: fin }
      });

      // Agréger les statistiques
      const statsAggregees = statsMois.reduce((acc: any, stat: any) => {
        acc.appelsEmis += stat.appelsEmis || 0;
        acc.appelsDecroches += stat.appelsDecroches || 0;
        acc.appelsTransformes += stat.appelsTransformes || 0;
        acc.rendezVousHonores += stat.rendezVousHonores || 0;
        acc.rendezVousNonHonores += stat.rendezVousNonHonores || 0;
        acc.dossiersValides += stat.dossiersValides || 0;
        acc.dossiersSigne += stat.dossiersSigne || 0;
        return acc;
      }, {
        appelsEmis: 0,
        appelsDecroches: 0,
        appelsTransformes: 0,
        rendezVousHonores: 0,
        rendezVousNonHonores: 0,
        dossiersValides: 0,
        dossiersSigne: 0
      });

      return {
        id: agent._id.toString(),
        nom: agent.nom,
        prenom: agent.prenom,
        email: agent.email,
        telephone: agent.telephone || '',
        role: agent.role,
        equipeId: agent.equipeId,
        dateCreation: new Date(agent.dateCreation),
        statistiques: statsAggregees
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'agent pour ${mois}/${annee}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données de l'agent",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StatistiqueContext.Provider
      value={{
        statistiques,
        isLoading,
        fetchStatistiques,
        fetchAgentByMonth,
      }}
    >
      {children}
    </StatistiqueContext.Provider>
  );
};

export const useStatistique = () => useContext(StatistiqueContext);
