
import { User } from "@/types";
import { loginEmailPassword, loginAnonymous, logout, getCurrentUser } from "@/lib/realm";

/**
 * Service d'authentification basé sur MongoDB Realm
 */
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const realmUser = await loginEmailPassword(email, password);
    
    // Récupérer les données détaillées de l'utilisateur
    const usersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
    const userData = await usersCollection.findOne({ email });
    
    if (!userData) return null;
    
    return {
      id: userData._id.toString(),
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone || '',
      role: userData.role,
      dateCreation: new Date(userData.date_creation),
      // Autres propriétés selon le type d'utilisateur
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return null;
  }
};

export const loginAsGuest = async (): Promise<User | null> => {
  try {
    await loginAnonymous();
    // Créer un utilisateur invité
    return {
      id: 'guest',
      nom: 'Invité',
      prenom: '',
      email: '',
      telephone: '',
      role: 'client', // Changé de 'guest' à 'client' pour correspondre au type UserRole
      dateCreation: new Date(),
    };
  } catch (error) {
    console.error("Erreur lors de la connexion anonyme:", error);
    return null;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const realmUser = getCurrentUser();
    if (!realmUser) {
      throw new Error("Utilisateur Realm non connecté");
    }
    
    const usersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
    const userData = await usersCollection.findOne({ _id: userId });
    
    if (!userData) return null;
    
    return {
      id: userData._id.toString(),
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone || '',
      role: userData.role,
      dateCreation: new Date(userData.date_creation),
      // Autres propriétés selon le type d'utilisateur
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return null;
  }
};

export const logoutUser = async (): Promise<boolean> => {
  try {
    await logout();
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return false;
  }
};
