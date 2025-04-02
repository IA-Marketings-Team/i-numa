
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
  
  return data || [];
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
