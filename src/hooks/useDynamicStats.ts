
import { useState, useEffect } from "react";
import { dynamicStatService, calculateDateRange } from "@/services/dynamicStatService";
import { useToast } from "@/hooks/use-toast";

export const useDynamicStats = (initialPeriod = "month") => {
  const [period, setPeriod] = useState<string>(initialPeriod);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  // Fetch statistics based on period or date range
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      let data;
      
      if (isCustomDateRange && startDate && endDate) {
        // Fetch with custom date range
        const dossierStats = await dynamicStatService.getDossiersByStatus(startDate, endDate);
        const rdvStats = await dynamicStatService.getRdvCompletionRate(startDate, endDate);
        const agentStats = await dynamicStatService.getAgentPerformance(startDate, endDate);
        const conversionStats = await dynamicStatService.getConversionMetrics(startDate, endDate);
        
        data = {
          dossierStats,
          rdvStats,
          agentStats,
          conversionStats,
          period: 'custom',
          dateRange: { start: startDate, end: endDate }
        };
      } else {
        // Fetch with predefined period
        data = await dynamicStatService.getStatsByPeriod(period);
        setStartDate(data.dateRange.start);
        setEndDate(data.dateRange.end);
      }
      
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch and when period changes
  useEffect(() => {
    if (!isCustomDateRange) {
      fetchStats();
    }
  }, [period, isCustomDateRange]);

  // Refresh stats
  const refreshStats = () => {
    setRefreshing(true);
    fetchStats();
  };

  // Handle custom date range
  const setCustomDateRange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    setIsCustomDateRange(true);
  };

  // Apply date filter
  const applyDateFilter = () => {
    if (startDate && endDate) {
      fetchStats();
    }
  };

  // Reset to predefined period
  const resetToDefaultPeriod = (newPeriod = "month") => {
    setIsCustomDateRange(false);
    setPeriod(newPeriod);
  };

  return {
    stats,
    loading,
    refreshing,
    period,
    startDate,
    endDate,
    isCustomDateRange,
    setPeriod,
    setCustomDateRange,
    refreshStats,
    applyDateFilter,
    resetToDefaultPeriod
  };
};
