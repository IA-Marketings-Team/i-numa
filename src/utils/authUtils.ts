
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

/**
 * Fetches the user profile from Supabase
 */
export const fetchUserProfile = async (userId: string): Promise<{ user: User | null; error: Error | null }> => {
  try {
    // Use the more reliable .eq() method for filtering and add better error handling
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return { user: null, error };
    }

    if (data) {
      const userProfile: User = {
        id: data.id,
        nom: data.nom || '',
        prenom: data.prenom || '',
        email: data.email,
        telephone: data.telephone || '',
        role: data.role as UserRole,
        dateCreation: new Date(data.date_creation || Date.now()),
        adresse: data.adresse,
        ville: data.ville,
        codePostal: data.code_postal,
        iban: data.iban,
        bic: data.bic,
        nomBanque: data.nom_banque
      };

      return { user: userProfile, error: null };
    }
    
    return { user: null, error: null };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return { user: null, error: error as Error };
  }
};

/**
 * Logs in a user with email and password
 */
export const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Login error:", error);
      return { success: false, error };
    }

    return { success: !!data.user, error: null };
  } catch (error) {
    console.error("Unexpected login error:", error);
    return { success: false, error: error as Error };
  }
};

/**
 * Registers a new user with email and password
 */
export const registerWithEmail = async (
  email: string, 
  password: string, 
  userData: Partial<User>
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom: userData.nom,
          prenom: userData.prenom,
          role: userData.role || 'client'
        }
      }
    });

    if (error) {
      console.error("Register error:", error);
      return { success: false, error };
    }

    return { success: !!data.user, error: null };
  } catch (error) {
    console.error("Unexpected register error:", error);
    return { success: false, error: error as Error };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected logout error:", error);
    return { success: false, error: error as Error };
  }
};

/**
 * Checks if a user has the required role
 */
export const hasPermission = (user: User | null, requiredRoles: UserRole[]): boolean => {
  if (!user) return false;
  
  // Le responsable a accès à tout
  if (user.role === 'responsable') return true;
  
  // Vérifier si le rôle de l'utilisateur est dans la liste des rôles requis
  return requiredRoles.includes(user.role);
};
