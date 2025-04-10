import { supabase } from "@/integrations/supabase/client";
import { Dossier, DossierStatus, Offre } from "@/types";
import { fetchClientById } from "@/services/client/clientService";

export const fetchDossiers = async (): Promise<Dossier[]> => {
  const { data, error } = await supabase
    .from('dossiers')
    .select('*');
  
  if (error) {
    console.error("Error fetching dossiers:", error);
    throw new Error(error.message);
  }
  
  // Fetch dossiers with offres and clients
  const dossiers: Dossier[] = await Promise.all(
    data.map(async (item) => {
      // Get related offres
      const { data: offresData, error: offresError } = await supabase
        .from('dossier_offres')
        .select('offre_id')
        .eq('dossier_id', item.id);
      
      let offres: Offre[] = [];
      
      if (!offresError && offresData) {
        // Fetch full offre details for each offre_id
        const offresPromises = offresData.map(async (relation) => {
          const offre = await fetchOffreById(relation.offre_id);
          return offre;
        });
        
        // Filter out null values and ensure type compatibility
        const fetchedOffres = await Promise.all(offresPromises);
        offres = fetchedOffres.filter(Boolean).map(offre => ({
          id: offre?.id || "",
          nom: offre?.nom || "",
          description: offre?.description || "",
          type: (offre?.type as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis") || "SEO",
          prix: offre?.prix
        }));
      } else {
        console.error("Error fetching dossier offres:", offresError);
      }
      
      // Fetch client details
      let client: Client | null = null;
      if (item.client_id) {
        client = await fetchClientById(item.client_id);
      }
      
      if (!client && item.client_id) {
        console.error(`Client not found for ID: ${item.client_id}`);
        // Create a placeholder client to prevent error
        client = {
          id: item.client_id,
          nom: "Client inconnu",
          prenom: "",
          email: "",
          telephone: "",
          adresse: "",
          role: "client",
          dateCreation: new Date(),
          secteurActivite: "",
          typeEntreprise: "",
          besoins: ""
        };
      }
      
      // Transform Supabase data to match our Dossier type
      return {
        id: item.id,
        clientId: item.client_id || "",
        client: client as Client,
        agentPhonerId: item.agent_phoner_id || undefined,
        agentVisioId: item.agent_visio_id || undefined,
        status: (item.status || 'prospect') as DossierStatus,
        dateCreation: new Date(item.date_creation || new Date()),
        dateMiseAJour: new Date(item.date_mise_a_jour || new Date()),
        dateRdv: item.date_rdv ? new Date(item.date_rdv) : undefined,
        dateValidation: item.date_validation ? new Date(item.date_validation) : undefined,
        dateSignature: item.date_signature ? new Date(item.date_signature) : undefined,
        dateArchivage: item.date_archivage ? new Date(item.date_archivage) : undefined,
        montant: item.montant || undefined,
        notes: item.notes || '',
        offres
      };
    })
  );
  
  return dossiers;
};

export const fetchDossierById = async (id: string): Promise<Dossier | null> => {
  const { data: item, error } = await supabase
    .from('dossiers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching dossier with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  if (!item) return null;
  
  // Get related offres
  const { data: offresData, error: offresError } = await supabase
    .from('dossier_offres')
    .select('offre_id')
    .eq('dossier_id', id);
  
  let offres: Offre[] = [];
  
  if (!offresError && offresData) {
    // Fetch full offre details for each offre_id
    const offresPromises = offresData.map(async (relation) => {
      const offre = await fetchOffreById(relation.offre_id);
      return offre;
    });
    
    // Filter out null values and ensure type compatibility
    const fetchedOffres = await Promise.all(offresPromises);
    offres = fetchedOffres.filter(Boolean).map(offre => ({
      id: offre?.id || "",
      nom: offre?.nom || "",
      description: offre?.description || "",
      type: (offre?.type as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis") || "SEO",
      prix: offre?.prix
    }));
  } else {
    console.error("Error fetching dossier offres:", offresError);
  }
  
  // Fetch client details
  let client: Client | null = null;
  if (item.client_id) {
    client = await fetchClientById(item.client_id);
  }
  
  if (!client && item.client_id) {
    console.error(`Client not found for ID: ${item.client_id}`);
    // Create a placeholder client to prevent error
    client = {
      id: item.client_id,
      nom: "Client inconnu",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      role: "client",
      dateCreation: new Date(),
      secteurActivite: "",
      typeEntreprise: "",
      besoins: ""
    };
  }
  
  // Transform Supabase data to match our Dossier type
  const dossier: Dossier = {
    id: item.id,
    clientId: item.client_id || "",
    client: client as Client,
    agentPhonerId: item.agent_phoner_id || undefined,
    agentVisioId: item.agent_visio_id || undefined,
    status: (item.status || 'prospect') as DossierStatus,
    dateCreation: new Date(item.date_creation || new Date()),
    dateMiseAJour: new Date(item.date_mise_a_jour || new Date()),
    dateRdv: item.date_rdv ? new Date(item.date_rdv) : undefined,
    dateValidation: item.date_validation ? new Date(item.date_validation) : undefined,
    dateSignature: item.date_signature ? new Date(item.date_signature) : undefined,
    dateArchivage: item.date_archivage ? new Date(item.date_archivage) : undefined,
    montant: item.montant || undefined,
    notes: item.notes || '',
    offres
  };
  
  return dossier;
};

export const createDossier = async (
  dossierData: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour">
): Promise<Dossier | null> => {
  // Convert to Supabase table structure
  const dossierForSupabase = {
    client_id: dossierData.clientId,
    agent_phoner_id: dossierData.agentPhonerId,
    agent_visio_id: dossierData.agentVisioId,
    status: dossierData.status,
    date_rdv: dossierData.dateRdv ? new Date(dossierData.dateRdv).toISOString() : null,
    date_validation: dossierData.dateValidation ? new Date(dossierData.dateValidation).toISOString() : null,
    date_signature: dossierData.dateSignature ? new Date(dossierData.dateSignature).toISOString() : null,
    date_archivage: dossierData.dateArchivage ? new Date(dossierData.dateArchivage).toISOString() : null,
    montant: dossierData.montant,
    notes: dossierData.notes
  };
  
  // Insert dossier
  const { data: newDossier, error } = await supabase
    .from('dossiers')
    .insert([dossierForSupabase])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating dossier:", error);
    throw new Error(error.message);
  }
  
  // Add offre relationships if any
  if (dossierData.offres && dossierData.offres.length > 0) {
    const offreRelations = dossierData.offres.map(offre => ({
      dossier_id: newDossier.id,
      offre_id: offre.id
    }));
    
    const { error: relError } = await supabase
      .from('dossier_offres')
      .insert(offreRelations);
    
    if (relError) {
      console.error("Error adding offres to dossier:", relError);
    }
  }
  
  // Return created dossier
  return await fetchDossierById(newDossier.id);
};

export const updateDossier = async (id: string, updates: Partial<Dossier>): Promise<boolean> => {
  // Convert to Supabase table structure
  const updateData: any = {};
  
  if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
  if (updates.agentPhonerId !== undefined) updateData.agent_phoner_id = updates.agentPhonerId;
  if (updates.agentVisioId !== undefined) updateData.agent_visio_id = updates.agentVisioId;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.dateRdv !== undefined) updateData.date_rdv = updates.dateRdv ? new Date(updates.dateRdv).toISOString() : null;
  if (updates.dateValidation !== undefined) updateData.date_validation = updates.dateValidation ? new Date(updates.dateValidation).toISOString() : null;
  if (updates.dateSignature !== undefined) updateData.date_signature = updates.dateSignature ? new Date(updates.dateSignature).toISOString() : null;
  if (updates.dateArchivage !== undefined) updateData.date_archivage = updates.dateArchivage ? new Date(updates.dateArchivage).toISOString() : null;
  if (updates.montant !== undefined) updateData.montant = updates.montant;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  
  // Always update the date_mise_a_jour field
  updateData.date_mise_a_jour = new Date().toISOString();
  
  // Update dossier
  const { error } = await supabase
    .from('dossiers')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating dossier with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  // Update offres if provided
  if (updates.offres && updates.offres.length >= 0) {
    // First, delete all existing relationships
    const { error: deleteError } = await supabase
      .from('dossier_offres')
      .delete()
      .eq('dossier_id', id);
    
    if (deleteError) {
      console.error(`Error removing offres from dossier ${id}:`, deleteError);
      throw new Error(deleteError.message);
    }
    
    // Then, add new relationships if there are any
    if (updates.offres.length > 0) {
      const offreRelations = updates.offres.map(offre => ({
        dossier_id: id,
        offre_id: offre.id
      }));
      
      const { error: insertError } = await supabase
        .from('dossier_offres')
        .insert(offreRelations);
      
      if (insertError) {
        console.error(`Error adding offres to dossier ${id}:`, insertError);
        throw new Error(insertError.message);
      }
    }
  }
  
  return true;
};

export const deleteDossier = async (id: string): Promise<boolean> => {
  // First delete all offre relationships
  const { error: relError } = await supabase
    .from('dossier_offres')
    .delete()
    .eq('dossier_id', id);
  
  if (relError) {
    console.error(`Error deleting dossier offres for dossier ${id}:`, relError);
    throw new Error(relError.message);
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
  
  return true;
};
