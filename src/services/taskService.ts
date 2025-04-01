
import { Task, TaskStatus } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";
import { ObjectId } from "mongodb";

export const TaskService = {
  /**
   * Récupère toutes les tâches
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const db = await getDB();
      const tasksCollection = db.collection("tasks");
      const result = await tasksCollection.find({}).toArray();
      
      return sanitizeMongoData<Task[]>(result);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle tâche
   */
  async createTask(task: Omit<Task, "id" | "dateCreation">): Promise<Task> {
    try {
      const db = await getDB();
      const tasksCollection = db.collection("tasks");
      
      const newTask = {
        title: task.title,
        description: task.description || null,
        agentId: task.agentId,
        status: task.status,
        priority: task.priority,
        dateCreation: new Date(),
        dateEcheance: task.dateEcheance || null
      };
      
      const result = await tasksCollection.insertOne(newTask);
      
      return sanitizeMongoData<Task>({
        ...newTask,
        _id: result.insertedId
      });
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  /**
   * Met à jour une tâche existante
   */
  async updateTask(id: string, updates: Partial<Omit<Task, "id" | "dateCreation">>): Promise<Task> {
    try {
      const db = await getDB();
      const tasksCollection = db.collection("tasks");
      
      // Convertir les dates si nécessaire
      const updateData: any = { ...updates };
      
      const result = await tasksCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Task with id ${id} not found`);
      }
      
      return sanitizeMongoData<Task>(result);
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  /**
   * Supprime une tâche
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      const db = await getDB();
      const tasksCollection = db.collection("tasks");
      
      const result = await tasksCollection.deleteOne({ _id: convertToObjectId(id) });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },
  
  /**
   * Recherche des tâches par texte
   */
  async searchTasks(query: string): Promise<Task[]> {
    try {
      const db = await getDB();
      const tasksCollection = db.collection("tasks");
      
      // Créer un index de texte si ce n'est pas déjà fait
      try {
        await tasksCollection.createIndex({ title: "text", description: "text" });
      } catch (error) {
        // Ignorer les erreurs d'index existant
      }
      
      const result = await tasksCollection.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } }
        ]
      }).toArray();
      
      return sanitizeMongoData<Task[]>(result);
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  },
  
  /**
   * Récupère les tâches d'un agent spécifique
   */
  async getTasksByAgentId(agentId: string): Promise<Task[]> {
    try {
      const db = await getDB();
      const tasksCollection = db.collection("tasks");
      
      const result = await tasksCollection.find({ agentId }).toArray();
      
      return sanitizeMongoData<Task[]>(result);
    } catch (error) {
      console.error("Error fetching agent tasks:", error);
      throw error;
    }
  }
};
