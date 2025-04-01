
import { User, UserRole } from "@/types";
import { createUser } from "@/services/supabase/usersService";

export const DEMO_ACCOUNTS = [
  'jean.dupont@example.com', 
  'thomas.leroy@example.com', 
  'claire.moreau@example.com', 
  'ahmed.tayin@example.com', 
  'marie.andy@example.com'
];

export const isDemoAccount = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return DEMO_ACCOUNTS.includes(email);
};

export const getDemoUserRole = (email: string | null | undefined): UserRole => {
  if (!email) return 'client';
  
  if (email === 'thomas.leroy@example.com') return 'agent_phoner';
  if (email === 'claire.moreau@example.com') return 'agent_visio';
  if (email === 'ahmed.tayin@example.com') return 'superviseur';
  if (email === 'marie.andy@example.com') return 'responsable';
  
  return 'client';
};

export const createDemoUserProfile = async (
  authId: string,
  email: string
): Promise<User | null> => {
  try {
    // Déterminer le rôle en fonction de l'email
    const role = getDemoUserRole(email);
    
    // Extraire nom/prénom depuis l'email
    const names = email.split('@')[0].split('.') || [];
    const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
    const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
    
    const newUser = await createUser({
      nom: lastName,
      prenom: firstName,
      email: email,
      telephone: "0123456789", // Valeur par défaut pour les démos
      role,
      auth_id: authId
    });
    
    if (newUser) {
      console.log("Profil utilisateur de démo créé avec succès");
      return newUser;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la création du profil utilisateur de démo:", error);
    return null;
  }
};
