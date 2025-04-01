
import { users } from "../mock/users";
import { createUser } from "@/services/supabase/usersService";

export const migrateUsers = async () => {
  console.log("Migration des utilisateurs...");
  
  for (const user of users) {
    try {
      await createUser({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        adresse: user.adresse,
        ville: user.ville,
        codePostal: user.codePostal,
        iban: user.iban,
        bic: user.bic,
        nomBanque: user.nomBanque
      });
      console.log(`Utilisateur migré: ${user.prenom} ${user.nom}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de l'utilisateur ${user.prenom} ${user.nom}:`, error);
    }
  }
  
  console.log("Migration des utilisateurs terminée.");
};
