
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, BarChart3, PieChart, ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PeriodSelector from "@/components/stats/PeriodSelector";
import DateRangePicker from "@/components/stats/DateRangePicker";
import DossierStatusChart from "@/components/stats/DossierStatusChart";
import RdvCompletionCard from "@/components/stats/RdvCompletionCard";
import AgentPerformanceTable from "@/components/stats/AgentPerformanceTable";
import ConversionMetricsChart from "@/components/stats/ConversionMetricsChart";
import { dynamicStatService } from "@/services/dynamicStatService";
import Papa from "papaparse";

const StatsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>("month");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

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
      
      toast({
        title: "Succès",
        description: "Les statistiques ont été chargées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
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
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // Handle custom date range
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setIsCustomDateRange(true);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsCustomDateRange(true);
  };

  // Apply date filter
  const applyDateFilter = () => {
    if (startDate && endDate) {
      fetchStats();
    }
  };

  // Reset to predefined period
  const resetDateFilter = () => {
    setIsCustomDateRange(false);
    setPeriod("month");
  };

  // Export to CSV
  const exportToCsv = () => {
    if (!stats) return;
    
    // Format data for CSV
    const dossierStatsData = stats.dossierStats.map((item: any) => ({
      Statut: item.status,
      Nombre: item.count
    }));
    
    // Prepare CSV
    const csv = Papa.unparse(dossierStatsData);
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `statistiques-dossiers-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Les statistiques ont été exportées au format CSV",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques dynamiques</h1>
          <p className="text-muted-foreground">
            Analyse en temps réel des performances et métriques
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            disabled={!stats || loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Personnalisez la période d'analyse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex-1">
              <PeriodSelector 
                value={period}
                onChange={(value) => {
                  setPeriod(value);
                  setIsCustomDateRange(false);
                }}
              />
            </div>
            
            <div className="flex-1">
              <DateRangePicker 
                startDate={startDate}
                endDate={endDate}
                onStartChange={handleStartDateChange}
                onEndChange={handleEndDateChange}
              />
            </div>
            
            {isCustomDateRange && (
              <div className="flex items-end gap-2">
                <Button onClick={applyDateFilter} disabled={!startDate || !endDate}>
                  <ListFilter className="h-4 w-4 mr-2" />
                  Appliquer
                </Button>
                <Button variant="outline" onClick={resetDateFilter}>
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement des statistiques...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="charts">
              <BarChart3 className="h-4 w-4 mr-2" />
              Graphiques
            </TabsTrigger>
            <TabsTrigger value="data">
              <PieChart className="h-4 w-4 mr-2" />
              Données détaillées
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DossierStatusChart data={stats?.dossierStats || []} />
              <RdvCompletionCard data={stats?.rdvStats} />
            </div>
            
            <ConversionMetricsChart data={stats?.conversionStats || []} />
          </TabsContent>
          
          <TabsContent value="data" className="space-y-6">
            {hasPermission(['superviseur', 'responsable']) && (
              <AgentPerformanceTable data={stats?.agentStats || []} />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Résumé des métriques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats?.rdvStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Rendez-vous</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-medium">{stats.rdvStats.total_rdv}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Honorés:</span>
                          <span className="font-medium">{stats.rdvStats.honores}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Non honorés:</span>
                          <span className="font-medium">{stats.rdvStats.non_honores}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Taux de conversion:</span>
                          <span className="font-medium">{stats.rdvStats.taux_completion.toFixed(1)}%</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {stats?.dossierStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Dossiers</h3>
                      <ul className="space-y-2">
                        {stats.dossierStats.map((item: any) => (
                          <li key={item.status} className="flex justify-between">
                            <span>{item.status}:</span>
                            <span className="font-medium">{item.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {stats?.conversionStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Taux de conversion</h3>
                      <ul className="space-y-2">
                        {stats.conversionStats.map((item: any) => (
                          <li key={item.etape} className="flex justify-between">
                            <span>{item.etape}:</span>
                            <span className="font-medium">{item.taux_conversion.toFixed(1)}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StatsPage;
