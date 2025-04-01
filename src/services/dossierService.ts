
import { Dossier, DossierStatus, Offre, Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchClientById } from "./clientService";
import { fetchOffreById } from "./offreService";

/**
 * Récupère tous les dossiers depuis Supabase
 */
export const fetchDossiers = async (): Promise<Dossier[]> => {
  try {
    // Récupérer les dossiers
    const { data: dossiersData, error: dossiersError } = await supabase
      .from('dossiers')
      .select('*')
      .order('date_creation', { ascending: false });

    if (dossiersError) {
      console.error("Erreur lors de la récupération des dossiers:", dossiersError);
      return [];
    }

    // Construire les dossiers complets avec les relations
    const dossiers = await Promise.all(dossiersData.map(async (dossier) => {
      // Récupérer le client
      const client = await fetchClientById(dossier.client_id);
      if (!client) return null;

      // Récupérer les offres du dossier
      const { data: dossierOffresData, error: dossierOffresError } = await supabase
        .from('dossier_offres')
        .select('offre_id')
        .eq('dossier_id', dossier.id);

      if (dossierOffresError) {
        console.error(`Erreur lors de la récupération des offres pour le dossier ${dossier.id}:`, dossierOffresError);
        return null;
      }

      // Récupérer les détails de chaque offre
      const offres: Offre[] = [];
      for (const dossierOffre of dossierOffresData) {
        const offre = await fetchOffreById(dossierOffre.offre_id);
        if (offre) offres.push(offre);
      }

      return {
        id: dossier.id,
        clientId: dossier.client_id,
        client,
        agentPhonerId: dossier.agent_phoner_id || undefined,
        agentVisioId: dossier.agent_visio_id || undefined,
        status: dossier.status as DossierStatus,
        offres,
        dateCreation: new Date(dossier.date_creation),
        dateMiseAJour: new Date(dossier.date_mise_a_jour),
        dateRdv: dossier.date_rdv ? new Date(dossier.date_rdv) : undefined,
        dateValidation: dossier.date_validation ? new Date(dossier.date_validation) : undefined,
        dateSignature: dossier.date_signature ? new Date(dossier.date_signature) : undefined,
        dateArchivage: dossier.date_archivage ? new Date(dossier.date_archivage) : undefined,
        notes: dossier.notes,
        montant: dossier.montant
      };
    }));

    // Filtrer les éventuels dossiers null (en cas d'erreur)
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

    // Récupérer le client
    const client = await fetchClientById(dossier.client_id);
    if (!client) return null;

    // Récupérer les offres du dossier
    const { data: dossierOffresData, error: dossierOffresError } = await supabase
      .from('dossier_offres')
      .select('offre_id')
      .eq('dossier_id', dossier.id);

    if (dossierOffresError) {
      console.error(`Erreur lors de la récupération des offres pour le dossier ${dossier.id}:`, dossierOffresError);
      return null;
    }

    // Récupérer les détails de chaque offre
    const offres: Offre[] = [];
    for (const dossierOffre of dossierOffresData) {
      const offre = await fetchOffreById(dossierOffre.offre_id);
      if (offre) offres.push(offre);
    }

    return {
      id: dossier.id,
      clientId: dossier.client_id,
      client,
      agentPhonerId: dossier.agent_phoner_id || undefined,
      agentVisioId: dossier.agent_visio_id || undefined,
      status: dossier.status as DossierStatus,
      offres,
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
export const createDossier = async (dossier: Omit<Dossier, 'id' | 'dateCreation' | 'dateMiseAJour'>): Promise<Dossier | null> => {
  try {
    // Créer le dossier
    const { data, error } = await supabase
      .from('dossiers')
      .insert({
        client_id: dossier.clientId,
        agent_phoner_id: dossier.agentPhonerId,
        agent_visio_id: dossier.agentVisioId,
        status: dossier.status,
        notes: dossier.notes,
        montant: dossier.montant,
        date_rdv: dossier.dateRdv?.toISOString(),
        date_validation: dossier.dateValidation?.toISOString(),
        date_signature: dossier.dateSignature?.toISOString(),
        date_archivage: dossier.dateArchivage?.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du dossier:", error);
      return null;
    }

    // Ajouter les offres au dossier
    if (dossier.offres && dossier.offres.length > 0) {
      const dossierOffres = dossier.offres.map(offre => ({
        dossier_id: data.id,
        offre_id: offre.id
      }));

      const { error: offresError } = await supabase
        .from('dossier_offres')
        .insert(dossierOffres);

      if (offresError) {
        console.error(`Erreur lors de l'ajout des offres au dossier ${data.id}:`, offresError);
        // Ne pas retourner null, continuer car le dossier est créé
      }
    }

    return await fetchDossierById(data.id);
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
    const updateData: any = {};
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
    
    updateData.date_mise_a_jour = new Date().toISOString();

    // Mettre à jour le dossier
    const { error } = await supabase
      .from('dossiers')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour du dossier ${id}:`, error);
      return false;
    }

    // Si les offres sont modifiées, les mettre à jour
    if (updates.offres) {
      // Supprimer les offres existantes
      const { error: deleteError } = await supabase
        .from('dossier_offres')
        .delete()
        .eq('dossier_id', id);

      if (deleteError) {
        console.error(`Erreur lors de la suppression des offres existantes du dossier ${id}:`, deleteError);
        return false;
      }

      // Ajouter les nouvelles offres
      if (updates.offres.length > 0) {
        const dossierOffres = updates.offres.map(offre => ({
          dossier_id: id,
          offre_id: offre.id
        }));

        const { error: insertError } = await supabase
          .from('dossier_offres')
          .insert(dossierOffres);

        if (insertError) {
          console.error(`Erreur lors de l'ajout des nouvelles offres au dossier ${id}:`, insertError);
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
    // Supprimer d'abord les rendez-vous liés
    const { error: rendezVousError } = await supabase
      .from('rendez_vous')
      .delete()
      .eq('dossier_id', id);

    if (rendezVousError) {
      console.error(`Erreur lors de la suppression des rendez-vous du dossier ${id}:`, rendezVousError);
      // Continuer malgré l'erreur
    }

    // Supprimer les offres liées
    const { error: offresError } = await supabase
      .from('dossier_offres')
      .delete()
      .eq('dossier_id', id);

    if (offresError) {
      console.error(`Erreur lors de la suppression des offres du dossier ${id}:`, offresError);
      // Continuer malgré l'erreur
    }

    // Supprimer le dossier
    const { error } = await supabase
      .from('dossiers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression du dossier ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression du dossier ${id}:`, error);
    return false;
  }
};
