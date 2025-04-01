
import { Agent, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère tous les agents depuis Supabase
 */
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, teams:equipe_id(*)')
      .in('role', ['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing'])
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      return [];
    }

    return data.map(agent => ({
      id: agent.id,
      nom: agent.nom || '',
      prenom: agent.prenom || '',
      email: agent.email,
      telephone: agent.telephone || '',
      role: agent.role,
      dateCreation: new Date(agent.date_creation || Date.now()),
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
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des agents:", error);
    return [];
  }
};

/**
 * Récupère les agents par type
 */
export const fetchAgentsByType = async (type: 'agent_phoner' | 'agent_visio' | 'agent_developpeur' | 'agent_marketing'): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, teams:equipe_id(*)')
      .eq('role', type)
      .order('nom');

    if (error) {
      console.error(`Erreur lors de la récupération des agents de type ${type}:`, error);
      return [];
    }

    return data.map(agent => ({
      id: agent.id,
      nom: agent.nom || '',
      prenom: agent.prenom || '',
      email: agent.email,
      telephone: agent.telephone || '',
      role: agent.role,
      dateCreation: new Date(agent.date_creation || Date.now()),
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
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des agents de type ${type}:`, error);
    return [];
  }
};

/**
 * Récupère un agent par son ID
 */
export const fetchAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, teams:equipe_id(*)')
      .eq('id', id)
      .in('role', ['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing'])
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'agent ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email,
      telephone: data.telephone || '',
      role: data.role,
      dateCreation: new Date(data.date_creation || Date.now()),
      equipeId: data.equipe_id,
      statistiques: {
        appelsEmis: data.appels_emis || 0,
        appelsDecroches: data.appels_decroches || 0,
        appelsTransformes: data.appels_transformes || 0,
        rendezVousHonores: data.rendez_vous_honores || 0,
        rendezVousNonHonores: data.rendez_vous_non_honores || 0,
        dossiersValides: data.dossiers_valides || 0,
        dossiersSigne: data.dossiers_signe || 0
      }
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'agent ${id}:`, error);
    return null;
  }
};

/**
 * Met à jour les statistiques d'un agent
 */
export const updateAgentStats = async (id: string, stats: Partial<Agent['statistiques']>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (stats.appelsEmis !== undefined) updateData.appels_emis = stats.appelsEmis;
    if (stats.appelsDecroches !== undefined) updateData.appels_decroches = stats.appelsDecroches;
    if (stats.appelsTransformes !== undefined) updateData.appels_transformes = stats.appelsTransformes;
    if (stats.rendezVousHonores !== undefined) updateData.rendez_vous_honores = stats.rendezVousHonores;
    if (stats.rendezVousNonHonores !== undefined) updateData.rendez_vous_non_honores = stats.rendezVousNonHonores;
    if (stats.dossiersValides !== undefined) updateData.dossiers_valides = stats.dossiersValides;
    if (stats.dossiersSigne !== undefined) updateData.dossiers_signe = stats.dossiersSigne;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour des statistiques de l'agent ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour des statistiques de l'agent ${id}:`, error);
    return false;
  }
};

/**
 * Assigne un agent à une équipe
 */
export const assignAgentToTeam = async (agentId: string, teamId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ equipe_id: teamId })
      .eq('id', agentId);

    if (error) {
      console.error(`Erreur lors de l'assignation de l'agent ${agentId} à l'équipe ${teamId}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de l'assignation de l'agent ${agentId} à l'équipe ${teamId}:`, error);
    return false;
  }
};

/**
 * Réinitialise les statistiques d'un agent
 */
export const resetAgentStats = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        appels_emis: 0,
        appels_decroches: 0,
        appels_transformes: 0,
        rendez_vous_honores: 0,
        rendez_vous_non_honores: 0,
        dossiers_valides: 0,
        dossiers_signe: 0
      })
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la réinitialisation des statistiques de l'agent ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la réinitialisation des statistiques de l'agent ${id}:`, error);
    return false;
  }
};
