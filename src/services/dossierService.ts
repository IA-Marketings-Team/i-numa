
import { Dossier, DossierStatus, Offre } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchClientById } from "./clientService";
import { fetchOffreById } from "./offreService";

/**
 * Récupère tous les dossiers depuis Supabase
 */
export const fetchDossiers = async (): Promise<Dossier[]> => {
  try {
    // Récupérer tous les dossiers
    const { data: dossiersData, error: dossiersError } = await supabase
      .from('dossiers')
      .select('*')
      .order('date_creation', { ascending: false });

    if (dossiersError) {
      console.error("Erreur lors de la récupération des dossiers:", dossiersError);
      return [];
    }

    // Récupérer les relations dossier-offres
    const { data: dossierOffresData, error: dossierOffresError } = await supabase
      .from('dossier_offres')
      .select('*');

    if (dossierOffresError) {
      console.error("Erreur lors de la récupération des relations dossier-offres:", dossierOffresError);
    }

    // Pour chaque dossier, récupérer le client et les offres associées
    const dossiers = await Promise.all(dossiersData.map(async (dossier) => {
      try {
        // Récupérer le client
        const client = await fetchClientById(dossier.client_id);
        if (!client) {
          console.error(`Client non trouvé pour le dossier ${dossier.id}`);
          return null;
        }

        // Récupérer les offres associées à ce dossier
        const dossierOffres = dossierOffresData?.filter(item => item.dossier_id === dossier.id) || [];
        const offres: Offre[] = [];

        for (const dossierOffre of dossierOffres) {
          const offre = await fetchOffreById(dossierOffre.offre_id);
          if (offre) {
            offres.push(offre);
          }
        }

        return {
          id: dossier.id,
          clientId: dossier.client_id,
          client: client,
          agentPhonerId: dossier.agent_phoner_id || undefined,
          agentVisioId: dossier.agent_visio_id || undefined,
          status: dossier.status as DossierStatus,
          offres: offres,
          dateCreation: new Date(dossier.date_creation),
          dateMiseAJour: new Date(dossier.date_mise_a_jour),
          dateRdv: dossier.date_rdv ? new Date(dossier.date_rdv) : undefined,
          dateValidation: dossier.date_validation ? new Date(dossier.date_validation) : undefined,
          dateSignature: dossier.date_signature ? new Date(dossier.date_signature) : undefined,
          dateArchivage: dossier.date_archivage ? new Date(dossier.date_archivage) : undefined,
          notes: dossier.notes,
          montant: dossier.montant
        };
      } catch (error) {
        console.error(`Erreur lors du traitement du dossier ${dossier.id}:`, error);
        return null;
      }
    }));

    // Filtrer les dossiers nuls (ceux dont le client n'a pas été trouvé)
    return dossiers.filter(Boolean) as Dossier[];
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des dossiers:", error);
    return [];
  }
};

/**
 * Récupère un dossier par son ID
 */
export const fetchDossierById = async (id: string): Promise<Dossier | null> => {
  try {
    // Récupérer le dossier
    const { data: dossier, error: dossierError } = await supabase
      .from('dossiers')
      .select('*')
      .eq('id', id)
      .single();

    if (dossierError) {
      console.error(`Erreur lors de la récupération du dossier ${id}:`, dossierError);
      return null;
    }

    if (!dossier) return null;

    // Récupérer le client
    const client = await fetchClientById(dossier.client_id);
    if (!client) {
      console.error(`Client non trouvé pour le dossier ${id}`);
      return null;
    }

    // Récupérer les offres associées
    const { data: dossierOffres, error: dossierOffresError } = await supabase
      .from('dossier_offres')
      .select('*')
      .eq('dossier_id', id);

    if (dossierOffresError) {
      console.error(`Erreur lors de la récupération des offres pour le dossier ${id}:`, dossierOffresError);
    }

    const offres: Offre[] = [];
    for (const dossierOffre of (dossierOffres || [])) {
      const offre = await fetchOffreById(dossierOffre.offre_id);
      if (offre) {
        offres.push(offre);
      }
    }

    return {
      id: dossier.id,
      clientId: dossier.client_id,
      client: client,
      agentPhonerId: dossier.agent_phoner_id || undefined,
      agentVisioId: dossier.agent_visio_id || undefined,
      status: dossier.status as DossierStatus,
      offres: offres,
      dateCreation: new Date(dossier.date_creation),
      dateMiseAJour: new Date(dossier.date_mise_a_jour),
      dateRdv: dossier.date_rdv ? new Date(dossier.date_rdv) : undefined,
      dateValidation: dossier.date_validation ? new Date(dossier.date_validation) : undefined,
      dateSignature: dossier.date_signature ? new Date(dossier.date_signature) : undefined,
      dateArchivage: dossier.date_archivage ? new Date(dossier.date_archivage) : undefined,
      notes: dossier.notes,
      montant: dossier.montant
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du dossier ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau dossier
 */
export const createDossier = async (dossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour">): Promise<Dossier | null> => {
  try {
    const now = new Date();

    // Créer le dossier de base
    const { data: createdDossier, error: createError } = await supabase
      .from('dossiers')
      .insert({
        client_id: dossier.clientId,
        agent_phoner_id: dossier.agentPhonerId,
        agent_visio_id: dossier.agentVisioId,
        status: dossier.status,
        montant: dossier.montant,
        notes: dossier.notes,
        date_rdv: dossier.dateRdv?.toISOString(),
        date_validation: dossier.dateValidation?.toISOString(),
        date_signature: dossier.dateSignature?.toISOString(),
        date_archivage: dossier.dateArchivage?.toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error("Erreur lors de la création du dossier:", createError);
      return null;
    }

    // Associer les offres au dossier
    if (dossier.offres && dossier.offres.length > 0) {
      const dossierOffres = dossier.offres.map(offre => ({
        dossier_id: createdDossier.id,
        offre_id: offre.id
      }));

      const { error: offresError } = await supabase
        .from('dossier_offres')
        .insert(dossierOffres);

      if (offresError) {
        console.error(`Erreur lors de l'association des offres au dossier:`, offresError);
      }
    }

    // Récupérer le dossier complet pour le retourner
    return await fetchDossierById(createdDossier.id);
  } catch (error) {
    console.error("Erreur inattendue lors de la création du dossier:", error);
    return null;
  }
};

/**
 * Met à jour un dossier existant
 */
export const updateDossier = async (id: string, updates: Partial<Dossier>): Promise<boolean> => {
  try {
    const updateData: any = {
      date_mise_a_jour: new Date().toISOString()
    };

    if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
    if (updates.agentPhonerId !== undefined) updateData.agent_phoner_id = updates.agentPhonerId;
    if (updates.agentVisioId !== undefined) updateData.agent_visio_id = updates.agentVisioId;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.montant !== undefined) updateData.montant = updates.montant;
    if (updates.dateRdv !== undefined) updateData.date_rdv = updates.dateRdv?.toISOString();
    if (updates.dateValidation !== undefined) updateData.date_validation = updates.dateValidation?.toISOString();
    if (updates.dateSignature !== undefined) updateData.date_signature = updates.dateSignature?.toISOString();
    if (updates.dateArchivage !== undefined) updateData.date_archivage = updates.dateArchivage?.toISOString();

    // Mettre à jour le dossier
    const { error: updateError } = await supabase
      .from('dossiers')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error(`Erreur lors de la mise à jour du dossier ${id}:`, updateError);
      return false;
    }

    // Si les offres ont été mises à jour, les réassocier
    if (updates.offres !== undefined) {
      // Supprimer les associations existantes
      const { error: deleteError } = await supabase
        .from('dossier_offres')
        .delete()
        .eq('dossier_id', id);

      if (deleteError) {
        console.error(`Erreur lors de la suppression des associations d'offres du dossier ${id}:`, deleteError);
        return false;
      }

      // Créer les nouvelles associations
      if (updates.offres.length > 0) {
        const dossierOffres = updates.offres.map(offre => ({
          dossier_id: id,
          offre_id: offre.id
        }));

        const { error: insertError } = await supabase
          .from('dossier_offres')
          .insert(dossierOffres);

        if (insertError) {
          console.error(`Erreur lors de la création des nouvelles associations d'offres du dossier ${id}:`, insertError);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour du dossier ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un dossier
 */
export const deleteDossier = async (id: string): Promise<boolean> => {
  try {
    // Supprimer d'abord les associations aux offres
    const { error: dossierOffresError } = await supabase
      .from('dossier_offres')
      .delete()
      .eq('dossier_id', id);

    if (dossierOffresError) {
      console.error(`Erreur lors de la suppression des associations d'offres du dossier ${id}:`, dossierOffresError);
    }

    // Supprimer les rendez-vous associés
    const { error: rendezVousError } = await supabase
      .from('rendez_vous')
      .delete()
      .eq('dossier_id', id);

    if (rendezVousError) {
      console.error(`Erreur lors de la suppression des rendez-vous du dossier ${id}:`, rendezVousError);
    }

    // Supprimer le dossier
    const { error: dossierError } = await supabase
      .from('dossiers')
      .delete()
      .eq('id', id);

    if (dossierError) {
      console.error(`Erreur lors de la suppression du dossier ${id}:`, dossierError);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression du dossier ${id}:`, error);
    return false;
  }
};
