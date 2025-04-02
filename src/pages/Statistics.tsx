
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStatistique } from '@/contexts/StatistiqueContext';
import StatistiquesDashboard from '@/components/stats/StatistiquesDashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Statistique } from '@/types';
import { Calendar, BarChart2, LineChart, Users } from 'lucide-react';
import { getCurrentUser } from '@/lib/realm';

const Statistics = () => {
  const { user } = useAuth();
  const { isLoading: statistiquesLoading } = useStatistique();
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistiquesData = async () => {
      setIsLoading(true);
      try {
        const realmUser = getCurrentUser();
        if (!realmUser) {
          console.error("Utilisateur Realm non connecté");
          setIsLoading(false);
          return;
        }
        
        const statsCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("statistiques");
        let statsQuery = {};
        
        // Si l'utilisateur est un agent, filtrer uniquement ses statistiques
        if (user?.role?.startsWith('agent_')) {
          statsQuery = { userId: user.id };
        }
        
        const result = await statsCollection.find(statsQuery);
        
        const statsData = result.map((stat: any) => ({
          id: stat._id.toString(),
          userId: stat.userId,
          date: new Date(stat.date),
          appelsEmis: stat.appelsEmis,
          appelsDecroches: stat.appelsDecroches,
          appelsTransformes: stat.appelsTransformes,
          rendezVousHonores: stat.rendezVousHonores,
          rendezVousNonHonores: stat.rendezVousNonHonores,
          dossiersValides: stat.dossiersValides,
          dossiersSigne: stat.dossiersSigne
        }));
        
        setStatistiques(statsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistiquesData();
  }, [user]);

  const isAllStatisticsAccessible = user?.role === 'superviseur' || user?.role === 'responsable';

  if (isLoading || statistiquesLoading) {
    return <div className="container mx-auto py-6">Chargement des statistiques...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Statistiques</h1>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4" />
            <span>Tableau de bord</span>
          </TabsTrigger>
          
          {isAllStatisticsAccessible && (
            <>
              <TabsTrigger value="agents" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Agents</span>
              </TabsTrigger>
              
              <TabsTrigger value="trends" className="flex items-center space-x-2">
                <LineChart className="w-4 h-4" />
                <span>Tendances</span>
              </TabsTrigger>
              
              <TabsTrigger value="calendar" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Calendrier</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-4">
          <StatistiquesDashboard />
        </TabsContent>
        
        {isAllStatisticsAccessible && (
          <>
            <TabsContent value="agents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques des agents</CardTitle>
                  <CardDescription>Performance par agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Visualisation des statistiques par agent à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances</CardTitle>
                  <CardDescription>Évolution des statistiques dans le temps</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Graphiques d'évolution des performances à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calendrier</CardTitle>
                  <CardDescription>Visualisation des rendez-vous</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Calendrier des rendez-vous à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Statistics;
