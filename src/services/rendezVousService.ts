
import { RendezVous, Dossier } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchDossierById } from "./dossierService";

/**
 * Récupère tous les rendez-vous
 */
export const fetchRendezVous = async (): Promise<RendezVous[]> => {
  try {
    const { data, error } = await supabase
      .from('rendez_vous')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des rendez-vous:", error);
      return [];
    }

    // Récupérer les dossiers pour chaque rendez-vous
    const rendezVous = await Promise.all(data.map(async (rdv) => {
      const dossier = await fetchDossierById(rdv.dossier_id);
      if (!dossier) return null;

      return {
        id: rdv.id,
        dossierId: rdv.dossier_id,
        dossier,
        date: new Date(rdv.date),
        honore: rdv.honore,
        notes: rdv.notes,
        meetingLink: rdv.meeting_link,
        location: rdv.location
      };
    }));

    // Filtrer les rendez-vous null (en cas d'erreur)
    return rendezVous.filter(Boolean) as RendezVous[];
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des rendez-vous:", error);
    return [];
  }
};

/**
 * Récupère les rendez-vous par dossier
 */
export const fetchRendezVousByDossier = async (dossierId: string): Promise<RendezVous[]> => {
  try {
    const { data, error } = await supabase
      .from('rendez_vous')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('date', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des rendez-vous pour le dossier ${dossierId}:`, error);
      return [];
    }

    const dossier = await fetchDossierById(dossierId);
    if (!dossier) return [];

    return data.map(rdv => ({
      id: rdv.id,
      dossierId,
      dossier,
      date: new Date(rdv.date),
      honore: rdv.honore,
      notes: rdv.notes,
      meetingLink: rdv.meeting_link,
      location: rdv.location
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des rendez-vous pour le dossier ${dossierId}:`, error);
    return [];
  }
};

/**
 * Récupère un rendez-vous par son ID
 */
export const fetchRendezVousById = async (id: string): Promise<RendezVous | null> => {
  try {
    const { data, error } = await supabase
      .from('rendez_vous')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du rendez-vous ${id}:`, error);
      return null;
    }

    if (!data) return null;

    const dossier = await fetchDossierById(data.dossier_id);
    if (!dossier) return null;

    return {
      id: data.id,
      dossierId: data.dossier_id,
      dossier,
      date: new Date(data.date),
      honore: data.honore,
      notes: data.notes,
      meetingLink: data.meeting_link,
      location: data.location
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du rendez-vous ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau rendez-vous
 */
export const createRendezVous = async (rendezVous: Omit<RendezVous, 'id'>): Promise<RendezVous | null> => {
  try {
    const { data, error } = await supabase
      .from('rendez_vous')
      .insert({
        dossier_id: rendezVous.dossierId,
        date: rendezVous.date.toISOString(),
        honore: rendezVous.honore,
        notes: rendezVous.notes,
        meeting_link: rendezVous.meetingLink,
        location: rendezVous.location
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      return null;
    }

    // Mettre à jour la date de RDV dans le dossier si nécessaire
    await supabase
      .from('dossiers')
      .update({
        date_rdv: rendezVous.date.toISOString(),
        status: 'rdv_en_cours'
      })
      .eq('id', rendezVous.dossierId);

    const dossier = await fetchDossierById(data.dossier_id);
    if (!dossier) return null;

    return {
      id: data.id,
      dossierId: data.dossier_id,
      dossier,
      date: new Date(data.date),
      honore: data.honore,
      notes: data.notes,
      meetingLink: data.meeting_link,
      location: data.location
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du rendez-vous:", error);
    return null;
  }
};

/**
 * Met à jour un rendez-vous existant
 */
export const updateRendezVous = async (id: string, updates: Partial<RendezVous>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (updates.date !== undefined) updateData.date = updates.date.toISOString();
    if (updates.honore !== undefined) updateData.honore = updates.honore;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.meetingLink !== undefined) updateData.meeting_link = updates.meetingLink;
    if (updates.location !== undefined) updateData.location = updates.location;

    const { error } = await supabase
      .from('rendez_vous')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour du rendez-vous ${id}:`, error);
      return false;
    }

    // Si le statut honore a été modifié, mettre à jour les statistiques de l'agent
    if (updates.honore !== undefined) {
      const rdv = await fetchRendezVousById(id);
      if (rdv && rdv.dossier) {
        if (rdv.dossier.agentPhonerId) {
          const { data: agentData } = await supabase
            .from('profiles')
            .select('rendez_vous_honores, rendez_vous_non_honores')
            .eq('id', rdv.dossier.agentPhonerId)
            .single();

          if (agentData) {
            let honores = agentData.rendez_vous_honores || 0;
            let nonHonores = agentData.rendez_vous_non_honores || 0;

            if (updates.honore) {
              honores++;
              if (nonHonores > 0) nonHonores--;
            } else {
              nonHonores++;
              if (honores > 0) honores--;
            }

            await supabase
              .from('profiles')
              .update({
                rendez_vous_honores: honores,
                rendez_vous_non_honores: nonHonores
              })
              .eq('id', rdv.dossier.agentPhonerId);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour du rendez-vous ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un rendez-vous
 */
export const deleteRendezVous = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rendez_vous')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression du rendez-vous ${id}:`, error);
    return false;
  }
};
