
import { useState } from "react";
import { Agent, UserRole } from "@/types";
import { fetchAgentById, resetAgentStats } from "@/services/agentService";
import { useToast } from "@/hooks/use-toast";

export function useAgentStatistics() {
  const { toast } = useToast();

  const getAgentStatistics = async (agentId: string): Promise<Agent | undefined> => {
    try {
      const agentData = await fetchAgentById(agentId);
      
      if (!agentData) return undefined;
      
      const userRole = agentData.role as UserRole;
      
      // Transform to Agent type
      const agent: Agent = {
        id: agentData.id,
        nom: agentData.nom || '',
        prenom: agentData.prenom || '',
        email: agentData.email || '',
        telephone: agentData.telephone || '',
        role: userRole,
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

  return {
    getAgentStatistics,
    resetAgentStatistics
  };
}
