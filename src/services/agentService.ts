
import { Agent } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";

export const AgentService = {
  async getAllAgents(): Promise<Agent[]> {
    try {
      const db = await getDB();
      const agentsCollection = db.collection("agents");
      const result = await agentsCollection.find({}).toArray();
      
      return sanitizeMongoData<Agent[]>(result);
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
  },

  async getAgentById(id: string): Promise<Agent | null> {
    try {
      const db = await getDB();
      const agentsCollection = db.collection("agents");
      const result = await agentsCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      return sanitizeMongoData<Agent>(result);
    } catch (error) {
      console.error(`Error fetching agent with id ${id}:`, error);
      throw error;
    }
  },

  async getAgentsByTeam(teamId: string): Promise<Agent[]> {
    try {
      const db = await getDB();
      const agentsCollection = db.collection("agents");
      const result = await agentsCollection.find({ equipeId: teamId }).toArray();
      
      return sanitizeMongoData<Agent[]>(result);
    } catch (error) {
      console.error(`Error fetching agents by team id ${teamId}:`, error);
      throw error;
    }
  },

  async getAgentsByRole(role: string): Promise<Agent[]> {
    try {
      const db = await getDB();
      const agentsCollection = db.collection("agents");
      const result = await agentsCollection.find({ role }).toArray();
      
      return sanitizeMongoData<Agent[]>(result);
    } catch (error) {
      console.error(`Error fetching agents by role ${role}:`, error);
      throw error;
    }
  },

  async updateAgentStats(id: string, stats: Partial<Agent["statistiques"]>): Promise<Agent> {
    try {
      const db = await getDB();
      const agentsCollection = db.collection("agents");
      
      const agent = await agentsCollection.findOne({ _id: convertToObjectId(id) });
      if (!agent) {
        throw new Error(`Agent with id ${id} not found`);
      }
      
      const updatedStats = {
        ...agent.statistiques,
        ...stats
      };
      
      const result = await agentsCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: { statistiques: updatedStats } },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Failed to update agent stats for id ${id}`);
      }
      
      return sanitizeMongoData<Agent>(result);
    } catch (error) {
      console.error(`Error updating agent stats for id ${id}:`, error);
      throw error;
    }
  }
};
