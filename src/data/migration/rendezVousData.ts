
import { rendezVous } from "../mock/rendezVous";
import { createRendezVous } from "@/services/supabase/rendezVousService";
import { getAllDossiers } from "@/services/supabase/dossiersService";

export const migrateRendezVous = async () => {
  console.log("Migration des rendez-vous...");
  
  // Récupérer les dossiers depuis Supabase
  const dossiers = await getAllDossiers();
  
  if (dossiers.length === 0) {
    console.error("Impossible de migrer les rendez-vous : dossiers manquants");
    return;
  }
  
  for (const rdv of rendezVous) {
    try {
      // Trouver le dossier correspondant dans Supabase
      const dossier = dossiers.find(d => d.client.email === rdv.dossier.client.email);
      if (!dossier) {
        console.error(`Dossier non trouvé pour le rendez-vous: ${rdv.id}`);
        continue;
      }
      
      await createRendezVous({
        dossierId: dossier.id,
        date: rdv.date,
        honore: rdv.honore,
        notes: rdv.notes,
        meetingLink: rdv.meetingLink,
        location: rdv.location
      });
      
      console.log(`Rendez-vous migré: ${rdv.id}`);
    } catch (error) {
      console.error(`Erreur lors de la migration du rendez-vous ${rdv.id}:`, error);
    }
  }
  
  console.log("Migration des rendez-vous terminée.");
};
