
import { Dossier, DossierStatus } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";
import { ClientService } from "./clientService";

export const DossierService = {
  async getAllDossiers(): Promise<Dossier[]> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      const result = await dossiersCollection.find({}).toArray();
      
      // Get client details for each dossier
      const dossiers = sanitizeMongoData<Dossier[]>(result);
      
      // Now fetch the client details for each dossier
      for (const dossier of dossiers) {
        if (dossier.clientId) {
          const client = await ClientService.getClientById(dossier.clientId);
          if (client) {
            dossier.client = client;
          }
        }
      }
      
      return dossiers;
    } catch (error) {
      console.error("Error fetching dossiers:", error);
      throw error;
    }
  },

  async getDossierById(id: string): Promise<Dossier | null> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      const result = await dossiersCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      const dossier = sanitizeMongoData<Dossier>(result);
      
      // Get client details
      if (dossier.clientId) {
        const client = await ClientService.getClientById(dossier.clientId);
        if (client) {
          dossier.client = client;
        }
      }
      
      return dossier;
    } catch (error) {
      console.error(`Error fetching dossier with id ${id}:`, error);
      throw error;
    }
  },

  async getDossiersByClient(clientId: string): Promise<Dossier[]> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      const result = await dossiersCollection.find({ clientId }).toArray();
      
      const dossiers = sanitizeMongoData<Dossier[]>(result);
      
      // Get client details
      const client = await ClientService.getClientById(clientId);
      if (client) {
        for (const dossier of dossiers) {
          dossier.client = client;
        }
      }
      
      return dossiers;
    } catch (error) {
      console.error(`Error fetching dossiers for client ${clientId}:`, error);
      throw error;
    }
  },

  async getDossiersByStatus(status: DossierStatus): Promise<Dossier[]> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      const result = await dossiersCollection.find({ status }).toArray();
      
      const dossiers = sanitizeMongoData<Dossier[]>(result);
      
      // Get client details for each dossier
      for (const dossier of dossiers) {
        if (dossier.clientId) {
          const client = await ClientService.getClientById(dossier.clientId);
          if (client) {
            dossier.client = client;
          }
        }
      }
      
      return dossiers;
    } catch (error) {
      console.error(`Error fetching dossiers with status ${status}:`, error);
      throw error;
    }
  },

  async getDossiersByAgent(agentId: string, role: "agentPhonerId" | "agentVisioId"): Promise<Dossier[]> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      const result = await dossiersCollection.find({ [role]: agentId }).toArray();
      
      const dossiers = sanitizeMongoData<Dossier[]>(result);
      
      // Get client details for each dossier
      for (const dossier of dossiers) {
        if (dossier.clientId) {
          const client = await ClientService.getClientById(dossier.clientId);
          if (client) {
            dossier.client = client;
          }
        }
      }
      
      return dossiers;
    } catch (error) {
      console.error(`Error fetching dossiers for agent ${agentId}:`, error);
      throw error;
    }
  },

  async createDossier(dossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour" | "client">): Promise<Dossier> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      
      const now = new Date();
      const newDossier = {
        ...dossier,
        dateCreation: now,
        dateMiseAJour: now
      };
      
      const result = await dossiersCollection.insertOne(newDossier);
      
      const createdDossier = sanitizeMongoData<Dossier>({
        ...newDossier,
        _id: result.insertedId
      });
      
      // Get client details
      if (createdDossier.clientId) {
        const client = await ClientService.getClientById(createdDossier.clientId);
        if (client) {
          createdDossier.client = client;
        }
      }
      
      return createdDossier;
    } catch (error) {
      console.error("Error creating dossier:", error);
      throw error;
    }
  },

  async updateDossier(id: string, updates: Partial<Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour" | "client">>): Promise<Dossier> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      
      const updateData = {
        ...updates,
        dateMiseAJour: new Date()
      };
      
      const result = await dossiersCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Dossier with id ${id} not found`);
      }
      
      const updatedDossier = sanitizeMongoData<Dossier>(result);
      
      // Get client details
      if (updatedDossier.clientId) {
        const client = await ClientService.getClientById(updatedDossier.clientId);
        if (client) {
          updatedDossier.client = client;
        }
      }
      
      return updatedDossier;
    } catch (error) {
      console.error(`Error updating dossier with id ${id}:`, error);
      throw error;
    }
  },

  async deleteDossier(id: string): Promise<boolean> {
    try {
      const db = await getDB();
      const dossiersCollection = db.collection("dossiers");
      
      const result = await dossiersCollection.deleteOne({ _id: convertToObjectId(id) });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting dossier with id ${id}:`, error);
      throw error;
    }
  }
};
