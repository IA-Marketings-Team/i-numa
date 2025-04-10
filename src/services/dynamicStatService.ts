
import { supabase } from "@/integrations/supabase/client";

export interface DossierStatusStats {
  status: string;
  count: number;
}

export interface RdvCompletionStats {
  total_rdv: number;
  honores: number;
  non_honores: number;
  taux_completion: number;
}

export interface AgentPerformanceStats {
  agent_id: string;
  agent_name: string;
  appels_emis: number;
  appels_transformes: number;
  rdv_honores: number;
  dossiers_valides: number;
  taux_transformation: number;
}

export interface ConversionMetricsStats {
  etape: string;
  total: number;
  taux_conversion: number;
}

// Function to calculate date range based on period
export const calculateDateRange = (period: string): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setMonth(start.getMonth() - 1); // Default to month
  }

  return { start, end };
};

export const dynamicStatService = {
  // Get dossiers by status
  getDossiersByStatus: async (startDate?: Date, endDate?: Date): Promise<DossierStatusStats[]> => {
    try {
      const { data, error } = await supabase.rpc("calculate_dossiers_by_status", {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString()
      });

      if (error) {
        console.error('Error fetching dossiers by status:', error);
        return [];
      }

      return data as DossierStatusStats[];
    } catch (error) {
      console.error('Unexpected error fetching dossiers by status:', error);
      return [];
    }
  },

  // Get RDV completion rate
  getRdvCompletionRate: async (startDate?: Date, endDate?: Date): Promise<RdvCompletionStats | null> => {
    try {
      const { data, error } = await supabase.rpc("calculate_rdv_completion_rate", {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString()
      });

      if (error) {
        console.error('Error fetching RDV completion rate:', error);
        return null;
      }

      return (data && data.length > 0) ? data[0] as RdvCompletionStats : null;
    } catch (error) {
      console.error('Unexpected error fetching RDV completion rate:', error);
      return null;
    }
  },

  // Get agent performance
  getAgentPerformance: async (startDate?: Date, endDate?: Date): Promise<AgentPerformanceStats[]> => {
    try {
      const { data, error } = await supabase.rpc("calculate_agent_performance", {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString()
      });

      if (error) {
        console.error('Error fetching agent performance:', error);
        return [];
      }

      return data as AgentPerformanceStats[];
    } catch (error) {
      console.error('Unexpected error fetching agent performance:', error);
      return [];
    }
  },

  // Get conversion metrics
  getConversionMetrics: async (startDate?: Date, endDate?: Date): Promise<ConversionMetricsStats[]> => {
    try {
      const { data, error } = await supabase.rpc("calculate_conversion_metrics", {
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString()
      });

      if (error) {
        console.error('Error fetching conversion metrics:', error);
        return [];
      }

      return data as ConversionMetricsStats[];
    } catch (error) {
      console.error('Unexpected error fetching conversion metrics:', error);
      return [];
    }
  },

  // Get stats by period
  getStatsByPeriod: async (period: string) => {
    const { start, end } = calculateDateRange(period);
    
    const [dossierStats, rdvStats, agentStats, conversionStats] = await Promise.all([
      dynamicStatService.getDossiersByStatus(start, end),
      dynamicStatService.getRdvCompletionRate(start, end),
      dynamicStatService.getAgentPerformance(start, end),
      dynamicStatService.getConversionMetrics(start, end)
    ]);

    return {
      dossierStats,
      rdvStats,
      agentStats,
      conversionStats,
      period,
      dateRange: { start, end }
    };
  }
};
