import { Agent } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchAgents = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['agent_phoner', 'agent_visio'])
    .order('nom');
  
  if (error) {
    console.error("Error fetching agents:", error);
    throw new Error(error.message);
  }
  
  // Transform the data to match our Agent type
  const agents: Agent[] = data.map(profile => ({
    id: profile.id,
    nom: profile.nom || '',
    prenom: profile.prenom || '',
    email: profile.email || '',
    telephone: profile.telephone || '',
    role: profile.role as 'agent_phoner' | 'agent_visio',
    dateCreation: new Date(profile.date_creation || new Date()),
    adresse: profile.adresse || '',
    ville: profile.ville || '',
    codePostal: profile.code_postal || '',
    iban: profile.iban || '',
    bic: profile.bic || '',
    nomBanque: profile.nom_banque || '',
    equipeId: profile.equipe_id,
    statistiques: {
      appelsEmis: profile.appels_emis || 0,
      appelsDecroches: profile.appels_decroches || 0,
      appelsTransformes: profile.appels_transformes || 0,
      rendezVousHonores: profile.rendez_vous_honores || 0,
      rendezVousNonHonores: profile.rendez_vous_non_honores || 0,
      dossiersValides: profile.dossiers_valides || 0,
      dossiersSigne: profile.dossiers_signe || 0
    }
  }));
  
  return agents;
};

export const fetchAgentById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching agent with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchPhonerAgents = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'agent_phoner')
    .order('nom');
  
  if (error) {
    console.error("Error fetching phoner agents:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchVisioAgents = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'agent_visio')
    .order('nom');
  
  if (error) {
    console.error("Error fetching visio agents:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const updateAgentStats = async (
  agentId: string, 
  stats: {
    appels_emis?: number;
    appels_decroches?: number;
    appels_transformes?: number;
    rendez_vous_honores?: number;
    rendez_vous_non_honores?: number;
    dossiers_valides?: number;
    dossiers_signe?: number;
  }
) => {
  const { error } = await supabase
    .from('profiles')
    .update(stats)
    .eq('id', agentId);
  
  if (error) {
    console.error(`Error updating agent stats for ${agentId}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const resetAgentStats = async (agentId: string): Promise<boolean> => {
  // Reset all stat fields to 0
  const resetStats = {
    appels_emis: 0,
    appels_decroches: 0,
    appels_transformes: 0,
    rendez_vous_honores: 0,
    rendez_vous_non_honores: 0,
    dossiers_valides: 0,
    dossiers_signe: 0
  };
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update(resetStats)
      .eq('id', agentId);
    
    if (error) {
      console.error(`Error resetting stats for agent ${agentId}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to reset stats for agent ${agentId}:`, error);
    return false;
  }
};
