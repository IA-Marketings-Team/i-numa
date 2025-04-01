
import { 
  connectToMockDB, 
  getDB, 
  convertToObjectId, 
  sanitizeMongoData, 
  seedCollection 
} from './mockDBService';

let connected = false;

export const connectToMongoDB = async () => {
  if (connected) return true;
  
  try {
    await connectToMockDB();
    connected = true;
    console.log("Successfully connected to MongoDB (Mock)");
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export { getDB, convertToObjectId, sanitizeMongoData, seedCollection };
