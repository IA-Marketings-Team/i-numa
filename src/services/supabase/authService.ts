
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

/**
 * Service d'authentification personnalisé utilisant le schéma public
 */
export const customLogin = async (email: string, password: string): Promise<{ token: string; user: User | null }> => {
  try {
    console.log("Début de customLogin pour:", email);
    
    // Call the login edge function with the API functions.invoke
    const { data, error } = await supabase.functions.invoke("login", {
      body: { email, password }
    });

    if (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }

    if (!data) {
      console.error("Pas de données retournées par la fonction login");
      throw new Error("Authentication failed - no data returned");
    }

    const token = data as string;
    console.log("Token reçu:", token ? "OUI" : "NON");

    // Retrieve user information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.error("Erreur lors de la récupération des données utilisateur:", userError);
      throw userError;
    }

    if (!userData) {
      console.log("Aucun utilisateur trouvé avec cet email:", email);
      return { token, user: null };
    }

    console.log("Données utilisateur récupérées avec succès");
    
    const user: User = {
      id: userData.id,
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone,
      role: userData.role,
      dateCreation: new Date(userData.date_creation),
      adresse: userData.adresse || undefined,
      ville: userData.ville || undefined,
      codePostal: userData.code_postal || undefined,
      iban: userData.iban || undefined,
      bic: userData.bic || undefined,
      nomBanque: userData.nom_banque || undefined,
    };

    return { token, user };
  } catch (error) {
    console.error("Erreur inattendue lors de la connexion:", error);
    throw error;
  }
};

export const customRegister = async (
  nom: string,
  prenom: string, 
  email: string, 
  telephone: string, 
  role: string, 
  password: string
): Promise<User | null> => {
  try {
    console.log("Début de l'inscription pour:", email);
    
    // Call the register_user edge function with the API functions.invoke
    const { data, error } = await supabase.functions.invoke("register_user", {
      body: { 
        nom, 
        prenom, 
        email, 
        telephone, 
        role, 
        password 
      }
    });

    if (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }

    if (!data) {
      console.error("Pas de données retournées par la fonction register_user");
      throw new Error("Registration failed - no data returned");
    }

    const userId = data as string;
    console.log("ID utilisateur reçu:", userId);

    // Retrieve the created user information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error("Erreur lors de la récupération des données utilisateur:", userError);
      throw userError;
    }

    if (!userData) {
      console.log("Utilisateur créé mais impossible de récupérer ses informations");
      return null;
    }

    console.log("Données du nouvel utilisateur récupérées avec succès");
    
    const user: User = {
      id: userData.id,
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone,
      role: userData.role,
      dateCreation: new Date(userData.date_creation),
      adresse: userData.adresse || undefined,
      ville: userData.ville || undefined,
      codePostal: userData.code_postal || undefined,
      iban: userData.iban || undefined,
      bic: userData.bic || undefined,
      nomBanque: userData.nom_banque || undefined,
    };

    return user;
  } catch (error) {
    console.error("Erreur inattendue lors de l'inscription:", error);
    throw error;
  }
};
