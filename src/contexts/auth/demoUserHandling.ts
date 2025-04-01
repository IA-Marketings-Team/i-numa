
import { User, UserRole } from "@/types";
import { createUser } from "@/services/supabase/usersService";
import { supabase } from "@/integrations/supabase/client";

export const DEMO_ACCOUNTS = [
  'jean.dupont@example.com', 
  'thomas.leroy@example.com', 
  'claire.moreau@example.com', 
  'ahmed.tayin@example.com', 
  'marie.andy@example.com'
];

export const isDemoAccount = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return DEMO_ACCOUNTS.includes(email.toLowerCase().trim());
};

export const getDemoUserRole = (email: string | null | undefined): UserRole => {
  if (!email) return 'client';
  
  const lowerEmail = email.toLowerCase().trim();
  
  if (lowerEmail === 'thomas.leroy@example.com') return 'agent_phoner';
  if (lowerEmail === 'claire.moreau@example.com') return 'agent_visio';
  if (lowerEmail === 'ahmed.tayin@example.com') return 'superviseur';
  if (lowerEmail === 'marie.andy@example.com') return 'responsable';
  
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
    const parts = email.split('@')[0].split('.') || [];
    const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
    const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
    
    // Vérifier d'abord si le profil existe déjà
    const { data: existingUsers, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .limit(1);
      
    if (searchError) {
      console.error("Erreur lors de la recherche d'utilisateur démo:", searchError);
      return null;
    }
      
    if (existingUsers && existingUsers.length > 0) {
      console.log("Profil utilisateur démo existant trouvé pour", email);
      
      // Mettre à jour l'auth_id si nécessaire
      if (existingUsers[0].auth_id !== authId) {
        console.log("Mise à jour de l'auth_id pour", email);
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
    
    // Si le profil n'existe pas encore, le créer
    console.log("Création d'un nouveau profil utilisateur démo pour", email);
    const newUser = await createUser({
      nom: lastName,
      prenom: firstName,
      email: email.toLowerCase().trim(),
      telephone: "0123456789", // Valeur par défaut pour les démos
      role,
      auth_id: authId
    });
    
    if (newUser) {
      console.log("Profil utilisateur de démo créé avec succès pour", email);
      
      // Si c'est un client, créer aussi l'entrée dans la table clients
      if (role === 'client') {
        try {
          await supabase.from('clients').insert({
            id: newUser.id,
            secteur_activite: 'Commerce',
            type_entreprise: 'PME',
            besoins: 'Visibilité en ligne'
          });
          console.log("Entrée client créée pour", email);
        } catch (error) {
          console.error("Erreur lors de la création de l'entrée client:", error);
        }
      }
      
      // Si c'est un agent, créer aussi l'entrée dans la table agents
      if (role === 'agent_phoner' || role === 'agent_visio') {
        try {
          await supabase.from('agents').insert({
            id: newUser.id
          });
          console.log("Entrée agent créée pour", email);
        } catch (error) {
          console.error("Erreur lors de la création de l'entrée agent:", error);
        }
      }
      
      return newUser;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la création du profil utilisateur de démo:", error);
    return null;
  }
};
