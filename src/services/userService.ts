
import { User } from "@/types";
import { getDB, sanitizeMongoData, convertToObjectId } from "./mongoDBService";

export const UserService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const db = await getDB();
      const usersCollection = db.collection("users");
      const result = await usersCollection.find({}).toArray();
      
      return sanitizeMongoData<User[]>(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const db = await getDB();
      const usersCollection = db.collection("users");
      const result = await usersCollection.findOne({ _id: convertToObjectId(id) });
      
      if (!result) {
        return null;
      }
      
      return sanitizeMongoData<User>(result);
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = await getDB();
      const usersCollection = db.collection("users");
      const result = await usersCollection.findOne({ email });
      
      if (!result) {
        return null;
      }
      
      return sanitizeMongoData<User>(result);
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw error;
    }
  }
};
