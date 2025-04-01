
import { Team } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";

export const TeamService = {
  async getAllTeams(): Promise<Team[]> {
    try {
      const db = await getDB();
      const teamsCollection = db.collection("teams");
      const result = await teamsCollection.find({}).toArray();
      
      return sanitizeMongoData<Team[]>(result);
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  },

  async getTeamById(id: string): Promise<Team | null> {
    try {
      const db = await getDB();
      const teamsCollection = db.collection("teams");
      const result = await teamsCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      return sanitizeMongoData<Team>(result);
    } catch (error) {
      console.error(`Error fetching team with id ${id}:`, error);
      throw error;
    }
  },

  async createTeam(team: Omit<Team, "id" | "dateCreation">): Promise<Team> {
    try {
      const db = await getDB();
      const teamsCollection = db.collection("teams");
      
      const newTeam = {
        ...team,
        dateCreation: new Date()
      };
      
      const result = await teamsCollection.insertOne(newTeam);
      
      return sanitizeMongoData<Team>({
        ...newTeam,
        _id: result.insertedId
      });
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  },

  async updateTeam(id: string, updates: Partial<Omit<Team, "id" | "dateCreation">>): Promise<Team> {
    try {
      const db = await getDB();
      const teamsCollection = db.collection("teams");
      
      const result = await teamsCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Team with id ${id} not found`);
      }
      
      return sanitizeMongoData<Team>(result);
    } catch (error) {
      console.error(`Error updating team with id ${id}:`, error);
      throw error;
    }
  },

  async deleteTeam(id: string): Promise<boolean> {
    try {
      const db = await getDB();
      const teamsCollection = db.collection("teams");
      
      const result = await teamsCollection.deleteOne({ _id: convertToObjectId(id) });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting team with id ${id}:`, error);
      throw error;
    }
  }
};
