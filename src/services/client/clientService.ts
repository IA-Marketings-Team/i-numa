
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapProfileToClient } from "./utils/mapProfileToClient";
import { mapClientToDbFormat } from "./utils/mapClientToDbFormat";

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
    return data.map(mapProfileToClient);
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
    return mapProfileToClient(data);
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
    const supabaseData = mapClientToDbFormat(clientData);

    const { data, error } = await supabase
      .from('profiles')
      .insert(supabaseData)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du client:", error);
      return null;
    }

    // Retourner le client créé
    return mapProfileToClient(data);
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
    const supabaseData = mapClientToDbFormat({ ...clientData, id });

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

/**
 * Importe des clients depuis un fichier CSV
 */
export const importClientsFromCSV = async (clientsData: Omit<Client, 'id' | 'dateCreation' | 'role'>[]): Promise<Client[]> => {
  try {
    // Format each client data for database
    const dbClients = clientsData.map(client => ({
      id: crypto.randomUUID(), // Generate a unique ID for each client
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      role: 'client',
      date_creation: new Date().toISOString(),
      adresse: client.adresse,
      ville: client.ville,
      code_postal: client.codePostal,
      iban: client.iban,
      bic: client.bic,
      nom_banque: client.nomBanque,
      secteur_activite: client.secteurActivite,
      type_entreprise: client.typeEntreprise,
      besoins: client.besoins,
      statut_juridique: client.statutJuridique,
      activite_detail: client.activiteDetail,
      site_web: client.siteWeb,
      moyens_communication: client.moyensCommunication,
      commentaires: client.commentaires
    }));

    // Insert clients into the database
    const { data, error } = await supabase
      .from('profiles')
      .insert(dbClients)
      .select();

    if (error) {
      console.error("Erreur lors de l'importation des clients:", error);
      return [];
    }

    // Map database results to Client type
    return data ? data.map(mapProfileToClient) : [];
  } catch (error) {
    console.error("Erreur inattendue lors de l'importation des clients:", error);
    return [];
  }
};

export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  importClientsFromCSV
};
