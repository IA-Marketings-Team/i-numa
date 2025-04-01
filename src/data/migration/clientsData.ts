
import { clients } from "../mock/clients";
import { createClient } from "@/services/supabase/clientsService";

export const migrateClients = async () => {
  console.log("Migration des clients...");
  
  for (const client of clients) {
    try {
      await createClient({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        role: client.role,
        adresse: client.adresse,
        ville: client.ville,
        codePostal: client.codePostal,
        iban: client.iban,
        bic: client.bic,
        nomBanque: client.nomBanque,
        secteurActivite: client.secteurActivite,
        typeEntreprise: client.typeEntreprise,
        besoins: client.besoins
      });
      console.log(`Client migré: ${client.prenom} ${client.nom}`);
    } catch (error) {
      console.error(`Erreur lors de la migration du client ${client.prenom} ${client.nom}:`, error);
    }
  }
  
  console.log("Migration des clients terminée.");
};
