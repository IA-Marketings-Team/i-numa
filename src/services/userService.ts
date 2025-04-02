
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";

/**
 * Récupère tous les utilisateurs (qui ne sont pas des clients)
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'client');

    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return [];
    }

    return data.map(user => ({
      id: user.id,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      role: user.role as UserRole,
      dateCreation: new Date(user.date_creation),
      adresse: user.adresse || '',
      ville: user.ville || '',
      codePostal: user.code_postal || '',
      iban: user.iban,
      bic: user.bic,
      nomBanque: user.nom_banque
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des utilisateurs:", error);
    return [];
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const fetchUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: data.role as UserRole,
      dateCreation: new Date(data.date_creation),
      adresse: data.adresse || '',
      ville: data.ville || '',
      codePostal: data.code_postal || '',
      iban: data.iban,
      bic: data.bic,
      nomBanque: data.nom_banque
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'utilisateur ${id}:`, error);
    return null;
  }
};

/**
 * Met à jour un utilisateur existant
 */
export const updateUser = async (id: string, userData: Partial<Omit<User, 'id' | 'dateCreation' | 'role'>>): Promise<boolean> => {
  try {
    // Convertir les champs utilisateur vers le format de la base de données
    const dbData: any = {};
    if (userData.nom !== undefined) dbData.nom = userData.nom;
    if (userData.prenom !== undefined) dbData.prenom = userData.prenom;
    if (userData.email !== undefined) dbData.email = userData.email;
    if (userData.telephone !== undefined) dbData.telephone = userData.telephone;
    if (userData.adresse !== undefined) dbData.adresse = userData.adresse;
    if (userData.ville !== undefined) dbData.ville = userData.ville;
    if (userData.codePostal !== undefined) dbData.code_postal = userData.codePostal;
    if (userData.iban !== undefined) dbData.iban = userData.iban;
    if (userData.bic !== undefined) dbData.bic = userData.bic;
    if (userData.nomBanque !== undefined) dbData.nom_banque = userData.nomBanque;

    const { error } = await supabase
      .from('profiles')
      .update(dbData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de l'utilisateur ${id}:`, error);
    return false;
  }
};
