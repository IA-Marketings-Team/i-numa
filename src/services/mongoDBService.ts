
import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://nashtefison:5860Nasshu@i-numa.x1dbphj.mongodb.net/?retryWrites=true&w=majority&appName=i-numa";
const client = new MongoClient(uri);

let connected = false;

export const connectToMongoDB = async () => {
  if (connected) return client;
  
  try {
    await client.connect();
    connected = true;
    console.log("Successfully connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const getDB = async () => {
  await connectToMongoDB();
  return client.db("i-numa");
};

export const convertToObjectId = (id: string) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error("Invalid ObjectId:", id);
    throw new Error("Invalid ID format");
  }
};

export const sanitizeMongoData = <T>(data: any): T => {
  if (Array.isArray(data)) {
    return data.map(item => sanitizeMongoData(item)) as any;
  }
  
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  
  const result: any = {};
  
  for (const key in data) {
    if (key === '_id') {
      result.id = data._id.toString();
    } else if (data[key] instanceof ObjectId) {
      result[key] = data[key].toString();
    } else if (data[key] instanceof Date) {
      result[key] = data[key];
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      result[key] = sanitizeMongoData(data[key]);
    } else {
      result[key] = data[key];
    }
  }
  
  return result as T;
};

// Function to seed data to a collection if it doesn't exist
export const seedCollection = async <T>(collectionName: string, data: T[]) => {
  const db = await getDB();
  const collection = db.collection(collectionName);
  
  // Check if collection is empty
  const count = await collection.countDocuments();
  if (count === 0) {
    console.log(`Seeding ${collectionName} collection...`);
    await collection.insertMany(data);
    console.log(`${collectionName} collection seeded successfully.`);
  } else {
    console.log(`${collectionName} collection already has data.`);
  }
};
