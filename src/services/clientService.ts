
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

    return data.map(client => ({
      id: client.id,
      nom: client.nom || '',
      prenom: client.prenom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      role: 'client',
      dateCreation: new Date(client.date_creation),
      adresse: client.adresse || '',
      ville: client.ville || '',
      codePostal: client.code_postal || '',
      iban: client.iban,
      bic: client.bic,
      nomBanque: client.nom_banque,
      secteurActivite: client.secteur_activite || '',
      typeEntreprise: client.type_entreprise || '',
      besoins: client.besoins || ''
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

    if (error || !data) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: 'client',
      dateCreation: new Date(data.date_creation),
      adresse: data.adresse || '',
      ville: data.ville || '',
      codePostal: data.code_postal || '',
      iban: data.iban,
      bic: data.bic,
      nomBanque: data.nom_banque,
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || ''
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du client ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau client
 */
export const createClient = async (clientData: Omit<Client, 'id' | 'dateCreation' | 'role'>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        nom: clientData.nom,
        prenom: clientData.prenom,
        email: clientData.email,
        telephone: clientData.telephone,
        role: 'client',
        date_creation: new Date().toISOString(),
        adresse: clientData.adresse,
        ville: clientData.ville,
        code_postal: clientData.codePostal,
        iban: clientData.iban,
        bic: clientData.bic,
        nom_banque: clientData.nomBanque,
        secteur_activite: clientData.secteurActivite,
        type_entreprise: clientData.typeEntreprise,
        besoins: clientData.besoins
      }])
      .select()
      .single();

    if (error || !data) {
      console.error("Erreur lors de la création du client:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: 'client',
      dateCreation: new Date(data.date_creation),
      adresse: data.adresse || '',
      ville: data.ville || '',
      codePostal: data.code_postal || '',
      iban: data.iban,
      bic: data.bic,
      nomBanque: data.nom_banque,
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || ''
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du client:", error);
    return null;
  }
};

/**
 * Met à jour un client existant
 */
export const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'dateCreation' | 'role'>>): Promise<boolean> => {
  try {
    // Convertir les champs clients vers le format de la base de données
    const dbData: any = {};
    if (clientData.nom !== undefined) dbData.nom = clientData.nom;
    if (clientData.prenom !== undefined) dbData.prenom = clientData.prenom;
    if (clientData.email !== undefined) dbData.email = clientData.email;
    if (clientData.telephone !== undefined) dbData.telephone = clientData.telephone;
    if (clientData.adresse !== undefined) dbData.adresse = clientData.adresse;
    if (clientData.ville !== undefined) dbData.ville = clientData.ville;
    if (clientData.codePostal !== undefined) dbData.code_postal = clientData.codePostal;
    if (clientData.iban !== undefined) dbData.iban = clientData.iban;
    if (clientData.bic !== undefined) dbData.bic = clientData.bic;
    if (clientData.nomBanque !== undefined) dbData.nom_banque = clientData.nomBanque;
    if (clientData.secteurActivite !== undefined) dbData.secteur_activite = clientData.secteurActivite;
    if (clientData.typeEntreprise !== undefined) dbData.type_entreprise = clientData.typeEntreprise;
    if (clientData.besoins !== undefined) dbData.besoins = clientData.besoins;

    const { error } = await supabase
      .from('profiles')
      .update(dbData)
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
    console.error(`Erreur inattendue lors de la suppression du client ${id}:`, error);
    return false;
  }
};

/**
 * Export du service client pour l'utiliser dans d'autres fichiers
 */
export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient
};
