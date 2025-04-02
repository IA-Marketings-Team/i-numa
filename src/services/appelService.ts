
import { supabase } from "@/integrations/supabase/client";
import { Appel } from "@/types";

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
      statut: convertAppelStatut(appel.statut),
      entreprise: appel.entreprise,
      gerant: appel.gerant,
      contact: appel.contact,
      email: appel.email,
      codePostal: appel.code_postal,
      dateRdv: appel.date_rdv ? new Date(appel.date_rdv) : undefined,
      heureRdv: appel.heure_rdv
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des appels:", error);
    return [];
  }
};

/**
 * Récupère les appels en fonction des filtres
 */
export const fetchAppelsFiltered = async (
  filters: {
    statut?: string;
    dateDebut?: Date;
    dateFin?: Date;
    codePostal?: string;
    agentId?: string;
  }
): Promise<Appel[]> => {
  try {
    let query = supabase
      .from('appels')
      .select('*')
      .order('date', { ascending: false });

    if (filters.statut) {
      query = query.eq('statut', filters.statut);
    }

    if (filters.codePostal) {
      query = query.eq('code_postal', filters.codePostal);
    }

    if (filters.agentId) {
      query = query.eq('agent_id', filters.agentId);
    }

    if (filters.dateDebut) {
      query = query.gte('date', filters.dateDebut.toISOString());
    }

    if (filters.dateFin) {
      query = query.lte('date', filters.dateFin.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des appels filtrés:", error);
      return [];
    }

    return data.map(appel => ({
      id: appel.id,
      clientId: appel.client_id,
      agentId: appel.agent_id,
      date: new Date(appel.date),
      duree: appel.duree,
      notes: appel.notes || '',
      statut: convertAppelStatut(appel.statut),
      entreprise: appel.entreprise,
      gerant: appel.gerant,
      contact: appel.contact,
      email: appel.email,
      codePostal: appel.code_postal,
      dateRdv: appel.date_rdv ? new Date(appel.date_rdv) : undefined,
      heureRdv: appel.heure_rdv
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
      statut: convertAppelStatut(appel.statut),
      entreprise: appel.entreprise,
      gerant: appel.gerant,
      contact: appel.contact,
      email: appel.email,
      codePostal: appel.code_postal,
      dateRdv: appel.date_rdv ? new Date(appel.date_rdv) : undefined,
      heureRdv: appel.heure_rdv
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
      statut: convertAppelStatut(appel.statut),
      entreprise: appel.entreprise,
      gerant: appel.gerant,
      contact: appel.contact,
      email: appel.email,
      codePostal: appel.code_postal,
      dateRdv: appel.date_rdv ? new Date(appel.date_rdv) : undefined,
      heureRdv: appel.heure_rdv
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
      statut: convertAppelStatut(data.statut),
      entreprise: data.entreprise,
      gerant: data.gerant,
      contact: data.contact,
      email: data.email,
      codePostal: data.code_postal,
      dateRdv: data.date_rdv ? new Date(data.date_rdv) : undefined,
      heureRdv: data.heure_rdv
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
        statut: appel.statut,
        entreprise: appel.entreprise,
        gerant: appel.gerant,
        contact: appel.contact,
        email: appel.email,
        code_postal: appel.codePostal,
        date_rdv: appel.dateRdv?.toISOString(),
        heure_rdv: appel.heureRdv
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
      statut: convertAppelStatut(data.statut),
      entreprise: data.entreprise,
      gerant: data.gerant,
      contact: data.contact,
      email: data.email,
      codePostal: data.code_postal,
      dateRdv: data.date_rdv ? new Date(data.date_rdv) : undefined,
      heureRdv: data.heure_rdv
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
    const updateData: Record<string, any> = {};
    
    if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
    if (updates.agentId !== undefined) updateData.agent_id = updates.agentId;
    if (updates.date !== undefined) updateData.date = updates.date.toISOString();
    if (updates.duree !== undefined) updateData.duree = updates.duree;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.statut !== undefined) updateData.statut = updates.statut;
    if (updates.entreprise !== undefined) updateData.entreprise = updates.entreprise;
    if (updates.gerant !== undefined) updateData.gerant = updates.gerant;
    if (updates.contact !== undefined) updateData.contact = updates.contact;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.codePostal !== undefined) updateData.code_postal = updates.codePostal;
    if (updates.dateRdv !== undefined) updateData.date_rdv = updates.dateRdv.toISOString();
    if (updates.heureRdv !== undefined) updateData.heure_rdv = updates.heureRdv;
    
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
const convertAppelStatut = (statut: string): Appel['statut'] => {
  const validStatuts: Appel['statut'][] = ['RDV', 'Vente', 'Répondeur', 'Injoignable', 'Refus argumentaire', 'Refus intro', 'Rappel', 'Hors cible', 'planifie', 'effectue', 'manque'];
  
  if (validStatuts.includes(statut as any)) {
    return statut as Appel['statut'];
  }
  
  // Valeur par défaut si le statut n'est pas reconnu
  return 'planifie';
};
