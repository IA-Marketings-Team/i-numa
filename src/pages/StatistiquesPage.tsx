import React, { useState, useEffect } from "react";
import { StatistiqueTable } from "@/components/stats/StatistiqueTable";
import { StatistiqueCharts } from "@/components/stats/StatistiqueCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Statistique } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStatistiques } from "@/services/statistiqueService";
import { useToast } from "@/hooks/use-toast";

const StatistiquesPage: React.FC = () => {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"jour" | "semaine" | "mois">("mois");
  
  const showMonetaryStats = user?.role === "responsable";

  useEffect(() => {
    const loadStatistiques = async () => {
      try {
        setIsLoading(true);
        const stats = await fetchStatistiques();
        setStatistiques(stats);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistiques();
  }, [toast]);

  const filteredStats = statistiques.filter(stat => stat.periode === activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistiques</h1>
      
      {isLoading ? (
        <div className="text-center p-6">
          <p>Chargement des statistiques...</p>
        </div>
      ) : (
        <>
          <Tabs defaultValue="mois" onValueChange={(value) => setActiveTab(value as "jour" | "semaine" | "mois")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jour">Journalières</TabsTrigger>
              <TabsTrigger value="semaine">Hebdomadaires</TabsTrigger>
              <TabsTrigger value="mois">Mensuelles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jour">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques journalières</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatistiqueTable 
                    statistiques={filteredStats} 
                    periode="jour"
                    showMonetaryStats={showMonetaryStats}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Graphiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StatistiqueCharts 
                      statistiques={filteredStats}
                      showMonetaryStats={showMonetaryStats}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="semaine">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques hebdomadaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatistiqueTable 
                    statistiques={filteredStats} 
                    periode="semaine"
                    showMonetaryStats={showMonetaryStats}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Graphiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StatistiqueCharts 
                      statistiques={filteredStats}
                      showMonetaryStats={showMonetaryStats}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="mois">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques mensuelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatistiqueTable 
                    statistiques={filteredStats} 
                    periode="mois"
                    showMonetaryStats={showMonetaryStats}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Graphiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StatistiqueCharts 
                      statistiques={filteredStats}
                      showMonetaryStats={showMonetaryStats}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default StatistiquesPage;
