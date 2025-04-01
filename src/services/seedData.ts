
import { 
  agents, 
  clients, 
  dossiers, 
  offres, 
  rendezVous, 
  statistiques, 
  tasks, 
  teams, 
  users 
} from "@/data/mockData";
import { seedCollection } from "./mongoDBService";

export const seedAllData = async () => {
  try {
    // Seed all collections
    await seedCollection("users", users);
    await seedCollection("clients", clients);
    await seedCollection("agents", agents);
    await seedCollection("teams", teams);
    await seedCollection("offres", offres);
    await seedCollection("dossiers", dossiers);
    await seedCollection("rendezVous", rendezVous);
    await seedCollection("tasks", tasks);
    await seedCollection("statistiques", statistiques);
    
    console.log("All collections seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};
