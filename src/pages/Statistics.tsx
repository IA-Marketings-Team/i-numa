
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Statistique } from "@/types";
import { fetchStatistiques, fetchStatistiquesByPeriode } from "@/services/statistiqueService";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import OverviewSection from "@/components/dashboard/OverviewSection";
import StatistiqueTable from "@/components/stats/StatistiqueTable";
import StatistiqueCharts from "@/components/stats/StatistiqueCharts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, BarChart3, Table } from "lucide-react";

const Statistics = () => {
  const [statistiquesMensuelles, setStatistiquesMensuelles] = useState<Statistique[]>([]);
  const [statistiquesHebdomadaires, setStatistiquesHebdomadaires] = useState<Statistique[]>([]);
  const [statistiquesJournalieres, setStatistiquesJournalieres] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  // Fonction pour charger les statistiques
  const loadStatistiques = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les statistiques par période
      const monthly = await fetchStatistiquesByPeriode("mois");
      const weekly = await fetchStatistiquesByPeriode("semaine");
      const daily = await fetchStatistiquesByPeriode("jour");
      
      // Mettre à jour les états
      setStatistiquesMensuelles(monthly);
      setStatistiquesHebdomadaires(weekly);
      setStatistiquesJournalieres(daily);
      
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
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Charger les statistiques au chargement de la page
  useEffect(() => {
    loadStatistiques();
  }, []);

  // Fonction pour rafraîchir les statistiques
  const handleRefresh = () => {
    setRefreshing(true);
    loadStatistiques();
  };

  return (
    <div className="space-y-4 p-4 md:p-8 bg-slate-950 text-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistiques</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances de l'entreprise
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
          className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="detaille" className="data-[state=active]:bg-blue-600">
              <Table className="h-4 w-4 mr-2" />
              Détaillé
            </TabsTrigger>
            <TabsTrigger value="graphs" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Graphiques
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <Card className="border-0 bg-slate-900/80 shadow-lg">
              <CardHeader>
                <CardTitle>Performance Globale</CardTitle>
                <CardDescription className="text-slate-400">
                  Vue d'ensemble des statistiques principales
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewSection 
                  statistiques={statistiquesMensuelles}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatistiquesDashboard 
                statistiques={statistiquesMensuelles}
                periode="mois" 
                showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
              />
              
              <StatistiquesDashboard 
                statistiques={statistiquesHebdomadaires}
                periode="semaine" 
                showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
              />
              
              <StatistiquesDashboard 
                statistiques={statistiquesJournalieres}
                periode="jour" 
                showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="detaille" className="space-y-4">
            <Card className="border-0 bg-slate-900/80 shadow-lg">
              <CardHeader>
                <CardTitle>Statistiques Détaillées</CardTitle>
                <CardDescription className="text-slate-400">
                  Affichage de toutes les statistiques par période
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatistiqueTable 
                  statistiques={statistiquesMensuelles}
                  periode="mois" 
                  showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
                />
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-slate-900/80 shadow-lg">
              <CardHeader>
                <CardTitle>Statistiques hebdomadaires</CardTitle>
              </CardHeader>
              <CardContent>
                <StatistiqueTable 
                  statistiques={statistiquesHebdomadaires}
                  periode="semaine" 
                  showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
                />
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-slate-900/80 shadow-lg">
              <CardHeader>
                <CardTitle>Statistiques journalières</CardTitle>
              </CardHeader>
              <CardContent>
                <StatistiqueTable 
                  statistiques={statistiquesJournalieres}
                  periode="jour" 
                  showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="graphs" className="space-y-4">
            <Card className="border-0 bg-slate-900/80 shadow-lg">
              <CardHeader>
                <CardTitle>Graphiques des tendances</CardTitle>
                <CardDescription className="text-slate-400">
                  Visualisation des données pour une meilleure analyse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatistiqueCharts 
                  statistiques={statistiquesMensuelles} 
                  showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Statistics;
