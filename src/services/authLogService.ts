
import { supabase } from "@/integrations/supabase/client";
import { AuthLog } from "@/types";

/**
 * Récupère tous les journaux d'authentification
 * Note: Cette fonction suppose que la table auth_logs existe dans Supabase
 */
export const fetchAuthLogs = async (): Promise<AuthLog[]> => {
  try {
    // Pour l'instant, nous devons utiliser une requête SQL brute
    // car la table auth_logs n'est pas dans le type généré
    const { data, error } = await supabase
      .rpc('get_auth_logs', {});

    if (error) {
      console.error("Erreur lors de la récupération des journaux d'authentification:", error);
      return [];
    }

    return data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      ipAddress: log.ip_address
    })) || [];
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
    // Utiliser une requête SQL brute avec un paramètre
    const { data, error } = await supabase
      .rpc('get_user_auth_logs', { user_id_param: userId });

    if (error) {
      console.error(`Erreur lors de la récupération des journaux pour l'utilisateur ${userId}:`, error);
      return [];
    }

    return data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      ipAddress: log.ip_address
    })) || [];
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
    // Utiliser une procédure stockée pour insérer dans auth_logs
    const { data, error } = await supabase
      .rpc('create_auth_log', {
        user_id_param: log.userId,
        action_param: log.action,
        user_agent_param: log.userAgent || null,
        ip_address_param: log.ipAddress || null
      });

    if (error) {
      console.error("Erreur lors de la création du journal d'authentification:", error);
      return null;
    }

    // Retourner un objet AuthLog à partir des données de réponse
    // (en supposant que la procédure renvoie l'enregistrement créé)
    if (data && data[0]) {
      return {
        id: data[0].id,
        userId: data[0].user_id,
        action: data[0].action,
        timestamp: new Date(data[0].timestamp),
        userAgent: data[0].user_agent,
        ipAddress: data[0].ip_address
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
