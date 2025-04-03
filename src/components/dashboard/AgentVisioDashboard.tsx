
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Video, AlertCircle, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Statistique } from "@/types";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import PerformanceChart from "./PerformanceChart";

interface AgentVisioDashboardProps {
  recentDossiers: any[];
  statistics: Statistique[];
}

const AgentVisioDashboard: React.FC<AgentVisioDashboardProps> = ({ 
  recentDossiers,
  statistics
}) => {
  const navigate = useNavigate();
  
  // Filtrage des statistiques par période
  const dailyStats = statistics.filter(s => s.periode === 'jour');
  const weeklyStats = statistics.filter(s => s.periode === 'semaine');
  const hasStatistics = statistics.length > 0;
  
  // Données pour le graphique des rendez-vous
  const performanceData = weeklyStats.map(stat => ({
    name: new Date(stat.dateDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    value: stat.rendezVousHonores
  })).reverse();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Visioconférences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">
                {hasStatistics ? statistics[0].rendezVousHonores : 0}
              </p>
              <p className="text-white/70">RDV effectués aujourd'hui</p>
              <Button 
                className="mt-4 bg-white text-purple-600 hover:bg-white/90"
                onClick={() => navigate("/agenda-global")}
              >
                <Video className="mr-2 h-4 w-4" />
                Voir rendez-vous
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
                <Users className="mr-2 h-4 w-4" />
                Gérer les dossiers
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

      {weeklyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Performance de rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart 
              title="Rendez-vous honorés par semaine" 
              data={performanceData} 
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf633"
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques journalières</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyStats.length > 0 ? (
              <StatistiquesDashboard 
                statistiques={dailyStats} 
                periode="jour"
                showMonetaryStats={false}
              />
            ) : (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-2" />
                Aucune statistique journalière disponible
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous à venir</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDossiers.length === 0 ? (
              <p className="text-muted-foreground">Aucun rendez-vous à venir</p>
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
                      <p className="font-medium">
                        RDV {dossier.dateRdv ? new Date(dossier.dateRdv).toLocaleDateString('fr-FR') : 'Non planifié'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dossier #{dossier.id.substring(0, 8)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-1" />
                      Démarrer
                    </Button>
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

export default AgentVisioDashboard;
