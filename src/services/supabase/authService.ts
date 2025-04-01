
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

/**
 * Service d'authentification personnalisé utilisant le schéma public
 */
export const customLogin = async (email: string, password: string): Promise<{ token: string; user: User | null }> => {
  try {
    // Call the login edge function with the API functions.invoke
    const { data, error } = await supabase.functions.invoke<string>("login", {
      body: { email, password }
    });

    if (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }

    const token = data;

    // Retrieve user information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      console.error("Erreur lors de la récupération des données utilisateur:", userError);
      throw userError;
    }

    if (!userData) {
      return { token, user: null };
    }

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
    // Call the register_user edge function with the API functions.invoke
    const { data, error } = await supabase.functions.invoke<string>("register_user", {
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

    const userId = data;

    // Retrieve the created user information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error("Erreur lors de la récupération des données utilisateur:", userError);
      throw userError;
    }

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
