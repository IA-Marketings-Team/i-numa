
import { statistiques } from "../mock/statistiques";
import { createStatistique } from "@/services/supabase/statistiquesService";

export const migrateStatistiques = async () => {
  console.log("Migration des statistiques...");
  
  for (const stat of statistiques) {
    try {
      await createStatistique({
        periode: stat.periode,
        dateDebut: stat.dateDebut,
        dateFin: stat.dateFin,
        appelsEmis: stat.appelsEmis,
        appelsDecroches: stat.appelsDecroches,
        appelsTransformes: stat.appelsTransformes,
        rendezVousHonores: stat.rendezVousHonores,
        rendezVousNonHonores: stat.rendezVousNonHonores,
        dossiersValides: stat.dossiersValides,
        dossiersSigne: stat.dossiersSigne,
        chiffreAffaires: stat.chiffreAffaires
      });
      
      console.log(`Statistique migrée: ${stat.periode} du ${stat.dateDebut.toLocaleDateString()} au ${stat.dateFin.toLocaleDateString()}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de la statistique ${stat.periode} du ${stat.dateDebut.toLocaleDateString()} au ${stat.dateFin.toLocaleDateString()}:`, error);
    }
  }
  
  console.log("Migration des statistiques terminée.");
};
