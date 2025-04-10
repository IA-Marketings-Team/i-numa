
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapProfileToClient } from "./utils/mapProfileToClient";

interface DbClientInput {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  date_creation: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  iban?: string;
  bic?: string;
  nom_banque?: string;
  secteur_activite?: string;
  type_entreprise?: string;
  besoins?: string;
  statut_juridique?: string;
  activite_detail?: string;
  site_web?: string;
  moyens_communication?: string[];
  commentaires?: string;
}

/**
 * Importe des clients depuis un fichier CSV
 */
export const importClientsFromCSV = async (clientsData: Omit<Client, 'id' | 'dateCreation' | 'role'>[]): Promise<Client[]> => {
  try {
    // Format each client data for database
    const dbClients: DbClientInput[] = clientsData.map(client => ({
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
    // Note: We're inserting as individual objects in an array, not as a bulk object
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
