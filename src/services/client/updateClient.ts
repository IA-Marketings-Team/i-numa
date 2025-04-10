
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

/**
 * Met à jour un client existant
 */
export const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'dateCreation' | 'role'>>): Promise<boolean> => {
  try {
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
    if (clientData.statutJuridique !== undefined) dbData.statut_juridique = clientData.statutJuridique;
    if (clientData.activiteDetail !== undefined) dbData.activite_detail = clientData.activiteDetail;
    if (clientData.siteWeb !== undefined) dbData.site_web = clientData.siteWeb;
    if (clientData.moyensCommunication !== undefined) dbData.moyens_communication = clientData.moyensCommunication;
    if (clientData.commentaires !== undefined) dbData.commentaires = clientData.commentaires;

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
