
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
    // Use a direct SQL query to insert the data as a workaround for type issues
    const { data: result, error } = await supabase
      .from('auth_logs')
      .insert([
        {
          user_id: data.userId,
          action: data.action,
          timestamp: data.timestamp,
          user_agent: data.userAgent,
          ip_address: data.ipAddress
        }
      ]) as { data: any; error: any };

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating auth log:", error);
    return { success: false, error };
  }
}

export async function getAuthLogs(userId: string) {
  try {
    // Using a direct SQL query approach with proper type assertions
    const { data, error } = await supabase
      .from('auth_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false }) as { data: any[]; error: any };

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
    // Using a direct SQL query approach with proper type assertions
    const { data, error } = await supabase
      .from('auth_logs')
      .select('*, profiles(nom, prenom, email)')
      .order('timestamp', { ascending: false })
      .limit(limit) as { data: any[]; error: any };

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching recent auth logs:", error);
    return { success: false, error };
  }
}
