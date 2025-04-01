
import { migrateTeams } from "./teamsData";
import { migrateUsers } from "./usersData";
import { migrateClients } from "./clientsData";
import { migrateAgents } from "./agentsData";
import { migrateOffres } from "./offresData";
import { migrateDossiers } from "./dossiersData";
import { migrateRendezVous } from "./rendezVousData";
import { migrateStatistiques } from "./statistiquesData";
import { migrateTasks } from "./tasksData";

export const migrateAllData = async () => {
  console.log("Début de la migration des données vers Supabase...");
  
  try {
    // Étape 1: Migrer les équipes
    await migrateTeams();
    
    // Étape 2: Migrer les utilisateurs, clients et agents
    await migrateUsers();
    await migrateClients();
    await migrateAgents();
    
    // Étape 3: Migrer les offres
    await migrateOffres();
    
    // Étape 4: Migrer les dossiers
    await migrateDossiers();
    
    // Étape 5: Migrer les rendez-vous
    await migrateRendezVous();
    
    // Étape 6: Migrer les statistiques
    await migrateStatistiques();
    
    // Étape 7: Migrer les tâches
    await migrateTasks();
    
    console.log("Migration terminée avec succès!");
    return true;
  } catch (error) {
    console.error("Une erreur est survenue pendant la migration:", error);
    return false;
  }
};
