
/**
 * Maps client data to database format
 * Makes sure all field names match the database schema
 */
export const mapClientToDbFormat = (client: any) => {
  // Create database object without id because it's auto-generated when inserting
  const dbObject = {
    nom: client.nom,
    prenom: client.prenom,
    email: client.email,
    telephone: client.telephone,
    role: client.role || 'client',
    date_creation: client.date_creation || new Date().toISOString(),
    adresse: client.adresse,
    ville: client.ville,
    code_postal: client.codePostal || client.code_postal,
    iban: client.iban,
    bic: client.bic,
    nom_banque: client.nomBanque || client.nom_banque,
    secteur_activite: client.secteurActivite || client.secteur_activite,
    type_entreprise: client.typeEntreprise || client.type_entreprise,
    besoins: client.besoins,
    statut_juridique: client.statutJuridique || client.statut_juridique,
    activite_detail: client.activiteDetail || client.activite_detail,
    site_web: client.siteWeb || client.site_web,
    moyens_communication: client.moyensCommunication || client.moyens_communication,
    commentaires: client.commentaires
  };

  // Update with ID if it exists (for updates)
  if (client.id) {
    return { id: client.id, ...dbObject };
  }

  return dbObject;
};
