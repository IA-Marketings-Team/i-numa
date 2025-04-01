
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
    console.log("Création du profil utilisateur démo pour:", email);
    
    // Déterminer le rôle en fonction de l'email
    const role = getDemoUserRole(email);
    
    // Extraire nom/prénom depuis l'email
    const names = email.split('@')[0].split('.') || [];
    const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
    const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
    
    // Vérifier d'abord si le profil existe déjà
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);
      
    if (existingUsers && existingUsers.length > 0) {
      console.log("Profil utilisateur démo existant trouvé, mise à jour de l'auth_id");
      
      // Mettre à jour l'auth_id si nécessaire
      if (existingUsers[0].auth_id !== authId) {
        await supabase
          .from('users')
          .update({ auth_id: authId })
          .eq('id', existingUsers[0].id);
      }
      
      return {
        id: existingUsers[0].id,
        nom: existingUsers[0].nom,
        prenom: existingUsers[0].prenom,
        email: existingUsers[0].email,
        telephone: existingUsers[0].telephone,
        role: existingUsers[0].role,
        dateCreation: new Date(existingUsers[0].date_creation),
        adresse: existingUsers[0].adresse || undefined,
        ville: existingUsers[0].ville || undefined,
        codePostal: existingUsers[0].code_postal || undefined,
        iban: existingUsers[0].iban || undefined,
        bic: existingUsers[0].bic || undefined,
        nomBanque: existingUsers[0].nom_banque || undefined,
      };
    }
    
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

import { supabase } from "@/integrations/supabase/client";
