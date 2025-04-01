
import { offres } from "../mock/offres";
import { createOffre } from "@/services/supabase/offresService";

export const migrateOffres = async () => {
  console.log("Migration des offres...");
  
  for (const offre of offres) {
    try {
      await createOffre({
        nom: offre.nom,
        description: offre.description,
        type: offre.type,
        prix: offre.prix
      });
      console.log(`Offre migrée: ${offre.nom}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de l'offre ${offre.nom}:`, error);
    }
  }
  
  console.log("Migration des offres terminée.");
};
