
import { teams } from "../mock/teams";
import { createTeam } from "@/services/supabase/teamsService";

export const migrateTeams = async () => {
  console.log("Migration des équipes...");
  
  for (const team of teams) {
    try {
      await createTeam({
        nom: team.nom,
        fonction: team.fonction,
        description: team.description
      });
      console.log(`Équipe migrée: ${team.nom}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de l'équipe ${team.nom}:`, error);
    }
  }
  
  console.log("Migration des équipes terminée.");
};
