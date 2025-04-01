
import { Statistique } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";

export const StatistiqueService = {
  async getAllStatistiques(): Promise<Statistique[]> {
    try {
      const db = await getDB();
      const statistiquesCollection = db.collection("statistiques");
      const result = await statistiquesCollection.find({}).toArray();
      
      return sanitizeMongoData<Statistique[]>(result);
    } catch (error) {
      console.error("Error fetching statistiques:", error);
      throw error;
    }
  },

  async getStatistiquesByPeriode(periode: Statistique["periode"]): Promise<Statistique[]> {
    try {
      const db = await getDB();
      const statistiquesCollection = db.collection("statistiques");
      const result = await statistiquesCollection.find({ periode }).toArray();
      
      return sanitizeMongoData<Statistique[]>(result);
    } catch (error) {
      console.error(`Error fetching statistiques for periode ${periode}:`, error);
      throw error;
    }
  },

  async getStatistiquesByDateRange(startDate: Date, endDate: Date): Promise<Statistique[]> {
    try {
      const db = await getDB();
      const statistiquesCollection = db.collection("statistiques");
      const result = await statistiquesCollection.find({
        dateDebut: { $gte: startDate },
        dateFin: { $lte: endDate }
      }).toArray();
      
      return sanitizeMongoData<Statistique[]>(result);
    } catch (error) {
      console.error(`Error fetching statistiques for date range:`, error);
      throw error;
    }
  },

  async createStatistique(statistique: Omit<Statistique, "id">): Promise<Statistique> {
    try {
      const db = await getDB();
      const statistiquesCollection = db.collection("statistiques");
      
      const result = await statistiquesCollection.insertOne(statistique);
      
      return sanitizeMongoData<Statistique>({
        ...statistique,
        _id: result.insertedId
      });
    } catch (error) {
      console.error("Error creating statistique:", error);
      throw error;
    }
  },

  async updateStatistique(id: string, updates: Partial<Omit<Statistique, "id">>): Promise<Statistique> {
    try {
      const db = await getDB();
      const statistiquesCollection = db.collection("statistiques");
      
      const result = await statistiquesCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Statistique with id ${id} not found`);
      }
      
      return sanitizeMongoData<Statistique>(result);
    } catch (error) {
      console.error(`Error updating statistique with id ${id}:`, error);
      throw error;
    }
  }
};
