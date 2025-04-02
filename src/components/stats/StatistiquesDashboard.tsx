
import React, { useState, useEffect } from 'react';
import { useStatistique } from '@/contexts/StatistiqueContext';
import { useAuth } from '@/contexts/AuthContext';
import RendezVousChart from './RendezVousChart';
import StatsCards from './StatsCards';
import RendezVousImminents from './RendezVousImminents';
import AgentVisioStats from './AgentVisioStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent, Statistique } from '@/types';

export const StatistiquesDashboard = () => {
  const { fetchStatistiques, fetchAgentByMonth } = useStatistique();
  const { user } = useAuth();
  const [isAgentVisio, setIsAgentVisio] = useState(false);
  const [currentStats, setCurrentStats] = useState<Statistique[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAgentVisio(user?.role === 'agent_visio');
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Pour les statistiques globales
      const stats = await fetchStatistiques();
      setCurrentStats(stats);

      // Pour les statistiques d'agent par mois
      const annee = currentDate.getFullYear();
      const mois = currentDate.getMonth() + 1;
      const agent = await fetchAgentByMonth(annee, mois);
      setCurrentAgent(agent);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          {isAgentVisio && <TabsTrigger value="visio">Visio</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards statistiques={currentStats} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {currentAgent && (
                  <RendezVousChart data={[
                    { name: 'Appels émis', value: currentAgent.statistiques.appelsEmis, fill: '#3B82F6' },
                    { name: 'RDV honorés', value: currentAgent.statistiques.rendezVousHonores, fill: '#10B981' },
                    { name: 'RDV manqués', value: currentAgent.statistiques.rendezVousNonHonores, fill: '#EF4444' },
                    { name: 'Dossiers validés', value: currentAgent.statistiques.dossiersValides, fill: '#8B5CF6' },
                    { name: 'Contrats signés', value: currentAgent.statistiques.dossiersSigne, fill: '#F59E0B' }
                  ]} title="Statistiques du mois" />
                )}
              </CardContent>
            </Card>
            
            <RendezVousImminents />
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Contenu détaillé des statistiques */}
              <p>Tableau détaillé des performances à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {isAgentVisio && (
          <TabsContent value="visio">
            <AgentVisioStats />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StatistiquesDashboard;
