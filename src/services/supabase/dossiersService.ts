
import { supabase } from "@/integrations/supabase/client";
import { Dossier, DossierStatus, Offre } from "@/types";
import { getClientById } from "./clientsService";
import { getOffreById } from "./offresService";

export const getDossierById = async (id: string): Promise<Dossier | null> => {
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching dossier:", error);
    return null;
  }

  // Récupérer le client associé
  const client = await getClientById(data.client_id);
  if (!client) {
    console.error("Client not found for dossier:", data.client_id);
    return null;
  }

  // Récupérer les offres associées
  const { data: dossierOffres, error: offresError } = await supabase
    .from("dossier_offres")
    .select("offre_id")
    .eq("dossier_id", id);

  if (offresError) {
    console.error("Error fetching dossier offres:", offresError);
    return null;
  }

  const offres: Offre[] = [];
  for (const dossierOffre of dossierOffres) {
    const offre = await getOffreById(dossierOffre.offre_id);
    if (offre) {
      offres.push(offre);
    }
  }

  return {
    id: data.id,
    clientId: data.client_id,
    client: client,
    agentPhonerId: data.agent_phoner_id || undefined,
    agentVisioId: data.agent_visio_id || undefined,
    status: data.status,
    offres: offres,
    dateCreation: new Date(data.date_creation),
    dateMiseAJour: new Date(data.date_mise_a_jour),
    dateRdv: data.date_rdv ? new Date(data.date_rdv) : undefined,
    dateValidation: data.date_validation ? new Date(data.date_validation) : undefined,
    dateSignature: data.date_signature ? new Date(data.date_signature) : undefined,
    dateArchivage: data.date_archivage ? new Date(data.date_archivage) : undefined,
    notes: data.notes || undefined,
    montant: data.montant || undefined
  };
};

export const getAllDossiers = async (): Promise<Dossier[]> => {
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .order("date_creation", { ascending: false });

  if (error) {
    console.error("Error fetching dossiers:", error);
    return [];
  }

  const dossiers: Dossier[] = [];
  
  for (const dossierData of data) {
    // Récupérer le client associé
    const client = await getClientById(dossierData.client_id);
    if (!client) {
      console.error("Client not found for dossier:", dossierData.client_id);
      continue;
    }

    // Récupérer les offres associées
    const { data: dossierOffres, error: offresError } = await supabase
      .from("dossier_offres")
      .select("offre_id")
      .eq("dossier_id", dossierData.id);

    if (offresError) {
      console.error("Error fetching dossier offres:", offresError);
      continue;
    }

    const offres: Offre[] = [];
    for (const dossierOffre of dossierOffres) {
      const offre = await getOffreById(dossierOffre.offre_id);
      if (offre) {
        offres.push(offre);
      }
    }

    dossiers.push({
      id: dossierData.id,
      clientId: dossierData.client_id,
      client: client,
      agentPhonerId: dossierData.agent_phoner_id || undefined,
      agentVisioId: dossierData.agent_visio_id || undefined,
      status: dossierData.status,
      offres: offres,
      dateCreation: new Date(dossierData.date_creation),
      dateMiseAJour: new Date(dossierData.date_mise_a_jour),
      dateRdv: dossierData.date_rdv ? new Date(dossierData.date_rdv) : undefined,
      dateValidation: dossierData.date_validation ? new Date(dossierData.date_validation) : undefined,
      dateSignature: dossierData.date_signature ? new Date(dossierData.date_signature) : undefined,
      dateArchivage: dossierData.date_archivage ? new Date(dossierData.date_archivage) : undefined,
      notes: dossierData.notes || undefined,
      montant: dossierData.montant || undefined
    });
  }

  return dossiers;
};

export const getDossiersByClientId = async (clientId: string): Promise<Dossier[]> => {
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("client_id", clientId)
    .order("date_creation", { ascending: false });

  if (error) {
    console.error("Error fetching dossiers by client ID:", error);
    return [];
  }

  const dossiers: Dossier[] = [];
  
  // Récupérer le client une seule fois
  const client = await getClientById(clientId);
  if (!client) {
    console.error("Client not found:", clientId);
    return [];
  }

  for (const dossierData of data) {
    // Récupérer les offres associées
    const { data: dossierOffres, error: offresError } = await supabase
      .from("dossier_offres")
      .select("offre_id")
      .eq("dossier_id", dossierData.id);

    if (offresError) {
      console.error("Error fetching dossier offres:", offresError);
      continue;
    }

    const offres: Offre[] = [];
    for (const dossierOffre of dossierOffres) {
      const offre = await getOffreById(dossierOffre.offre_id);
      if (offre) {
        offres.push(offre);
      }
    }

    dossiers.push({
      id: dossierData.id,
      clientId: dossierData.client_id,
      client: client,
      agentPhonerId: dossierData.agent_phoner_id || undefined,
      agentVisioId: dossierData.agent_visio_id || undefined,
      status: dossierData.status,
      offres: offres,
      dateCreation: new Date(dossierData.date_creation),
      dateMiseAJour: new Date(dossierData.date_mise_a_jour),
      dateRdv: dossierData.date_rdv ? new Date(dossierData.date_rdv) : undefined,
      dateValidation: dossierData.date_validation ? new Date(dossierData.date_validation) : undefined,
      dateSignature: dossierData.date_signature ? new Date(dossierData.date_signature) : undefined,
      dateArchivage: dossierData.date_archivage ? new Date(dossierData.date_archivage) : undefined,
      notes: dossierData.notes || undefined,
      montant: dossierData.montant || undefined
    });
  }

  return dossiers;
};

export const getDossiersByAgentId = async (agentId: string, role: 'phoner' | 'visio'): Promise<Dossier[]> => {
  const field = role === 'phoner' ? 'agent_phoner_id' : 'agent_visio_id';
  
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq(field, agentId)
    .order("date_creation", { ascending: false });

  if (error) {
    console.error(`Error fetching dossiers by ${role} agent ID:`, error);
    return [];
  }

  const dossiers: Dossier[] = [];
  
  for (const dossierData of data) {
    // Récupérer le client associé
    const client = await getClientById(dossierData.client_id);
    if (!client) {
      console.error("Client not found for dossier:", dossierData.client_id);
      continue;
    }

    // Récupérer les offres associées
    const { data: dossierOffres, error: offresError } = await supabase
      .from("dossier_offres")
      .select("offre_id")
      .eq("dossier_id", dossierData.id);

    if (offresError) {
      console.error("Error fetching dossier offres:", offresError);
      continue;
    }

    const offres: Offre[] = [];
    for (const dossierOffre of dossierOffres) {
      const offre = await getOffreById(dossierOffre.offre_id);
      if (offre) {
        offres.push(offre);
      }
    }

    dossiers.push({
      id: dossierData.id,
      clientId: dossierData.client_id,
      client: client,
      agentPhonerId: dossierData.agent_phoner_id || undefined,
      agentVisioId: dossierData.agent_visio_id || undefined,
      status: dossierData.status,
      offres: offres,
      dateCreation: new Date(dossierData.date_creation),
      dateMiseAJour: new Date(dossierData.date_mise_a_jour),
      dateRdv: dossierData.date_rdv ? new Date(dossierData.date_rdv) : undefined,
      dateValidation: dossierData.date_validation ? new Date(dossierData.date_validation) : undefined,
      dateSignature: dossierData.date_signature ? new Date(dossierData.date_signature) : undefined,
      dateArchivage: dossierData.date_archivage ? new Date(dossierData.date_archivage) : undefined,
      notes: dossierData.notes || undefined,
      montant: dossierData.montant || undefined
    });
  }

  return dossiers;
};

export const createDossier = async (dossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour" | "client">): Promise<Dossier | null> => {
  // Insérer le dossier
  const { data: dossierData, error: dossierError } = await supabase
    .from("dossiers")
    .insert([
      {
        client_id: dossier.clientId,
        agent_phoner_id: dossier.agentPhonerId,
        agent_visio_id: dossier.agentVisioId,
        status: dossier.status,
        notes: dossier.notes,
        montant: dossier.montant,
        date_rdv: dossier.dateRdv,
        date_validation: dossier.dateValidation,
        date_signature: dossier.dateSignature,
        date_archivage: dossier.dateArchivage
      }
    ])
    .select()
    .single();

  if (dossierError) {
    console.error("Error creating dossier:", dossierError);
    return null;
  }

  // Associer les offres au dossier
  if (dossier.offres && dossier.offres.length > 0) {
    const dossierOffresData = dossier.offres.map(offre => ({
      dossier_id: dossierData.id,
      offre_id: offre.id
    }));

    const { error: offresError } = await supabase
      .from("dossier_offres")
      .insert(dossierOffresData);

    if (offresError) {
      console.error("Error associating offres with dossier:", offresError);
      return null;
    }
  }

  // Récupérer le dossier complet avec toutes les relations
  return await getDossierById(dossierData.id);
};

export const updateDossier = async (id: string, updates: Partial<Dossier>): Promise<Dossier | null> => {
  const updateData: any = {};
  
  if (updates.clientId) updateData.client_id = updates.clientId;
  if (updates.agentPhonerId !== undefined) updateData.agent_phoner_id = updates.agentPhonerId;
  if (updates.agentVisioId !== undefined) updateData.agent_visio_id = updates.agentVisioId;
  if (updates.status) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.montant !== undefined) updateData.montant = updates.montant;
  if (updates.dateRdv !== undefined) updateData.date_rdv = updates.dateRdv;
  if (updates.dateValidation !== undefined) updateData.date_validation = updates.dateValidation;
  if (updates.dateSignature !== undefined) updateData.date_signature = updates.dateSignature;
  if (updates.dateArchivage !== undefined) updateData.date_archivage = updates.dateArchivage;

  // Mettre à jour le dossier
  if (Object.keys(updateData).length > 0) {
    const { error: dossierError } = await supabase
      .from("dossiers")
      .update(updateData)
      .eq("id", id);

    if (dossierError) {
      console.error("Error updating dossier:", dossierError);
      return null;
    }
  }

  // Mettre à jour les offres associées si nécessaire
  if (updates.offres) {
    // D'abord supprimer toutes les associations existantes
    const { error: deleteError } = await supabase
      .from("dossier_offres")
      .delete()
      .eq("dossier_id", id);

    if (deleteError) {
      console.error("Error deleting dossier offres:", deleteError);
      return null;
    }

    // Ensuite ajouter les nouvelles associations
    if (updates.offres.length > 0) {
      const dossierOffresData = updates.offres.map(offre => ({
        dossier_id: id,
        offre_id: offre.id
      }));

      const { error: insertError } = await supabase
        .from("dossier_offres")
        .insert(dossierOffresData);

      if (insertError) {
        console.error("Error associating offres with dossier:", insertError);
        return null;
      }
    }
  }

  // Récupérer le dossier mis à jour
  return await getDossierById(id);
};

export const updateDossierStatus = async (id: string, newStatus: DossierStatus): Promise<Dossier | null> => {
  const updateData: any = {
    status: newStatus
  };

  // Mettre à jour les dates en fonction du nouveau statut
  const now = new Date();
  
  switch (newStatus) {
    case 'rdv_en_cours':
      updateData.date_rdv = now;
      break;
    case 'valide':
      updateData.date_validation = now;
      break;
    case 'signe':
      updateData.date_signature = now;
      break;
    case 'archive':
      updateData.date_archivage = now;
      break;
  }

  const { error } = await supabase
    .from("dossiers")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating dossier status:", error);
    return null;
  }

  // Récupérer le dossier mis à jour
  return await getDossierById(id);
};

export const deleteDossier = async (id: string): Promise<boolean> => {
  // Grâce à ON DELETE CASCADE, supprimer le dossier supprimera également les relations avec les offres
  const { error } = await supabase
    .from("dossiers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting dossier:", error);
    return false;
  }

  return true;
};
