
import { Offre } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";

export const OffreService = {
  async getAllOffres(): Promise<Offre[]> {
    try {
      const db = await getDB();
      const offresCollection = db.collection("offres");
      const result = await offresCollection.find({}).toArray();
      
      return sanitizeMongoData<Offre[]>(result);
    } catch (error) {
      console.error("Error fetching offres:", error);
      throw error;
    }
  },

  async getOffreById(id: string): Promise<Offre | null> {
    try {
      const db = await getDB();
      const offresCollection = db.collection("offres");
      const result = await offresCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      return sanitizeMongoData<Offre>(result);
    } catch (error) {
      console.error(`Error fetching offre with id ${id}:`, error);
      throw error;
    }
  },

  async getOffresByType(type: Offre["type"]): Promise<Offre[]> {
    try {
      const db = await getDB();
      const offresCollection = db.collection("offres");
      const result = await offresCollection.find({ type }).toArray();
      
      return sanitizeMongoData<Offre[]>(result);
    } catch (error) {
      console.error(`Error fetching offres by type ${type}:`, error);
      throw error;
    }
  },

  async createOffre(offre: Omit<Offre, "id">): Promise<Offre> {
    try {
      const db = await getDB();
      const offresCollection = db.collection("offres");
      
      const result = await offresCollection.insertOne(offre);
      
      return sanitizeMongoData<Offre>({
        ...offre,
        _id: result.insertedId
      });
    } catch (error) {
      console.error("Error creating offre:", error);
      throw error;
    }
  },

  async updateOffre(id: string, updates: Partial<Omit<Offre, "id">>): Promise<Offre> {
    try {
      const db = await getDB();
      const offresCollection = db.collection("offres");
      
      const result = await offresCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Offre with id ${id} not found`);
      }
      
      return sanitizeMongoData<Offre>(result);
    } catch (error) {
      console.error(`Error updating offre with id ${id}:`, error);
      throw error;
    }
  },

  async deleteOffre(id: string): Promise<boolean> {
    try {
      const db = await getDB();
      const offresCollection = db.collection("offres");
      
      const result = await offresCollection.deleteOne({ _id: convertToObjectId(id) });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting offre with id ${id}:`, error);
      throw error;
    }
  }
};
