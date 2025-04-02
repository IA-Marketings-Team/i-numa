
import { Agent } from "@/types";
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
      role: data.role || 'agent_phoner',
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
