
import { Dossier, DossierStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchDossiers = async (): Promise<Dossier[]> => {
  const { data, error } = await supabase
    .from('dossiers')
    .select(`
      *,
      client:clientId (*),
      agentPhoner:agentPhonerId (*),
      agentVisio:agentVisioId (*),
      offres (*)
    `);
  
  if (error) {
    console.error("Error fetching dossiers:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchDossierById = async (id: string): Promise<Dossier | null> => {
  const { data, error } = await supabase
    .from('dossiers')
    .select(`
      *,
      client:clientId (*),
      agentPhoner:agentPhonerId (*),
      agentVisio:agentVisioId (*),
      offres (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching dossier with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const createDossier = async (dossierData: Omit<Dossier, 'id'>): Promise<Dossier> => {
  // First, create the dossier record
  const { data: dossier, error: dossierError } = await supabase
    .from('dossiers')
    .insert([{
      clientId: dossierData.clientId,
      agentPhonerId: dossierData.agentPhonerId,
      agentVisioId: dossierData.agentVisioId,
      status: dossierData.status || 'prospect',
      notes: dossierData.notes,
      montant: dossierData.montant,
      dateRdv: dossierData.dateRdv
    }])
    .select()
    .single();
  
  if (dossierError) {
    console.error("Error creating dossier:", dossierError);
    throw new Error(dossierError.message);
  }
  
  // Then, if there are offres, create the dossier_offres relationship records
  if (dossierData.offres && dossierData.offres.length > 0) {
    const dossierOffres = dossierData.offres.map(offre => ({
      dossierId: dossier.id,
      offreId: offre.id
    }));
    
    const { error: offresError } = await supabase
      .from('dossier_offres')
      .insert(dossierOffres);
    
    if (offresError) {
      console.error("Error linking offres to dossier:", offresError);
      throw new Error(offresError.message);
    }
  }
  
  // Fetch the complete dossier with relations
  return fetchDossierById(dossier.id) as Promise<Dossier>;
};

export const updateDossier = async (id: string, updates: Partial<Dossier>): Promise<Dossier> => {
  // Update dossier record
  const { error: dossierError } = await supabase
    .from('dossiers')
    .update({
      clientId: updates.clientId,
      agentPhonerId: updates.agentPhonerId,
      agentVisioId: updates.agentVisioId,
      status: updates.status,
      notes: updates.notes,
      montant: updates.montant,
      dateRdv: updates.dateRdv
    })
    .eq('id', id);
  
  if (dossierError) {
    console.error(`Error updating dossier with ID ${id}:`, dossierError);
    throw new Error(dossierError.message);
  }
  
  // If offres were updated, update the dossier_offres relationships
  if (updates.offres !== undefined) {
    // First delete all existing relationships
    const { error: deleteError } = await supabase
      .from('dossier_offres')
      .delete()
      .eq('dossierId', id);
    
    if (deleteError) {
      console.error(`Error deleting dossier offres for dossier ${id}:`, deleteError);
      throw new Error(deleteError.message);
    }
    
    // Then create new relationships
    if (updates.offres.length > 0) {
      const dossierOffres = updates.offres.map(offre => ({
        dossierId: id,
        offreId: offre.id
      }));
      
      const { error: insertError } = await supabase
        .from('dossier_offres')
        .insert(dossierOffres);
      
      if (insertError) {
        console.error(`Error inserting dossier offres for dossier ${id}:`, insertError);
        throw new Error(insertError.message);
      }
    }
  }
  
  // Fetch the updated dossier with all relations
  return fetchDossierById(id) as Promise<Dossier>;
};

export const updateDossierStatus = async (id: string, status: DossierStatus): Promise<void> => {
  const { error } = await supabase
    .from('dossiers')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating status for dossier ${id}:`, error);
    throw new Error(error.message);
  }
};

export const deleteDossier = async (id: string): Promise<void> => {
  // First delete relationships
  const { error: relationsError } = await supabase
    .from('dossier_offres')
    .delete()
    .eq('dossierId', id);
  
  if (relationsError) {
    console.error(`Error deleting relations for dossier ${id}:`, relationsError);
    throw new Error(relationsError.message);
  }
  
  // Then delete the dossier
  const { error } = await supabase
    .from('dossiers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting dossier with ID ${id}:`, error);
    throw new Error(error.message);
  }
};
