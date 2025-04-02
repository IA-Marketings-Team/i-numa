
import { supabase } from "@/integrations/supabase/client";
import { AuthLog } from "@/types";

/**
 * Récupère tous les journaux d'authentification
 */
export const fetchAuthLogs = async (): Promise<AuthLog[]> => {
  try {
    const { data, error } = await supabase
      .from('auth_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des journaux d'authentification:", error);
      return [];
    }

    return data.map(log => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      ipAddress: log.ip_address
    }));
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
    const { data, error } = await supabase
      .from('auth_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des journaux pour l'utilisateur ${userId}:`, error);
      return [];
    }

    return data.map(log => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      ipAddress: log.ip_address
    }));
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
    const { data, error } = await supabase
      .from('auth_logs')
      .insert({
        user_id: log.userId,
        action: log.action,
        timestamp: log.timestamp.toISOString(),
        user_agent: log.userAgent,
        ip_address: log.ipAddress
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du journal d'authentification:", error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      action: data.action,
      timestamp: new Date(data.timestamp),
      userAgent: data.user_agent,
      ipAddress: data.ip_address
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du journal d'authentification:", error);
    return null;
  }
};
