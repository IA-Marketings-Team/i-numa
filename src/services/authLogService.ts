
import { supabase } from "@/integrations/supabase/client";
import { AuthLog } from "@/types";

/**
 * Récupère tous les journaux d'authentification
 * Note: Cette fonction suppose que la fonction RPC get_auth_logs existe dans Supabase
 */
export const fetchAuthLogs = async (): Promise<AuthLog[]> => {
  try {
    // Définition de l'objet paramètre comme un objet vide avec un type explicite
    const params: Record<string, never> = {};
    
    // Utilisez la fonction RPC définie dans Supabase au lieu d'accéder directement à la table
    const { data, error } = await supabase
      .rpc('get_auth_logs', params);

    if (error) {
      console.error("Erreur lors de la récupération des journaux d'authentification:", error);
      return [];
    }

    return data && Array.isArray(data) ? data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      ipAddress: log.ip_address
    })) : [];
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des journaux d'authentification:", error);
    return [];
  }
};

/**
 * Récupère les journaux d'authentification pour un utilisateur spécifique
 */
export const fetchAuthLogsByUser = async (userId: string): Promise<AuthLog[]> => {
  try {
    // Définition de l'objet paramètre avec un type explicite
    const params = { user_id_param: userId };
    
    // Utilisez la fonction RPC définie dans Supabase avec paramètre
    const { data, error } = await supabase
      .rpc('get_user_auth_logs', params);

    if (error) {
      console.error(`Erreur lors de la récupération des journaux pour l'utilisateur ${userId}:`, error);
      return [];
    }

    return data && Array.isArray(data) ? data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      ipAddress: log.ip_address
    })) : [];
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des journaux pour l'utilisateur ${userId}:`, error);
    return [];
  }
};

/**
 * Créer un nouveau journal d'authentification
 */
export const createAuthLog = async (log: Omit<AuthLog, "id">): Promise<AuthLog | null> => {
  try {
    // Définition de l'objet paramètre avec un type explicite
    const params = {
      user_id_param: log.userId,
      action_param: log.action,
      user_agent_param: log.userAgent || null,
      ip_address_param: log.ipAddress || null
    };
    
    // Utilisez la procédure stockée pour insérer dans auth_logs
    const { data, error } = await supabase
      .rpc('create_auth_log', params);

    if (error) {
      console.error("Erreur lors de la création du journal d'authentification:", error);
      return null;
    }

    // Retourner un objet AuthLog à partir des données de réponse
    if (data && Array.isArray(data) && data.length > 0) {
      const createdLog = data[0];
      return {
        id: createdLog.id,
        userId: createdLog.user_id,
        action: createdLog.action,
        timestamp: new Date(createdLog.timestamp),
        userAgent: createdLog.user_agent,
        ipAddress: createdLog.ip_address
      };
    }

    // Si la procédure ne renvoie pas l'enregistrement créé,
    // retourner l'objet original avec un id fictif (qui sera ignoré)
    return {
      id: 'temporary-id',
      userId: log.userId,
      action: log.action,
      timestamp: log.timestamp,
      userAgent: log.userAgent,
      ipAddress: log.ipAddress
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du journal d'authentification:", error);
    return null;
  }
};
