
import { connectToMongoDB, seedCollection } from "./mongoDBService";
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

export const initializeDatabase = async () => {
  try {
    console.log("Initializing database...");
    
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Seed collections with mock data
    await seedCollection("users", users);
    await seedCollection("clients", clients);
    await seedCollection("agents", agents);
    await seedCollection("teams", teams);
    await seedCollection("offres", offres);
    await seedCollection("dossiers", dossiers);
    await seedCollection("rendezVous", rendezVous);
    await seedCollection("tasks", tasks);
    await seedCollection("statistiques", statistiques);
    
    console.log("Database initialization complete");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};
