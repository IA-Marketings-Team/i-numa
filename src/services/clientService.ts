
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
 * Export du service client pour l'utiliser dans d'autres fichiers
 */
export const clientService = {
  fetchClients,
  fetchClientById
};
