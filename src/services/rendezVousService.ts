
import { RendezVous, Dossier } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchDossierById } from "./dossierService";

export const fetchRendezVous = async (): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select('*');
  
  if (error) {
    console.error("Error fetching rendez-vous:", error);
    throw new Error(error.message);
  }
  
  // Transform and include dossier details
  const rendezVousList = await Promise.all(
    data.map(async (item) => {
      const dossier = await fetchDossierById(item.dossier_id);
      
      return {
        id: item.id,
        dossierId: item.dossier_id,
        date: new Date(item.date),
        heure: item.heure,
        honore: item.honore || false,
        notes: item.notes || '',
        location: item.location || '',
        meetingLink: item.meeting_link || '',
        statut: item.statut || 'planifie',
        solutionProposee: item.solution_proposee || '',
        dossier: dossier as Dossier
      };
    })
  );
  
  return rendezVousList;
};

export const fetchRendezVousById = async (id: string): Promise<RendezVous | null> => {
  const { data: item, error } = await supabase
    .from('rendez_vous')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching rendez-vous with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  if (!item) return null;
  
  const dossier = await fetchDossierById(item.dossier_id);
  
  const rendezVous: RendezVous = {
    id: item.id,
    dossierId: item.dossier_id,
    date: new Date(item.date),
    heure: item.heure,
    honore: item.honore || false,
    notes: item.notes || '',
    location: item.location || '',
    meetingLink: item.meeting_link || '',
    statut: item.statut || 'planifie',
    solutionProposee: item.solution_proposee || '',
    dossier: dossier as Dossier
  };
  
  return rendezVous;
};

export const createRendezVous = async (
  rendezVousData: Omit<RendezVous, "id">
): Promise<RendezVous | null> => {
  // Convert to Supabase table structure
  const rendezVousForSupabase = {
    dossier_id: rendezVousData.dossierId,
    date: rendezVousData.date instanceof Date ? rendezVousData.date.toISOString() : rendezVousData.date,
    heure: rendezVousData.heure || '',
    honore: rendezVousData.honore || false,
    notes: rendezVousData.notes || '',
    location: rendezVousData.location || '',
    meeting_link: rendezVousData.meetingLink || '',
    statut: rendezVousData.statut || 'planifie',
    solution_proposee: rendezVousData.solutionProposee || ''
  };
  
  // Insert rendez-vous
  const { data: newRendezVous, error } = await supabase
    .from('rendez_vous')
    .insert([rendezVousForSupabase])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating rendez-vous:", error);
    throw new Error(error.message);
  }
  
  // Return created rendez-vous
  return await fetchRendezVousById(newRendezVous.id);
};

export const updateRendezVous = async (id: string, updates: Partial<RendezVous>): Promise<boolean> => {
  // Convert to Supabase table structure
  const updateData: any = {};
  
  if (updates.dossierId !== undefined) updateData.dossier_id = updates.dossierId;
  if (updates.date !== undefined) {
    updateData.date = updates.date instanceof Date ? 
      updates.date.toISOString() : 
      updates.date;
  }
  if (updates.heure !== undefined) updateData.heure = updates.heure;
  if (updates.honore !== undefined) updateData.honore = updates.honore;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.meetingLink !== undefined) updateData.meeting_link = updates.meetingLink;
  if (updates.statut !== undefined) updateData.statut = updates.statut;
  if (updates.solutionProposee !== undefined) updateData.solution_proposee = updates.solutionProposee;
  
  // Update rendez-vous
  const { error } = await supabase
    .from('rendez_vous')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating rendez-vous with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const deleteRendezVous = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('rendez_vous')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting rendez-vous with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const fetchRendezVousByDossier = async (dossierId: string): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from('rendez_vous')
    .select('*')
    .eq('dossier_id', dossierId);
  
  if (error) {
    console.error(`Error fetching rendez-vous for dossier ${dossierId}:`, error);
    throw new Error(error.message);
  }
  
  const dossier = await fetchDossierById(dossierId);
  
  // Transform and include dossier details
  const rendezVousList = data.map(item => ({
    id: item.id,
    dossierId: item.dossier_id,
    date: new Date(item.date),
    honore: item.honore || false,
    notes: item.notes || '',
    location: item.location || '',
    meetingLink: item.meeting_link || '',
    dossier: dossier as Dossier
  }));
  
  return rendezVousList;
};

export const fetchUpcomingRendezVous = async (days: number = 7): Promise<RendezVous[]> => {
  // Calculate date range
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + days);
  
  const { data, error } = await supabase
    .from('rendez_vous')
    .select('*')
    .gte('date', now.toISOString())
    .lte('date', endDate.toISOString());
  
  if (error) {
    console.error(`Error fetching upcoming rendez-vous:`, error);
    throw new Error(error.message);
  }
  
  // Transform and include dossier details
  const rendezVousList = await Promise.all(
    data.map(async (item) => {
      const dossier = await fetchDossierById(item.dossier_id);
      
      return {
        id: item.id,
        dossierId: item.dossier_id,
        date: new Date(item.date),
        heure: item.heure,
        honore: item.honore || false,
        notes: item.notes || '',
        location: item.location || '',
        meetingLink: item.meeting_link || '',
        statut: item.statut || 'planifie',
        solutionProposee: item.solution_proposee || '',
        dossier: dossier as Dossier
      };
    })
  );
  
  return rendezVousList;
};
