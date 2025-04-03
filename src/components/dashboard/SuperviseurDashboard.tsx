
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Phone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Statistique } from "@/types";
import StatsAggregateDashboard from "@/components/stats/StatsAggregateDashboard";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import PerformanceSection from "./PerformanceSection";

interface SuperviseurDashboardProps {
  recentDossiers: any[];
  statistics: Statistique[];
}

const SuperviseurDashboard: React.FC<SuperviseurDashboardProps> = ({
  recentDossiers,
  statistics
}) => {
  const navigate = useNavigate();
  
  // Filtrer les statistiques mensuelles pour le graphique
  const monthlyStats = statistics.filter(s => s.periode === 'mois');
  const hasStatistics = statistics.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">
                {hasStatistics ? statistics[0].dossiersValides : 0}
              </p>
              <p className="text-white/70">Dossiers validés ce mois</p>
              <Button 
                className="mt-4 bg-white text-orange-600 hover:bg-white/90"
                onClick={() => navigate("/statistiques")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Voir statistiques
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">--</p>
              <p className="text-muted-foreground">Agents actifs</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/agents")}
              >
                <Users className="mr-2 h-4 w-4" />
                Gérer les agents
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-muted-foreground mb-4">
                Consultez et gérez les rendez-vous
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/agenda-global")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Voir l'agenda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {monthlyStats.length > 0 && (
        <PerformanceSection 
          statistiques={monthlyStats}
          showAllData={true}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance d'équipe</CardTitle>
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
            <CardTitle>Dossiers récents</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDossiers.length === 0 ? (
              <p className="text-muted-foreground">Aucun dossier récent</p>
            ) : (
              <div className="space-y-4">
                {recentDossiers.map((dossier) => (
                  <div 
                    key={dossier.id} 
                    className="flex items-center justify-between border-b pb-2"
                    onClick={() => navigate(`/dossiers/${dossier.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <p className="font-medium">Dossier #{dossier.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        dossier.status === 'validé' 
                          ? 'bg-green-100 text-green-800' 
                          : dossier.status === 'en attente' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {dossier.status || 'Non défini'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperviseurDashboard;
