
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, LayoutDashboard, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Statistique } from "@/types";
import StatsAggregateDashboard from "@/components/stats/StatsAggregateDashboard";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import PerformanceSection from "./PerformanceSection";
import StatistiqueCharts from "@/components/stats/StatistiqueCharts";

interface ResponsableDashboardProps {
  recentDossiers: any[];
  statistics: Statistique[];
}

const ResponsableDashboard: React.FC<ResponsableDashboardProps> = ({
  recentDossiers,
  statistics
}) => {
  const navigate = useNavigate();
  
  // Filtrer les statistiques pour les graphiques
  const monthlyStats = statistics.filter(s => s.periode === 'mois');
  const hasStatistics = statistics.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">
                {hasStatistics && statistics[0].chiffreAffaires 
                  ? `${statistics[0].chiffreAffaires.toLocaleString()} €` 
                  : "0 €"}
              </p>
              <p className="text-white/70">Ce mois-ci</p>
              <Button 
                className="mt-4 bg-white text-green-600 hover:bg-white/90"
                onClick={() => navigate("/statistiques")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Voir rapports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">--</p>
              <p className="text-muted-foreground">Collaborateurs</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/agents")}
              >
                <Users className="mr-2 h-4 w-4" />
                Gérer l'équipe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">{recentDossiers.length}</p>
              <p className="text-muted-foreground">Dossiers en cours</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/dossiers")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Voir les dossiers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {monthlyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution des performances</CardTitle>
          </CardHeader>
          <CardContent>
            <StatistiqueCharts 
              statistiques={monthlyStats} 
              showMonetaryStats={true}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance globale</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsAggregateDashboard statistiques={statistics} showMonetaryStats={true} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <StatistiquesDashboard 
              statistiques={statistics.filter(s => s.periode === 'mois')} 
              periode="mois"
              showMonetaryStats={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
            <StatistiquesDashboard 
              statistiques={statistics.filter(s => s.periode === 'semaine')} 
              periode="semaine"
              showMonetaryStats={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsableDashboard;
