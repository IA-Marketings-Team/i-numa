
import { 
  agents, 
  clients, 
  dossiers, 
  offres, 
  rendezVous, 
  statistiques, 
  tasks, 
  teams, 
  users 
} from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';

// In-memory database to simulate MongoDB
const inMemoryDB: Record<string, any[]> = {
  users: JSON.parse(JSON.stringify(users)),
  clients: JSON.parse(JSON.stringify(clients)),
  agents: JSON.parse(JSON.stringify(agents)),
  teams: JSON.parse(JSON.stringify(teams)),
  offres: JSON.parse(JSON.stringify(offres)),
  dossiers: JSON.parse(JSON.stringify(dossiers)),
  rendezVous: JSON.parse(JSON.stringify(rendezVous)),
  tasks: JSON.parse(JSON.stringify(tasks)),
  statistiques: JSON.parse(JSON.stringify(statistiques))
};

// Add IDs if they don't exist
Object.keys(inMemoryDB).forEach(collection => {
  inMemoryDB[collection] = inMemoryDB[collection].map(item => {
    if (!item.id) {
      return { ...item, id: uuidv4() };
    }
    return item;
  });
});

export const connectToMockDB = async () => {
  console.log("Successfully connected to Mock Database");
  return true;
};

export const getDB = async () => {
  return {
    collection: (collectionName: string) => ({
      find: (query = {}) => ({
        toArray: async () => {
          let results = [...inMemoryDB[collectionName]];
          
          // Simple query filtering
          if (Object.keys(query).length > 0) {
            results = results.filter(item => {
              for (const [key, value] of Object.entries(query)) {
                if (typeof value === 'object' && value !== null) {
                  // Handle operators like $gte, $lte
                  if ('$gte' in value && item[key] < value.$gte) return false;
                  if ('$lte' in value && item[key] > value.$lte) return false;
                  if ('$regex' in value) {
                    const regex = new RegExp(value.$regex, value.$options || '');
                    if (!regex.test(String(item[key]))) return false;
                  }
                } else if (item[key] !== value) {
                  return false;
                }
              }
              return true;
            });
          }
          
          return results;
        }
      }),
      findOne: async (query = {}) => {
        const results = inMemoryDB[collectionName].filter(item => {
          for (const [key, value] of Object.entries(query)) {
            if (key === '_id' && value) {
              return item.id === value.toString();
            } else if (item[key] !== value) {
              return false;
            }
          }
          return true;
        });
        
        return results.length > 0 ? results[0] : null;
      },
      insertOne: async (document: any) => {
        const newId = uuidv4();
        const newDoc = { ...document, id: newId };
        inMemoryDB[collectionName].push(newDoc);
        return { insertedId: newId };
      },
      insertMany: async (documents: any[]) => {
        const insertedIds = documents.map(doc => {
          const newId = uuidv4();
          const newDoc = { ...doc, id: newId };
          inMemoryDB[collectionName].push(newDoc);
          return newId;
        });
        return { insertedCount: documents.length, insertedIds };
      },
      findOneAndUpdate: async (query: any, update: any, options: any = {}) => {
        const index = inMemoryDB[collectionName].findIndex(item => {
          for (const [key, value] of Object.entries(query)) {
            if (key === '_id' && value) {
              return item.id === value.toString();
            } else if (item[key] !== value) {
              return false;
            }
          }
          return true;
        });
        
        if (index !== -1) {
          if (update.$set) {
            inMemoryDB[collectionName][index] = {
              ...inMemoryDB[collectionName][index],
              ...update.$set
            };
          }
          
          return options.returnDocument === "after" 
            ? inMemoryDB[collectionName][index] 
            : null;
        }
        
        return null;
      },
      deleteOne: async (query: any) => {
        const initialLength = inMemoryDB[collectionName].length;
        
        inMemoryDB[collectionName] = inMemoryDB[collectionName].filter(item => {
          for (const [key, value] of Object.entries(query)) {
            if (key === '_id' && value) {
              return item.id !== value.toString();
            } else if (item[key] === value) {
              return false;
            }
          }
          return true;
        });
        
        const deletedCount = initialLength - inMemoryDB[collectionName].length;
        return { deletedCount };
      },
      countDocuments: async () => {
        return inMemoryDB[collectionName].length;
      },
      createIndex: async () => {
        // Mock implementation - doesn't actually create indexes
        return "indexCreated";
      }
    })
  };
};

export const convertToObjectId = (id: string) => {
  return id;
};

export const sanitizeMongoData = <T>(data: any): T => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: item.id || item._id
    })) as any;
  }
  
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  
  const result: any = {
    ...data,
    id: data.id || data._id
  };
  
  return result as T;
};

// Function to seed data to a collection if it doesn't exist
export const seedCollection = async <T>(collectionName: string, data: T[]) => {
  console.log(`Checking ${collectionName} collection...`);
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
