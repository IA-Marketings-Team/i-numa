
import { Agent, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère un agent par son ID depuis Supabase
 */
export const fetchAgentById = async (id: string): Promise<Agent | undefined> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'agent ${id}:`, error);
      return undefined;
    }

    if (!data) return undefined;

    // Conversion du profil Supabase en Agent
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: convertToUserRole(data.role),
      equipeId: data.equipe_id || null,
      dateCreation: new Date(data.date_creation),
      appelsEmis: data.appels_emis || 0,
      appelsDecroches: data.appels_decroches || 0,
      appelsTransformes: data.appels_transformes || 0,
      rendezVousHonores: data.rendez_vous_honores || 0,
      rendezVousNonHonores: data.rendez_vous_non_honores || 0,
      dossiersValides: data.dossiers_valides || 0,
      dossiersSigne: data.dossiers_signe || 0
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'agent ${id}:`, error);
    return undefined;
  }
};

/**
 * Réinitialise les statistiques d'un agent
 */
export const resetAgentStats = async (agentId: string): Promise<boolean> => {
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
      .eq('id', agentId);
    
    if (error) {
      console.error(`Erreur lors de la réinitialisation des statistiques de l'agent ${agentId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la réinitialisation des statistiques de l'agent ${agentId}:`, error);
    return false;
  }
};

/**
 * Helper function to convert string to UserRole type
 */
const convertToUserRole = (role: string | null): UserRole => {
  switch (role) {
    case 'agent_phoner':
      return 'agent_phoner';
    case 'agent_visio':
      return 'agent_visio';
    case 'superviseur':
      return 'superviseur';
    case 'responsable':
      return 'responsable';
    case 'client':
      return 'client';
    default:
      return 'client';
  }
};

/**
 * Récupère tous les agents depuis Supabase
 */
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      nom: profile.nom || '',
      prenom: profile.prenom || '',
      email: profile.email || '',
      telephone: profile.telephone || '',
      role: convertToUserRole(profile.role),
      equipeId: profile.equipe_id || null,
      dateCreation: new Date(profile.date_creation),
      appelsEmis: profile.appels_emis || 0,
      appelsDecroches: profile.appels_decroches || 0,
      appelsTransformes: profile.appels_transformes || 0,
      rendezVousHonores: profile.rendez_vous_honores || 0,
      rendezVousNonHonores: profile.rendez_vous_non_honores || 0,
      dossiersValides: profile.dossiers_valides || 0,
      dossiersSigne: profile.dossiers_signe || 0
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des agents:", error);
    return [];
  }
};

/**
 * Récupère tous les agents d'un certain rôle
 */
export const fetchAgentsByRole = async (role: UserRole): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('nom');

    if (error) {
      console.error(`Erreur lors de la récupération des agents avec le rôle ${role}:`, error);
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      nom: profile.nom || '',
      prenom: profile.prenom || '',
      email: profile.email || '',
      telephone: profile.telephone || '',
      role: convertToUserRole(profile.role),
      equipeId: profile.equipe_id || null,
      dateCreation: new Date(profile.date_creation),
      appelsEmis: profile.appels_emis || 0,
      appelsDecroches: profile.appels_decroches || 0,
      appelsTransformes: profile.appels_transformes || 0,
      rendezVousHonores: profile.rendez_vous_honores || 0,
      rendezVousNonHonores: profile.rendez_vous_non_honores || 0,
      dossiersValides: profile.dossiers_valides || 0,
      dossiersSigne: profile.dossiers_signe || 0
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des agents avec le rôle ${role}:`, error);
    return [];
  }
};
