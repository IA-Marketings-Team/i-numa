
import { RendezVous } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";
import { DossierService } from "./dossierService";

export const RendezVousService = {
  async getAllRendezVous(): Promise<RendezVous[]> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      const result = await rendezVousCollection.find({}).toArray();
      
      const rendezVousList = sanitizeMongoData<RendezVous[]>(result);
      
      // Get dossier details for each rendez-vous
      for (const rdv of rendezVousList) {
        if (rdv.dossierId) {
          const dossier = await DossierService.getDossierById(rdv.dossierId);
          if (dossier) {
            rdv.dossier = dossier;
          }
        }
      }
      
      return rendezVousList;
    } catch (error) {
      console.error("Error fetching rendez-vous:", error);
      throw error;
    }
  },

  async getRendezVousById(id: string): Promise<RendezVous | null> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      const result = await rendezVousCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      const rendezVous = sanitizeMongoData<RendezVous>(result);
      
      // Get dossier details
      if (rendezVous.dossierId) {
        const dossier = await DossierService.getDossierById(rendezVous.dossierId);
        if (dossier) {
          rendezVous.dossier = dossier;
        }
      }
      
      return rendezVous;
    } catch (error) {
      console.error(`Error fetching rendez-vous with id ${id}:`, error);
      throw error;
    }
  },

  async getRendezVousByDossier(dossierId: string): Promise<RendezVous[]> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      const result = await rendezVousCollection.find({ dossierId }).toArray();
      
      const rendezVousList = sanitizeMongoData<RendezVous[]>(result);
      
      // Get dossier details
      const dossier = await DossierService.getDossierById(dossierId);
      if (dossier) {
        for (const rdv of rendezVousList) {
          rdv.dossier = dossier;
        }
      }
      
      return rendezVousList;
    } catch (error) {
      console.error(`Error fetching rendez-vous for dossier ${dossierId}:`, error);
      throw error;
    }
  },

  async getUpcomingRendezVous(): Promise<RendezVous[]> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      const result = await rendezVousCollection.find({ 
        date: { $gte: new Date() } 
      }).sort({ date: 1 }).toArray();
      
      const rendezVousList = sanitizeMongoData<RendezVous[]>(result);
      
      // Get dossier details for each rendez-vous
      for (const rdv of rendezVousList) {
        if (rdv.dossierId) {
          const dossier = await DossierService.getDossierById(rdv.dossierId);
          if (dossier) {
            rdv.dossier = dossier;
          }
        }
      }
      
      return rendezVousList;
    } catch (error) {
      console.error("Error fetching upcoming rendez-vous:", error);
      throw error;
    }
  },

  async createRendezVous(rendezVous: Omit<RendezVous, "id" | "dossier">): Promise<RendezVous> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      
      const result = await rendezVousCollection.insertOne(rendezVous);
      
      const createdRendezVous = sanitizeMongoData<RendezVous>({
        ...rendezVous,
        _id: result.insertedId
      });
      
      // Get dossier details
      if (createdRendezVous.dossierId) {
        const dossier = await DossierService.getDossierById(createdRendezVous.dossierId);
        if (dossier) {
          createdRendezVous.dossier = dossier;
        }
      }
      
      return createdRendezVous;
    } catch (error) {
      console.error("Error creating rendez-vous:", error);
      throw error;
    }
  },

  async updateRendezVous(id: string, updates: Partial<Omit<RendezVous, "id" | "dossier">>): Promise<RendezVous> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      
      const result = await rendezVousCollection.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );
      
      if (!result) {
        throw new Error(`Rendez-vous with id ${id} not found`);
      }
      
      const updatedRendezVous = sanitizeMongoData<RendezVous>(result);
      
      // Get dossier details
      if (updatedRendezVous.dossierId) {
        const dossier = await DossierService.getDossierById(updatedRendezVous.dossierId);
        if (dossier) {
          updatedRendezVous.dossier = dossier;
        }
      }
      
      return updatedRendezVous;
    } catch (error) {
      console.error(`Error updating rendez-vous with id ${id}:`, error);
      throw error;
    }
  },

  async deleteRendezVous(id: string): Promise<boolean> {
    try {
      const db = await getDB();
      const rendezVousCollection = db.collection("rendezVous");
      
      const result = await rendezVousCollection.deleteOne({ _id: convertToObjectId(id) });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting rendez-vous with id ${id}:`, error);
      throw error;
    }
  }
};
