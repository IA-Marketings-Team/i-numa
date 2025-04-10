
import { supabase } from "@/integrations/supabase/client";
import { AuthLog } from "@/types/auth";

export const createAuthLog = async (
  log: Omit<AuthLog, 'id' | 'user_id'>
): Promise<string | null> => {
  try {
    const { error, data } = await supabase.rpc('insert_auth_log', {
      p_user_id: log.userId,
      p_action: log.action,
      p_timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp,
      p_user_agent: log.userAgent,
      p_ip_address: log.ipAddress
    });

    if (error) {
      console.error("Error creating auth log:", error);
      return null;
    }

    return data?.id;
  } catch (error) {
    console.error("Unexpected error creating auth log:", error);
    return null;
  }
};

export const getUserAuthLogs = async (userId: string): Promise<AuthLog[]> => {
  try {
    const { data, error } = await supabase.rpc('get_user_auth_logs', {
      p_user_id: userId
    });

    if (error) {
      console.error("Error fetching user auth logs:", error);
      return [];
    }

    // Make sure the returned data conforms to the AuthLog interface
    return data.map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      userId: log.user_id, // Add the client-side normalized property
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      user_agent: log.user_agent,
      ipAddress: log.ip_address,
      ip_address: log.ip_address
    }));
  } catch (error) {
    console.error("Unexpected error fetching user auth logs:", error);
    return [];
  }
};

export const getRecentAuthLogs = async (limit: number = 50): Promise<AuthLog[]> => {
  try {
    const { data, error } = await supabase.rpc('get_recent_auth_logs', {
      p_limit: limit
    });

    if (error) {
      console.error("Error fetching recent auth logs:", error);
      return [];
    }

    // Make sure the returned data conforms to the AuthLog interface
    return data.map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      userId: log.user_id, // Add the client-side normalized property
      action: log.action,
      timestamp: new Date(log.timestamp),
      userAgent: log.user_agent,
      user_agent: log.user_agent,
      ipAddress: log.ip_address,
      ip_address: log.ip_address
    }));
  } catch (error) {
    console.error("Unexpected error fetching recent auth logs:", error);
    return [];
  }
};

// Function to fetch auth logs for a user
export const fetchAuthLogsByUser = async (userId: string): Promise<AuthLog[]> => {
  return getUserAuthLogs(userId);
};
