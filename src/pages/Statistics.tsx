
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Statistique } from "@/types";
import { fetchStatistiques } from "@/services/statistiqueService";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import StatsAggregateDashboard from "@/components/stats/StatsAggregateDashboard";
import StatistiqueTable from "@/components/stats/StatistiqueTable";
import StatistiqueCharts from "@/components/stats/StatistiqueCharts";
import { useAuth } from "@/contexts/AuthContext";

const Statistics = () => {
  const [statistiquesMensuelles, setStatistiquesMensuelles] = useState<Statistique[]>([]);
  const [statistiquesHebdomadaires, setStatistiquesHebdomadaires] = useState<Statistique[]>([]);
  const [statistiquesJournalieres, setStatistiquesJournalieres] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = useAuth();

  // Charger les statistiques depuis Supabase
  useEffect(() => {
    const loadStatistiques = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer toutes les statistiques
        const allStats = await fetchStatistiques();
        
        // Filtrer par période
        const monthly = allStats.filter(stat => stat.periode === 'mois');
        const weekly = allStats.filter(stat => stat.periode === 'semaine');
        const daily = allStats.filter(stat => stat.periode === 'jour');
        
        // Mettre à jour les états
        setStatistiquesMensuelles(monthly);
        setStatistiquesHebdomadaires(weekly);
        setStatistiquesJournalieres(daily);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistiques();
  }, []);

  if (isLoading) {
    return <div className="p-4">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistiques</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances de l'entreprise
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="detaille">Détaillé</TabsTrigger>
          <TabsTrigger value="graphs">Graphiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Globale</CardTitle>
              <CardDescription>
                Vue d'ensemble des statistiques principales
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <StatsAggregateDashboard 
                statistiques={statistiquesMensuelles}
                showMonetaryStats={hasPermission(['superviseur', 'responsable'])}
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
          <Card>
            <CardHeader>
              <CardTitle>Statistiques Détaillées</CardTitle>
              <CardDescription>
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
          
          <Card>
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
          
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Graphiques des tendances</CardTitle>
              <CardDescription>
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
    </div>
  );
};

export default Statistics;
