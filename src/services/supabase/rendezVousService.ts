
import { supabase } from "@/integrations/supabase/client";
import { RendezVous } from "@/types";
import { getDossierById } from "./dossiersService";

export const getRendezVousById = async (id: string): Promise<RendezVous | null> => {
  const { data, error } = await supabase
    .from("rendez_vous")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching rendez-vous:", error);
    return null;
  }

  // Récupérer le dossier associé
  const dossier = await getDossierById(data.dossier_id);
  if (!dossier) {
    console.error("Dossier not found for rendez-vous:", data.dossier_id);
    return null;
  }

  return {
    id: data.id,
    dossierId: data.dossier_id,
    dossier: dossier,
    date: new Date(data.date),
    honore: data.honore,
    notes: data.notes || undefined,
    meetingLink: data.meeting_link || undefined,
    location: data.location || undefined
  };
};

export const getAllRendezVous = async (): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from("rendez_vous")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching rendez-vous:", error);
    return [];
  }

  const rendezVousList: RendezVous[] = [];
  
  for (const rdvData of data) {
    // Récupérer le dossier associé
    const dossier = await getDossierById(rdvData.dossier_id);
    if (!dossier) {
      console.error("Dossier not found for rendez-vous:", rdvData.dossier_id);
      continue;
    }

    rendezVousList.push({
      id: rdvData.id,
      dossierId: rdvData.dossier_id,
      dossier: dossier,
      date: new Date(rdvData.date),
      honore: rdvData.honore,
      notes: rdvData.notes || undefined,
      meetingLink: rdvData.meeting_link || undefined,
      location: rdvData.location || undefined
    });
  }

  return rendezVousList;
};

export const getRendezVousByDossierId = async (dossierId: string): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from("rendez_vous")
    .select("*")
    .eq("dossier_id", dossierId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching rendez-vous by dossier ID:", error);
    return [];
  }

  const rendezVousList: RendezVous[] = [];
  
  // Récupérer le dossier une seule fois
  const dossier = await getDossierById(dossierId);
  if (!dossier) {
    console.error("Dossier not found:", dossierId);
    return [];
  }

  for (const rdvData of data) {
    rendezVousList.push({
      id: rdvData.id,
      dossierId: rdvData.dossier_id,
      dossier: dossier,
      date: new Date(rdvData.date),
      honore: rdvData.honore,
      notes: rdvData.notes || undefined,
      meetingLink: rdvData.meeting_link || undefined,
      location: rdvData.location || undefined
    });
  }

  return rendezVousList;
};

export const getRendezVousByPeriod = async (debut: Date, fin: Date): Promise<RendezVous[]> => {
  const { data, error } = await supabase
    .from("rendez_vous")
    .select("*")
    .gte("date", debut.toISOString())
    .lte("date", fin.toISOString())
    .order("date");

  if (error) {
    console.error("Error fetching rendez-vous by period:", error);
    return [];
  }

  const rendezVousList: RendezVous[] = [];
  
  for (const rdvData of data) {
    // Récupérer le dossier associé
    const dossier = await getDossierById(rdvData.dossier_id);
    if (!dossier) {
      console.error("Dossier not found for rendez-vous:", rdvData.dossier_id);
      continue;
    }

    rendezVousList.push({
      id: rdvData.id,
      dossierId: rdvData.dossier_id,
      dossier: dossier,
      date: new Date(rdvData.date),
      honore: rdvData.honore,
      notes: rdvData.notes || undefined,
      meetingLink: rdvData.meeting_link || undefined,
      location: rdvData.location || undefined
    });
  }

  return rendezVousList;
};

export const createRendezVous = async (rendezVous: Omit<RendezVous, "id" | "dossier">): Promise<RendezVous | null> => {
  const { data, error } = await supabase
    .from("rendez_vous")
    .insert([
      {
        dossier_id: rendezVous.dossierId,
        date: rendezVous.date.toISOString(),
        honore: rendezVous.honore,
        notes: rendezVous.notes,
        meeting_link: rendezVous.meetingLink,
        location: rendezVous.location
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating rendez-vous:", error);
    return null;
  }

  // Récupérer le rendez-vous complet avec toutes les relations
  return await getRendezVousById(data.id);
};

export const updateRendezVous = async (id: string, updates: Partial<RendezVous>): Promise<RendezVous | null> => {
  const updateData: any = {};
  
  if (updates.dossierId) updateData.dossier_id = updates.dossierId;
  if (updates.date) updateData.date = updates.date.toISOString();
  if (updates.honore !== undefined) updateData.honore = updates.honore;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.meetingLink !== undefined) updateData.meeting_link = updates.meetingLink;
  if (updates.location !== undefined) updateData.location = updates.location;

  const { error } = await supabase
    .from("rendez_vous")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating rendez-vous:", error);
    return null;
  }

  // Récupérer le rendez-vous mis à jour
  return await getRendezVousById(id);
};

export const deleteRendezVous = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("rendez_vous")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting rendez-vous:", error);
    return false;
  }

  return true;
};
