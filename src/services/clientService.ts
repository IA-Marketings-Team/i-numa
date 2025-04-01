
import { Client, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère tous les clients depuis Supabase
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }

    return data.map(client => ({
      id: client.id,
      nom: client.nom || '',
      prenom: client.prenom || '',
      email: client.email,
      telephone: client.telephone || '',
      role: 'client',
      dateCreation: new Date(client.date_creation || Date.now()),
      adresse: client.adresse || '',
      secteurActivite: client.secteur_activite || '',
      typeEntreprise: client.type_entreprise || '',
      besoins: client.besoins || '',
      iban: client.iban
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des clients:", error);
    return [];
  }
};

/**
 * Récupère un client par son ID
 */
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'client')
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email,
      telephone: data.telephone || '',
      role: 'client',
      dateCreation: new Date(data.date_creation || Date.now()),
      adresse: data.adresse || '',
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || '',
      iban: data.iban
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du client ${id}:`, error);
    return null;
  }
};

/**
 * Crée ou met à jour un client
 */
export const upsertClient = async (client: Partial<Client>): Promise<Client | null> => {
  try {
    const updateData = {
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      role: 'client',
      adresse: client.adresse,
      secteur_activite: client.secteurActivite,
      type_entreprise: client.typeEntreprise,
      besoins: client.besoins,
      iban: client.iban
    };

    let result;
    
    if (client.id) {
      // Mise à jour d'un client existant
      result = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', client.id)
        .select()
        .single();
    } else {
      // Création d'un nouveau client (nécessite généralement un auth.signup préalable)
      throw new Error("La création de client nécessite une inscription utilisateur préalable");
    }

    if (result.error) {
      console.error("Erreur lors de la mise à jour du client:", result.error);
      return null;
    }

    const data = result.data;
    
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email,
      telephone: data.telephone || '',
      role: 'client',
      dateCreation: new Date(data.date_creation || Date.now()),
      adresse: data.adresse || '',
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || '',
      iban: data.iban
    };
  } catch (error) {
    console.error("Erreur inattendue lors de l'opération client:", error);
    return null;
  }
};

/**
 * Met à jour un profil client
 */
export const updateClientProfile = async (id: string, updates: Partial<Client>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (updates.nom !== undefined) updateData.nom = updates.nom;
    if (updates.prenom !== undefined) updateData.prenom = updates.prenom;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
    if (updates.adresse !== undefined) updateData.adresse = updates.adresse;
    if (updates.secteurActivite !== undefined) updateData.secteur_activite = updates.secteurActivite;
    if (updates.typeEntreprise !== undefined) updateData.type_entreprise = updates.typeEntreprise;
    if (updates.besoins !== undefined) updateData.besoins = updates.besoins;
    if (updates.iban !== undefined) updateData.iban = updates.iban;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour du client ${id}:`, error);
    return false;
  }
};
