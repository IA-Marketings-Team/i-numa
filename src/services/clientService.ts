
import { Client } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";

export const ClientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const db = await getDB();
      const clientsCollection = db.collection("clients");
      const result = await clientsCollection.find({}).toArray();
      
      return sanitizeMongoData<Client[]>(result);
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const db = await getDB();
      const clientsCollection = db.collection("clients");
      const result = await clientsCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      return sanitizeMongoData<Client>(result);
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw error;
    }
  },

  async createClient(client: Omit<Client, "id" | "dateCreation">): Promise<Client> {
    try {
      const db = await getDB();
      const clientsCollection = db.collection("clients");
      
      const newClient = {
        ...client,
        dateCreation: new Date()
      };
      
      const result = await clientsCollection.insertOne(newClient);
      
      return sanitizeMongoData<Client>({
        ...newClient,
        _id: result.insertedId
      });
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  },

  async updateClient(id: string, updates: Partial<Omit<Client, "id" | "dateCreation">>): Promise<Client> {
    try {
      const db = await getDB();
      const clientsCollection = db.collection("clients");
      
      const result = await clientsCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Client with id ${id} not found`);
      }
      
      return sanitizeMongoData<Client>(result);
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<boolean> {
    try {
      const db = await getDB();
      const clientsCollection = db.collection("clients");
      
      const result = await clientsCollection.deleteOne({ _id: convertToObjectId(id) });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw error;
    }
  },

  async searchClients(query: string): Promise<Client[]> {
    try {
      const db = await getDB();
      const clientsCollection = db.collection("clients");
      
      // Create text index if it doesn't exist
      try {
        await clientsCollection.createIndex({ 
          nom: "text", 
          prenom: "text", 
          email: "text",
          telephone: "text",
          adresse: "text",
          secteurActivite: "text"
        });
      } catch (error) {
        // Ignore if index already exists
      }
      
      const result = await clientsCollection.find({
        $or: [
          { nom: { $regex: query, $options: "i" } },
          { prenom: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { telephone: { $regex: query, $options: "i" } },
          { secteurActivite: { $regex: query, $options: "i" } }
        ]
      }).toArray();
      
      return sanitizeMongoData<Client[]>(result);
    } catch (error) {
      console.error(`Error searching clients with query ${query}:`, error);
      throw error;
    }
  }
};
