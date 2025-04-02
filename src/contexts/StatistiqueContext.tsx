
import React, { createContext, useContext, useState, useEffect } from "react";
import { Statistique, Agent, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getRealmApp, getCurrentUser } from "@/lib/realm";

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
  const { user } = useAuth();
  const { toast } = useToast();

  // Chargement initial des statistiques
  useEffect(() => {
    const fetchStatistiques = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Utilisation de MongoDB Realm pour récupérer les statistiques
        const realmUser = getCurrentUser();
        if (!realmUser) {
          throw new Error("Utilisateur Realm non connecté");
        }
        
        const statsCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("statistiques");
        const result = await statsCollection.find({});
        
        // Conversion des données pour correspondre à notre type Statistique
        const statsData: Statistique[] = result.map((item: any) => ({
          id: item._id.toString(),
          periode: item.periode,
          dateDebut: new Date(item.date_debut),
          dateFin: new Date(item.date_fin),
          appelsEmis: item.appels_emis,
          appelsDecroches: item.appels_decroches,
          appelsTransformes: item.appels_transformes,
          rendezVousHonores: item.rendez_vous_honores,
          rendezVousNonHonores: item.rendez_vous_non_honores,
          dossiersValides: item.dossiers_valides,
          dossiersSigne: item.dossiers_signe,
          chiffreAffaires: item.chiffre_affaires,
        }));
        
        setStatistiques(statsData);
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
  }, [user, toast]);

  const getStatistiquesForPeriod = (debut: Date, fin: Date): Statistique[] => {
    return statistiques.filter(stat => 
      new Date(stat.dateDebut) >= debut && new Date(stat.dateFin) <= fin
    );
  };

  const getStatistiquesByPeriodeType = async (periode: "jour" | "semaine" | "mois"): Promise<Statistique[]> => {
    try {
      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }
      
      const statsCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("statistiques");
      const result = await statsCollection.find({ periode: periode });
      
      return result.map((item: any) => ({
        id: item._id.toString(),
        periode: item.periode,
        dateDebut: new Date(item.date_debut),
        dateFin: new Date(item.date_fin),
        appelsEmis: item.appels_emis,
        appelsDecroches: item.appels_decroches,
        appelsTransformes: item.appels_transformes,
        rendezVousHonores: item.rendez_vous_honores,
        rendezVousNonHonores: item.rendez_vous_non_honores,
        dossiersValides: item.dossiers_valides,
        dossiersSigne: item.dossiers_signe,
        chiffreAffaires: item.chiffre_affaires,
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques par période:', error);
      return [];
    }
  };

  const getAgentStatistics = async (agentId: string): Promise<Agent | undefined> => {
    try {
      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }
      
      const usersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
      const agent = await usersCollection.findOne({ _id: agentId });
      
      if (!agent) return undefined;
      
      return {
        id: agent._id.toString(),
        nom: agent.nom,
        prenom: agent.prenom,
        email: agent.email,
        telephone: agent.telephone || '',
        role: agent.role,
        dateCreation: new Date(agent.date_creation),
        equipeId: agent.equipe_id,
        statistiques: {
          appelsEmis: agent.appels_emis || 0,
          appelsDecroches: agent.appels_decroches || 0,
          appelsTransformes: agent.appels_transformes || 0,
          rendezVousHonores: agent.rendez_vous_honores || 0,
          rendezVousNonHonores: agent.rendez_vous_non_honores || 0,
          dossiersValides: agent.dossiers_valides || 0,
          dossiersSigne: agent.dossiers_signe || 0
        }
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques de l\'agent:', error);
      return undefined;
    }
  };

  const resetAgentStatistics = async (agentId: string): Promise<void> => {
    try {
      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }
      
      const usersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
      await usersCollection.updateOne(
        { _id: agentId },
        { 
          $set: {
            appels_emis: 0,
            appels_decroches: 0,
            appels_transformes: 0,
            rendez_vous_honores: 0,
            rendez_vous_non_honores: 0,
            dossiers_valides: 0,
            dossiers_signe: 0
          }
        }
      );
      
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
