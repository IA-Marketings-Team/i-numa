
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    role: data.role,
    dateCreation: new Date(data.date_creation),
    adresse: data.adresse || undefined,
    ville: data.ville || undefined,
    codePostal: data.code_postal || undefined,
    iban: data.iban || undefined,
    bic: data.bic || undefined,
    nomBanque: data.nom_banque || undefined,
  };
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("nom");

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map((user) => ({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    role: user.role,
    dateCreation: new Date(user.date_creation),
    adresse: user.adresse || undefined,
    ville: user.ville || undefined,
    codePostal: user.code_postal || undefined,
    iban: user.iban || undefined,
    bic: user.bic || undefined,
    nomBanque: user.nom_banque || undefined,
  }));
};

export const createUser = async (user: Omit<User, "id" | "dateCreation">): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        adresse: user.adresse,
        ville: user.ville,
        code_postal: user.codePostal,
        iban: user.iban,
        bic: user.bic,
        nom_banque: user.nomBanque
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    role: data.role,
    dateCreation: new Date(data.date_creation),
    adresse: data.adresse || undefined,
    ville: data.ville || undefined,
    codePostal: data.code_postal || undefined,
    iban: data.iban || undefined,
    bic: data.bic || undefined,
    nomBanque: data.nom_banque || undefined,
  };
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const updateData: any = {};
  
  if (updates.nom) updateData.nom = updates.nom;
  if (updates.prenom) updateData.prenom = updates.prenom;
  if (updates.email) updateData.email = updates.email;
  if (updates.telephone) updateData.telephone = updates.telephone;
  if (updates.role) updateData.role = updates.role;
  if (updates.adresse !== undefined) updateData.adresse = updates.adresse;
  if (updates.ville !== undefined) updateData.ville = updates.ville;
  if (updates.codePostal !== undefined) updateData.code_postal = updates.codePostal;
  if (updates.iban !== undefined) updateData.iban = updates.iban;
  if (updates.bic !== undefined) updateData.bic = updates.bic;
  if (updates.nomBanque !== undefined) updateData.nom_banque = updates.nomBanque;

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    role: data.role,
    dateCreation: new Date(data.date_creation),
    adresse: data.adresse || undefined,
    ville: data.ville || undefined,
    codePostal: data.code_postal || undefined,
    iban: data.iban || undefined,
    bic: data.bic || undefined,
    nomBanque: data.nom_banque || undefined,
  };
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting user:", error);
    return false;
  }

  return true;
};
