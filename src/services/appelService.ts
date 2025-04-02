
import { supabase } from "@/integrations/supabase/client";

export interface Appel {
  id: string;
  clientId: string;
  agentId: string;
  date: Date;
  duree: number; // en minutes
  notes: string;
  statut: 'planifie' | 'effectue' | 'manque';
}

/**
 * Récupère tous les appels depuis Supabase
 */
export const fetchAppels = async (): Promise<Appel[]> => {
  try {
    const { data, error } = await supabase
      .from('appels')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des appels:", error);
      return [];
    }

    return data.map(appel => ({
      id: appel.id,
      clientId: appel.client_id,
      agentId: appel.agent_id,
      date: new Date(appel.date),
      duree: appel.duree,
      notes: appel.notes || '',
      statut: convertAppelStatut(appel.statut)
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des appels:", error);
    return [];
  }
};

/**
 * Récupère les appels pour un client spécifique
 */
export const fetchAppelsByClient = async (clientId: string): Promise<Appel[]> => {
  try {
    const { data, error } = await supabase
      .from('appels')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des appels pour le client ${clientId}:`, error);
      return [];
    }

    return data.map(appel => ({
      id: appel.id,
      clientId: appel.client_id,
      agentId: appel.agent_id,
      date: new Date(appel.date),
      duree: appel.duree,
      notes: appel.notes || '',
      statut: convertAppelStatut(appel.statut)
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des appels pour le client ${clientId}:`, error);
    return [];
  }
};

/**
 * Récupère les appels pour un agent spécifique
 */
export const fetchAppelsByAgent = async (agentId: string): Promise<Appel[]> => {
  try {
    const { data, error } = await supabase
      .from('appels')
      .select('*')
      .eq('agent_id', agentId)
      .order('date', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des appels pour l'agent ${agentId}:`, error);
      return [];
    }

    return data.map(appel => ({
      id: appel.id,
      clientId: appel.client_id,
      agentId: appel.agent_id,
      date: new Date(appel.date),
      duree: appel.duree,
      notes: appel.notes || '',
      statut: convertAppelStatut(appel.statut)
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des appels pour l'agent ${agentId}:`, error);
    return [];
  }
};

/**
 * Récupère un appel par son ID
 */
export const fetchAppelById = async (id: string): Promise<Appel | null> => {
  try {
    const { data, error } = await supabase
      .from('appels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'appel ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      clientId: data.client_id,
      agentId: data.agent_id,
      date: new Date(data.date),
      duree: data.duree,
      notes: data.notes || '',
      statut: convertAppelStatut(data.statut)
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'appel ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouvel appel
 */
export const createAppel = async (appel: Omit<Appel, "id">): Promise<Appel | null> => {
  try {
    const { data, error } = await supabase
      .from('appels')
      .insert({
        client_id: appel.clientId,
        agent_id: appel.agentId,
        date: appel.date.toISOString(),
        duree: appel.duree,
        notes: appel.notes,
        statut: appel.statut
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de l'appel:", error);
      return null;
    }

    return {
      id: data.id,
      clientId: data.client_id,
      agentId: data.agent_id,
      date: new Date(data.date),
      duree: data.duree,
      notes: data.notes || '',
      statut: convertAppelStatut(data.statut)
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de l'appel:", error);
    return null;
  }
};

/**
 * Met à jour un appel existant
 */
export const updateAppel = async (id: string, updates: Partial<Appel>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
    if (updates.agentId !== undefined) updateData.agent_id = updates.agentId;
    if (updates.date !== undefined) updateData.date = updates.date.toISOString();
    if (updates.duree !== undefined) updateData.duree = updates.duree;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.statut !== undefined) updateData.statut = updates.statut;
    
    const { error } = await supabase
      .from('appels')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de l'appel ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de l'appel ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un appel
 */
export const deleteAppel = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appels')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de l'appel ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de l'appel ${id}:`, error);
    return false;
  }
};

// Fonction auxiliaire pour convertir le statut d'appel
const convertAppelStatut = (statut: string): 'planifie' | 'effectue' | 'manque' => {
  if (statut === 'planifie' || statut === 'effectue' || statut === 'manque') {
    return statut as 'planifie' | 'effectue' | 'manque';
  }
  // Valeur par défaut si le statut n'est pas reconnu
  return 'planifie';
};
