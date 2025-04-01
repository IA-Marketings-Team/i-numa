
import { tasks } from "../mock/tasks";
import { createTask } from "@/services/supabase/tasksService";
import { getAllAgents } from "@/services/supabase/agentsService";

export const migrateTasks = async () => {
  console.log("Migration des tâches...");
  
  // Récupérer les agents depuis Supabase
  const agents = await getAllAgents();
  
  if (agents.length === 0) {
    console.error("Impossible de migrer les tâches : agents manquants");
    return;
  }
  
  for (const task of tasks) {
    try {
      // Trouver l'agent correspondant dans Supabase
      const agent = agents.find(a => a.email === agents.find(a => a.id === task.agentId)?.email);
      if (!agent) {
        console.error(`Agent non trouvé pour la tâche: ${task.id}`);
        continue;
      }
      
      await createTask({
        title: task.title,
        description: task.description,
        agentId: agent.id,
        status: task.status,
        dateEcheance: task.dateEcheance,
        priority: task.priority
      });
      
      console.log(`Tâche migrée: ${task.title}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de la tâche ${task.title}:`, error);
    }
  }
  
  console.log("Migration des tâches terminée.");
};
