
import { RendezVous } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchRendezVous = async (): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select(`
      *,
      dossier (
        *,
        client (*),
        agentPhoner (*),
        agentVisio (*)
      )
    `);
  
  if (error) {
    console.error("Error fetching rendez-vous:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchRendezVousById = async (id: string): Promise<RendezVous | null> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select(`
      *,
      dossier (
        *,
        client (*),
        agentPhoner (*),
        agentVisio (*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching rendez-vous with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const createRendezVous = async (rdvData: Omit<RendezVous, 'id'>): Promise<RendezVous> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .insert([{
      dossierId: rdvData.dossierId,
      date: rdvData.date,
      meetingLink: rdvData.meetingLink,
      location: rdvData.location,
      notes: rdvData.notes,
      honore: rdvData.honore || false
    }])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating rendez-vous:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateRendezVous = async (id: string, updates: Partial<RendezVous>): Promise<RendezVous> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .update({
      dossierId: updates.dossierId,
      date: updates.date,
      meetingLink: updates.meetingLink,
      location: updates.location,
      notes: updates.notes,
      honore: updates.honore
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating rendez-vous with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteRendezVous = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('rendez_vous')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting rendez-vous with ID ${id}:`, error);
    throw new Error(error.message);
  }
};

export const fetchRendezVousByDossier = async (dossierId: string): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select(`
      *,
      dossier (
        *,
        client (*),
        agentPhoner (*),
        agentVisio (*)
      )
    `)
    .eq('dossierId', dossierId);
  
  if (error) {
    console.error(`Error fetching rendez-vous for dossier ${dossierId}:`, error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchRendezVousByUser = async (userId: string): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select(`
      *,
      dossier!inner (
        *,
        client!inner (*),
        agentPhoner (*),
        agentVisio (*)
      )
    `)
    .or(`dossier.clientId.eq.${userId},dossier.agentPhonerId.eq.${userId},dossier.agentVisioId.eq.${userId}`);
  
  if (error) {
    console.error(`Error fetching rendez-vous for user ${userId}:`, error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const updateRendezVousHonore = async (id: string, honore: boolean): Promise<void> => {
  const { error } = await supabase
    .from('rendez_vous')
    .update({ honore })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating honore status for rendez-vous ${id}:`, error);
    throw new Error(error.message);
  }
};
