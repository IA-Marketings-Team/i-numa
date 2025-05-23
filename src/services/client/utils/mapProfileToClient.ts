
import { Client } from "@/types";

/**
 * Maps database profile data to the Client interface
 */
export const mapProfileToClient = (profile: any): Client => {
  return {
    id: profile.id,
    nom: profile.nom || '',
    prenom: profile.prenom || '',
    email: profile.email || '',
    telephone: profile.telephone || '',
    role: profile.role || 'client',
    dateCreation: profile.date_creation ? new Date(profile.date_creation) : new Date(),
    adresse: profile.adresse || '',
    ville: profile.ville || '',
    codePostal: profile.code_postal || '',
    iban: profile.iban || '',
    bic: profile.bic || '',
    nomBanque: profile.nom_banque || '',
    secteurActivite: profile.secteur_activite || '',
    typeEntreprise: profile.type_entreprise || '',
    besoins: profile.besoins || '',
    statutJuridique: profile.statut_juridique || '',
    activiteDetail: profile.activite_detail || '',
    siteWeb: profile.site_web || '',
    moyensCommunication: profile.moyens_communication || [],
    commentaires: profile.commentaires || ''
  };
};
