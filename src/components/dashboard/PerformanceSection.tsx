
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceChart from "./PerformanceChart";
import { Card } from "@/components/ui/card";
import { Statistique } from "@/types";

interface PerformanceSectionProps {
  statistiques: Statistique[];
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ statistiques }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (statistiques.length === 0) return;

    // Transforme les données pour les graphiques
    const chartDataTemp = statistiques.map(stat => ({
      name: new Date(stat.dateDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      appels: stat.appelsEmis,
      rdv: stat.rendezVousHonores,
      dossiers: stat.dossiersValides + stat.dossiersSigne,
      chiffre: stat.chiffreAffaires || 0,
    }));

    // Trie par date et limite aux 10 dernières entrées
    const sortedData = [...chartDataTemp].sort(
      (a, b) => new Date(a.name.split('/').reverse().join('/')).getTime() - 
                new Date(b.name.split('/').reverse().join('/')).getTime()
    ).slice(-10);

    setChartData(sortedData);
  }, [statistiques]);

  return (
    <Card className="p-4 border-0 bg-slate-900/80 shadow-lg">
      <Tabs defaultValue="appels">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="appels" className="data-[state=active]:bg-blue-600">Appels</TabsTrigger>
          <TabsTrigger value="rdv" className="data-[state=active]:bg-green-600">Rendez-vous</TabsTrigger>
          <TabsTrigger value="dossiers" className="data-[state=active]:bg-purple-600">Dossiers</TabsTrigger>
          <TabsTrigger value="chiffre" className="data-[state=active]:bg-amber-600">Chiffre d'affaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appels">
          <PerformanceChart 
            title="Évolution des appels émis" 
            data={chartData} 
            dataKey="appels" 
            stroke="#3b82f6"
            fill="#3b82f650"
          />
        </TabsContent>
        
        <TabsContent value="rdv">
          <PerformanceChart 
            title="Rendez-vous honorés" 
            data={chartData} 
            dataKey="rdv" 
            stroke="#10b981"
            fill="#10b98150"
          />
        </TabsContent>
        
        <TabsContent value="dossiers">
          <PerformanceChart 
            title="Dossiers validés et signés" 
            data={chartData} 
            dataKey="dossiers" 
            stroke="#8b5cf6"
            fill="#8b5cf650"
          />
        </TabsContent>
        
        <TabsContent value="chiffre">
          <PerformanceChart 
            title="Évolution du chiffre d'affaires" 
            data={chartData} 
            dataKey="chiffre" 
            stroke="#f59e0b"
            fill="#f59e0b50"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PerformanceSection;
