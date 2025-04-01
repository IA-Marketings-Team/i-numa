
import { Dossier, DossierStatus, Offre, Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchClientById } from "./clientService";
import { fetchOffres } from "./offreService";

/**
 * Récupère tous les dossiers
 */
export const fetchDossiers = async (): Promise<Dossier[]> => {
  try {
    const { data, error } = await supabase
      .from('dossiers')
      .select(`
        *,
        client:client_id(*)
      `)
      .order('date_creation', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des dossiers:", error);
      return [];
    }

    // Récupérer les offres pour chaque dossier
    const dossiers = await Promise.all(data.map(async (dossier) => {
      // Récupérer les offres liées au dossier
      const { data: dossierOffres, error: offresError } = await supabase
        .from('dossier_offres')
        .select('offre_id')
        .eq('dossier_id', dossier.id);

      if (offresError) {
        console.error(`Erreur lors de la récupération des offres pour le dossier ${dossier.id}:`, offresError);
        return null;
      }

      // Récupérer les détails de chaque offre
      const offreIds = dossierOffres.map(item => item.offre_id);
      let offres: Offre[] = [];
      
      if (offreIds.length > 0) {
        const { data: offresData, error: offresDetailsError } = await supabase
          .from('offres')
          .select('*')
          .in('id', offreIds);

        if (offresDetailsError) {
          console.error(`Erreur lors de la récupération des détails des offres pour le dossier ${dossier.id}:`, offresDetailsError);
        } else {
          offres = offresData.map(offre => ({
            id: offre.id,
            nom: offre.nom,
            description: offre.description || '',
            type: offre.type,
            prix: offre.prix
          }));
        }
      }

      // Transformer le client en modèle Client
      const client: Client = {
        id: dossier.client.id,
        nom: dossier.client.nom || '',
        prenom: dossier.client.prenom || '',
        email: dossier.client.email,
        telephone: dossier.client.telephone || '',
        role: 'client',
        dateCreation: new Date(dossier.client.date_creation || Date.now()),
        adresse: dossier.client.adresse || '',
        secteurActivite: dossier.client.secteur_activite || '',
        typeEntreprise: dossier.client.type_entreprise || '',
        besoins: dossier.client.besoins || '',
        iban: dossier.client.iban
      };

      return {
        id: dossier.id,
        clientId: dossier.client_id,
        client,
        agentPhonerId: dossier.agent_phoner_id,
        agentVisioId: dossier.agent_visio_id,
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

    // Filtrer les dossiers null (en cas d'erreur)
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
    const { data, error } = await supabase
      .from('dossiers')
      .select(`
        *,
        client:client_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du dossier ${id}:`, error);
      return null;
    }

    if (!data) return null;

    // Récupérer les offres liées au dossier
    const { data: dossierOffres, error: offresError } = await supabase
      .from('dossier_offres')
      .select('offre_id')
      .eq('dossier_id', data.id);

    if (offresError) {
      console.error(`Erreur lors de la récupération des offres pour le dossier ${id}:`, offresError);
      return null;
    }

    // Récupérer les détails de chaque offre
    const offreIds = dossierOffres.map(item => item.offre_id);
    let offres: Offre[] = [];
    
    if (offreIds.length > 0) {
      const { data: offresData, error: offresDetailsError } = await supabase
        .from('offres')
        .select('*')
        .in('id', offreIds);

      if (offresDetailsError) {
        console.error(`Erreur lors de la récupération des détails des offres pour le dossier ${id}:`, offresDetailsError);
      } else {
        offres = offresData.map(offre => ({
          id: offre.id,
          nom: offre.nom,
          description: offre.description || '',
          type: offre.type,
          prix: offre.prix
        }));
      }
    }

    // Transformer le client en modèle Client
    const client: Client = {
      id: data.client.id,
      nom: data.client.nom || '',
      prenom: data.client.prenom || '',
      email: data.client.email,
      telephone: data.client.telephone || '',
      role: 'client',
      dateCreation: new Date(data.client.date_creation || Date.now()),
      adresse: data.client.adresse || '',
      secteurActivite: data.client.secteur_activite || '',
      typeEntreprise: data.client.type_entreprise || '',
      besoins: data.client.besoins || '',
      iban: data.client.iban
    };

    return {
      id: data.id,
      clientId: data.client_id,
      client,
      agentPhonerId: data.agent_phoner_id,
      agentVisioId: data.agent_visio_id,
      status: data.status as DossierStatus,
      offres,
      dateCreation: new Date(data.date_creation),
      dateMiseAJour: new Date(data.date_mise_a_jour),
      dateRdv: data.date_rdv ? new Date(data.date_rdv) : undefined,
      dateValidation: data.date_validation ? new Date(data.date_validation) : undefined,
      dateSignature: data.date_signature ? new Date(data.date_signature) : undefined,
      dateArchivage: data.date_archivage ? new Date(data.date_archivage) : undefined,
      notes: data.notes,
      montant: data.montant
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
        // Ne pas échouer complètement, le dossier est créé mais sans offres
      }
    }

    // Récupérer le dossier complet
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

    const { error } = await supabase
      .from('dossiers')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour du dossier ${id}:`, error);
      return false;
    }

    // Mettre à jour les offres si nécessaire
    if (updates.offres !== undefined) {
      // Supprimer toutes les offres actuelles
      const { error: deleteError } = await supabase
        .from('dossier_offres')
        .delete()
        .eq('dossier_id', id);

      if (deleteError) {
        console.error(`Erreur lors de la suppression des offres du dossier ${id}:`, deleteError);
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
 * Met à jour le statut d'un dossier
 */
export const updateDossierStatus = async (id: string, newStatus: DossierStatus): Promise<boolean> => {
  try {
    const updateData: any = {
      status: newStatus,
      date_mise_a_jour: new Date().toISOString()
    };

    // Mettre à jour les dates en fonction du statut
    const now = new Date().toISOString();
    
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
      .from('dossiers')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour du statut du dossier ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour du statut du dossier ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un dossier
 */
export const deleteDossier = async (id: string): Promise<boolean> => {
  try {
    // Supprimer les offres liées au dossier (mais pas nécessaire grâce à ON DELETE CASCADE)
    
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
