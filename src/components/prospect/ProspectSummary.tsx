
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useCommunication } from '@/contexts/CommunicationContext';
import { Appel } from '@/types';

const ProspectSummary: React.FC = () => {
  const { appels } = useCommunication();
  const [periodTab, setPeriodTab] = useState('day');
  const [summaryData, setSummaryData] = useState<any>({
    totalAppels: 0,
    totalDuree: 0,
    rdvCount: 0,
    ventesCount: 0,
    tauxTransformation: 0,
    statusCount: {}
  });
  
  // Calcul des statistiques en fonction de la période
  useEffect(() => {
    if (!appels || appels.length === 0) return;
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let startDate;
    
    switch (periodTab) {
      case 'day':
        startDate = startOfDay;
        break;
      case 'week':
        startDate = startOfWeek;
        break;
      case 'month':
        startDate = startOfMonth;
        break;
      default:
        startDate = startOfDay;
    }
    
    // Filtrer les appels par période
    const filteredAppels = appels.filter(appel => 
      new Date(appel.date) >= startDate
    );
    
    // Calculer les statistiques
    const totalAppels = filteredAppels.length;
    const totalDuree = filteredAppels.reduce((sum, appel) => sum + appel.duree, 0);
    const rdvCount = filteredAppels.filter(appel => appel.statut === 'RDV').length;
    const ventesCount = filteredAppels.filter(appel => appel.statut === 'Vente').length;
    const tauxTransformation = totalAppels > 0 
      ? Math.round((rdvCount + ventesCount) / totalAppels * 100) 
      : 0;
    
    // Compter par statut
    const statusCount: Record<string, number> = {};
    filteredAppels.forEach(appel => {
      statusCount[appel.statut] = (statusCount[appel.statut] || 0) + 1;
    });
    
    setSummaryData({
      totalAppels,
      totalDuree,
      rdvCount,
      ventesCount,
      tauxTransformation,
      statusCount
    });
    
  }, [appels, periodTab]);
  
  return (
    <Card className="border shadow-sm bg-white">
      <CardHeader>
        <CardTitle>Résumé des appels</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="day" value={periodTab} onValueChange={setPeriodTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="day">Jour</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
          
          <TabsContent value={periodTab}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Total Appels</TableHead>
                  <TableHead>Durée totale</TableHead>
                  <TableHead>Rendez-vous</TableHead>
                  <TableHead>Ventes</TableHead>
                  <TableHead>Taux de transformation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{summaryData.totalAppels}</TableCell>
                  <TableCell>{summaryData.totalDuree} min</TableCell>
                  <TableCell>{summaryData.rdvCount}</TableCell>
                  <TableCell>{summaryData.ventesCount}</TableCell>
                  <TableCell>{summaryData.tauxTransformation}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Répartition par statut</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statut</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Pourcentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(summaryData.statusCount).map(([status, count]) => (
                    <TableRow key={status}>
                      <TableCell>{status}</TableCell>
                      <TableCell>{count}</TableCell>
                      <TableCell>
                        {summaryData.totalAppels > 0 
                          ? Math.round((count as number) / summaryData.totalAppels * 100) 
                          : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProspectSummary;
