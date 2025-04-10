
import { supabase } from "@/integrations/supabase/client";
import { Dossier, Offre } from "@/types";
import { fetchClientById } from "./client/clientService";
import { offreService } from "./offreService";

/**
 * Get all dossiers with related data
 */
export const getDossiers = async (): Promise<Dossier[]> => {
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .order("date_creation", { ascending: false });

  if (error) {
    console.error("Error fetching dossiers:", error);
    throw new Error("Failed to fetch dossiers");
  }

  // Enhance with clients and offres data
  const enhancedDossiers = await Promise.all(
    data.map(async (dossier) => {
      // Get client
      let client = null;
      try {
        if (dossier.client_id) {
          client = await fetchClientById(dossier.client_id);
        }
      } catch (err) {
        console.error(`Error fetching client for dossier ${dossier.id}:`, err);
      }

      // Get offres
      let offres: Offre[] = [];
      try {
        const { data: dossierOffres, error: offreError } = await supabase
          .from("dossier_offres")
          .select("offre_id")
          .eq("dossier_id", dossier.id);

        if (!offreError && dossierOffres.length > 0) {
          offres = await Promise.all(
            dossierOffres.map(async (item) => await offreService.fetchOffreById(item.offre_id))
          );
        }
      } catch (err) {
        console.error(`Error fetching offres for dossier ${dossier.id}:`, err);
      }

      return {
        id: dossier.id,
        client: client || { id: "", nom: "Inconnu", prenom: "Client", email: "" },
        agentPhonerId: dossier.agent_phoner_id,
        agentVisioId: dossier.agent_visio_id,
        status: dossier.status,
        notes: dossier.notes,
        montant: dossier.montant,
        dateCreation: dossier.date_creation ? new Date(dossier.date_creation) : new Date(),
        dateMiseAJour: dossier.date_mise_a_jour ? new Date(dossier.date_mise_a_jour) : new Date(),
        dateRdv: dossier.date_rdv ? new Date(dossier.date_rdv) : undefined,
        dateValidation: dossier.date_validation ? new Date(dossier.date_validation) : undefined,
        dateSignature: dossier.date_signature ? new Date(dossier.date_signature) : undefined,
        dateArchivage: dossier.date_archivage ? new Date(dossier.date_archivage) : undefined,
        offres,
      };
    })
  );

  return enhancedDossiers;
};

/**
 * Get a dossier by ID with related data
 */
export const getDossierById = async (id: string): Promise<Dossier> => {
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching dossier:", error);
    throw new Error("Failed to fetch dossier");
  }

  if (!data) {
    throw new Error("Dossier not found");
  }

  // Get client
  let client = null;
  try {
    if (data.client_id) {
      client = await fetchClientById(data.client_id);
    }
  } catch (err) {
    console.error(`Error fetching client for dossier ${id}:`, err);
  }

  // Get offres
  let offres: Offre[] = [];
  try {
    const { data: dossierOffres, error: offreError } = await supabase
      .from("dossier_offres")
      .select("offre_id")
      .eq("dossier_id", id);

    if (!offreError && dossierOffres.length > 0) {
      offres = await Promise.all(
        dossierOffres.map(async (item) => await offreService.fetchOffreById(item.offre_id))
      );
    }
  } catch (err) {
    console.error(`Error fetching offres for dossier ${id}:`, err);
  }

  return {
    id: data.id,
    client: client || { id: "", nom: "Inconnu", prenom: "Client", email: "" },
    agentPhonerId: data.agent_phoner_id,
    agentVisioId: data.agent_visio_id,
    status: data.status,
    notes: data.notes,
    montant: data.montant,
    dateCreation: data.date_creation ? new Date(data.date_creation) : new Date(),
    dateMiseAJour: data.date_mise_a_jour ? new Date(data.date_mise_a_jour) : new Date(),
    dateRdv: data.date_rdv ? new Date(data.date_rdv) : undefined,
    dateValidation: data.date_validation ? new Date(data.date_validation) : undefined,
    dateSignature: data.date_signature ? new Date(data.date_signature) : undefined,
    dateArchivage: data.date_archivage ? new Date(data.date_archivage) : undefined,
    offres,
  };
};

export const createDossier = async (dossierData: Partial<Dossier>): Promise<Dossier> => {
  const now = new Date().toISOString();
  
  const dossierToCreate = {
    client_id: dossierData.client?.id,
    agent_phoner_id: dossierData.agentPhonerId,
    agent_visio_id: dossierData.agentVisioId,
    status: dossierData.status || "nouveau",
    notes: dossierData.notes,
    montant: dossierData.montant,
    date_creation: now,
    date_mise_a_jour: now,
    date_rdv: dossierData.dateRdv?.toISOString(),
    date_validation: dossierData.dateValidation?.toISOString(),
    date_signature: dossierData.dateSignature?.toISOString(),
    date_archivage: dossierData.dateArchivage?.toISOString()
  };

  const { data, error } = await supabase
    .from("dossiers")
    .insert(dossierToCreate)
    .select()
    .single();

  if (error) {
    console.error("Error creating dossier:", error);
    throw new Error("Failed to create dossier");
  }

  // Add offres if provided
  if (dossierData.offres && dossierData.offres.length > 0) {
    const dossierOffres = dossierData.offres.map(offre => ({
      dossier_id: data.id,
      offre_id: offre.id
    }));

    const { error: offreError } = await supabase
      .from("dossier_offres")
      .insert(dossierOffres);

    if (offreError) {
      console.error("Error adding offres to dossier:", offreError);
    }
  }

  // Fetch the complete dossier with client and offres
  return await getDossierById(data.id);
};

export const updateDossier = async (id: string, updates: Partial<Dossier>): Promise<Dossier> => {
  const dossierUpdates: any = {
    date_mise_a_jour: new Date().toISOString()
  };

  if (updates.client?.id) dossierUpdates.client_id = updates.client.id;
  if (updates.agentPhonerId !== undefined) dossierUpdates.agent_phoner_id = updates.agentPhonerId;
  if (updates.agentVisioId !== undefined) dossierUpdates.agent_visio_id = updates.agentVisioId;
  if (updates.status !== undefined) dossierUpdates.status = updates.status;
  if (updates.notes !== undefined) dossierUpdates.notes = updates.notes;
  if (updates.montant !== undefined) dossierUpdates.montant = updates.montant;
  if (updates.dateRdv !== undefined) dossierUpdates.date_rdv = updates.dateRdv?.toISOString();
  if (updates.dateValidation !== undefined) dossierUpdates.date_validation = updates.dateValidation?.toISOString();
  if (updates.dateSignature !== undefined) dossierUpdates.date_signature = updates.dateSignature?.toISOString();
  if (updates.dateArchivage !== undefined) dossierUpdates.date_archivage = updates.dateArchivage?.toISOString();

  // Special handling for status transitions
  if (updates.status === "archive" && !updates.dateArchivage) {
    dossierUpdates.date_archivage = new Date().toISOString();
  }

  const { error } = await supabase
    .from("dossiers")
    .update(dossierUpdates)
    .eq("id", id);

  if (error) {
    console.error(`Error updating dossier ${id}:`, error);
    throw new Error("Failed to update dossier");
  }

  // Handle offres updates if provided
  if (updates.offres) {
    // First, remove all existing offres
    const { error: deleteError } = await supabase
      .from("dossier_offres")
      .delete()
      .eq("dossier_id", id);

    if (deleteError) {
      console.error(`Error removing offres from dossier ${id}:`, deleteError);
    }

    // Then add the new offres
    if (updates.offres.length > 0) {
      const dossierOffres = updates.offres.map(offre => ({
        dossier_id: id,
        offre_id: offre.id
      }));

      const { error: insertError } = await supabase
        .from("dossier_offres")
        .insert(dossierOffres);

      if (insertError) {
        console.error(`Error adding offres to dossier ${id}:`, insertError);
      }
    }
  }

  // Fetch the updated dossier
  return await getDossierById(id);
};

export const deleteDossier = async (id: string): Promise<boolean> => {
  // First, delete related dossier_offres
  const { error: offreError } = await supabase
    .from("dossier_offres")
    .delete()
    .eq("dossier_id", id);

  if (offreError) {
    console.error(`Error deleting related offres for dossier ${id}:`, offreError);
  }

  // Then delete the dossier
  const { error } = await supabase
    .from("dossiers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting dossier ${id}:`, error);
    throw new Error("Failed to delete dossier");
  }

  return true;
};

export const dossierService = {
  getDossiers,
  getDossierById,
  createDossier,
  updateDossier,
  deleteDossier
};
