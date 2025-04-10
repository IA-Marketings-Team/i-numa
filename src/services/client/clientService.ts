
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

/**
 * Récupère tous les clients
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client');

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }

    // Mapper les données à notre modèle Client
    return data.map(item => ({
      id: item.id,
      nom: item.nom || '',
      prenom: item.prenom || '',
      email: item.email || '',
      telephone: item.telephone || '',
      adresse: item.adresse || '',
      codePostal: item.code_postal || '',
      ville: item.ville || '',
      secteurActivite: item.secteur_activite || '',
      typeEntreprise: item.type_entreprise || '',
      dateCreation: new Date(item.date_creation),
      besoins: item.besoins || '',
      iban: item.iban || '',
      bic: item.bic || '',
      nomBanque: item.nom_banque || ''
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
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

    // Mapper les données à notre modèle Client
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      adresse: data.adresse || '',
      codePostal: data.code_postal || '',
      ville: data.ville || '',
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      dateCreation: new Date(data.date_creation),
      besoins: data.besoins || '',
      iban: data.iban || '',
      bic: data.bic || '',
      nomBanque: data.nom_banque || ''
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau client
 */
export const createClient = async (clientData: Omit<Client, 'id' | 'dateCreation'>): Promise<Client | null> => {
  try {
    // Format des données pour l'insertion dans Supabase
    const supabaseData = {
      nom: clientData.nom,
      prenom: clientData.prenom,
      email: clientData.email,
      telephone: clientData.telephone || '',
      adresse: clientData.adresse || '',
      code_postal: clientData.codePostal || '',
      ville: clientData.ville || '',
      secteur_activite: clientData.secteurActivite || '',
      type_entreprise: clientData.typeEntreprise || '',
      besoins: clientData.besoins || '',
      iban: clientData.iban || '',
      bic: clientData.bic || '',
      nom_banque: clientData.nomBanque || '',
      role: 'client' // Assurez-vous que le rôle est défini
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du client:", error);
      return null;
    }

    // Retourner le client créé
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      adresse: data.adresse || '',
      codePostal: data.code_postal || '',
      ville: data.ville || '',
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      dateCreation: new Date(data.date_creation),
      besoins: data.besoins || '',
      iban: data.iban || '',
      bic: data.bic || '',
      nomBanque: data.nom_banque || ''
    };
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return null;
  }
};

/**
 * Met à jour un client existant
 */
export const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'dateCreation'>>): Promise<boolean> => {
  try {
    // Format des données pour la mise à jour dans Supabase
    const supabaseData: any = {};
    if (clientData.nom !== undefined) supabaseData.nom = clientData.nom;
    if (clientData.prenom !== undefined) supabaseData.prenom = clientData.prenom;
    if (clientData.email !== undefined) supabaseData.email = clientData.email;
    if (clientData.telephone !== undefined) supabaseData.telephone = clientData.telephone;
    if (clientData.adresse !== undefined) supabaseData.adresse = clientData.adresse;
    if (clientData.codePostal !== undefined) supabaseData.code_postal = clientData.codePostal;
    if (clientData.ville !== undefined) supabaseData.ville = clientData.ville;
    if (clientData.secteurActivite !== undefined) supabaseData.secteur_activite = clientData.secteurActivite;
    if (clientData.typeEntreprise !== undefined) supabaseData.type_entreprise = clientData.typeEntreprise;
    if (clientData.besoins !== undefined) supabaseData.besoins = clientData.besoins;
    if (clientData.iban !== undefined) supabaseData.iban = clientData.iban;
    if (clientData.bic !== undefined) supabaseData.bic = clientData.bic;
    if (clientData.nomBanque !== undefined) supabaseData.nom_banque = clientData.nomBanque;

    const { error } = await supabase
      .from('profiles')
      .update(supabaseData)
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un client existant
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error(`Erreur lors de la suppression du client ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${id}:`, error);
    return false;
  }
};

export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient
};
