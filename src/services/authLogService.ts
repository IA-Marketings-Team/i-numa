
import { supabase } from "@/integrations/supabase/client";
import { AuthLog } from "@/types";

interface CreateAuthLogData {
  userId: string;
  action: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

export async function createAuthLog(data: CreateAuthLogData) {
  try {
    // Use a direct SQL query for insert
    const { data: result, error } = await supabase.rpc('insert_auth_log', {
      p_user_id: data.userId,
      p_action: data.action,
      p_timestamp: data.timestamp.toISOString(),
      p_user_agent: data.userAgent || null,
      p_ip_address: data.ipAddress || null
    }) as { data: any; error: any };

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating auth log:", error);
    return { success: false, error };
  }
}

export async function getAuthLogs(userId: string) {
  try {
    // Using a direct SQL query with RPC
    const { data, error } = await supabase.rpc('get_user_auth_logs', {
      p_user_id: userId
    }) as { data: any[]; error: any };

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching auth logs:", error);
    return { success: false, error };
  }
}

// Rename to match the function name used in the AuthLogsTable component
export const fetchAuthLogsByUser = getAuthLogs;

export async function getRecentAuthLogs(limit = 50) {
  try {
    // Using a direct SQL query with RPC
    const { data, error } = await supabase.rpc('get_recent_auth_logs', {
      p_limit: limit
    }) as { data: any[]; error: any };

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching recent auth logs:", error);
    return { success: false, error };
  }
}
