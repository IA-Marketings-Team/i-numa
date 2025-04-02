
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { useStatistique } from "@/contexts/StatistiqueContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DossierList from "@/components/dossier/DossierList";
import AgentVisioStats from "@/components/stats/AgentVisioStats";
import { Statistique } from "@/types";
import { fetchStatistiques } from "@/services/statistiqueService";
import { ArrowRight, BarChart4, Briefcase, Calendar, RefreshCw } from "lucide-react";
import OverviewSection from "@/components/dashboard/OverviewSection";
import PerformanceSection from "@/components/dashboard/PerformanceSection";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { filteredDossiers, dossiers, loading: dossiersLoading } = useDossier();
  const { statistiques: contextStats, isLoading: statsContextLoading } = useStatistique();
  const navigate = useNavigate();
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadStatistiques = async () => {
      try {
        setIsLoading(true);
        const stats = await fetchStatistiques();
        setStatistiques(stats);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistiques();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const stats = await fetchStatistiques();
      setStatistiques(stats);
    } catch (error) {
      console.error("Erreur lors de l'actualisation des statistiques:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Si c'est un agent visio, on affiche son dashboard spécifique
  if (user?.role === 'agent_visio') {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6 space-y-6 md:space-y-8">
        <AgentVisioStats />
      </div>
    );
  }

  // Statistiques des dossiers
  const dossierStats = {
    prospects: dossiers.filter(d => d.status === "prospect").length,
    rdv: dossiers.filter(d => d.status === "rdv_en_cours").length,
    valides: dossiers.filter(d => d.status === "valide").length,
    signes: dossiers.filter(d => d.status === "signe").length,
    archives: dossiers.filter(d => d.status === "archive").length,
  };

  // Dossiers récents
  const recentDossiers = [...filteredDossiers]
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  // Limiter la visibilité des données selon le rôle
  const isAdmin = user?.role === 'responsable';
  const isSupervisor = user?.role === 'superviseur';
  const isPhoner = user?.role === 'agent_phoner';
  const isClient = user?.role === 'client';

  return (
    <div className="container mx-auto p-4 space-y-6 bg-slate-950 text-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-slate-400">Aperçu des performances et statistiques</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={refreshing || isLoading}
          className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {isLoading || dossiersLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-dark-card border-slate-800">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-1/3 bg-slate-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-1/2 bg-slate-700 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-slate-700" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-dark-card border-slate-800">
            <CardHeader>
              <Skeleton className="h-5 w-1/4 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full bg-slate-700" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Section de statistiques principales - visible pour tous sauf clients */}
          {!isClient && (
            <OverviewSection 
              statistiques={statistiques} 
              showRevenueData={isAdmin || isSupervisor}
            />
          )}
          
          {/* Section de graphiques de performance - visible pour tous sauf clients */}
          {!isClient && (
            <PerformanceSection 
              statistiques={statistiques}
              showAllData={isAdmin || isSupervisor} 
            />
          )}
          
          {/* Section des statistiques de conversion - adaptée selon le rôle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(isAdmin || isSupervisor || isPhoner) && (
              <StatisticsCard
                title="Taux de validation des dossiers"
                current={dossierStats.valides + dossierStats.signes}
                max={dossierStats.rdv + dossierStats.valides + dossierStats.signes}
                progressColor="bg-green-600"
              />
            )}
            
            {(isAdmin || isSupervisor || isPhoner) && (
              <StatisticsCard
                title="Taux de transformation d'appels"
                current={statistiques.reduce((sum, stat) => sum + stat.appelsTransformes, 0)}
                max={statistiques.reduce((sum, stat) => sum + stat.appelsDecroches, 0)}
                progressColor="bg-blue-600"
              />
            )}
            
            {(isAdmin || isSupervisor || isPhoner) && (
              <StatisticsCard
                title="Rendez-vous honorés"
                current={statistiques.reduce((sum, stat) => sum + stat.rendezVousHonores, 0)}
                max={statistiques.reduce((sum, stat) => sum + (stat.rendezVousHonores + stat.rendezVousNonHonores), 0)}
                progressColor="bg-purple-600"
              />
            )}

            {/* Pour les clients, montrer des statistiques spécifiques */}
            {isClient && (
              <>
                <StatisticsCard
                  title="Mes offres actives"
                  current={3} // À remplacer par des données réelles du client
                  max={5}
                  progressColor="bg-blue-600"
                />
                <StatisticsCard
                  title="Contrats signés"
                  current={2} // À remplacer par des données réelles du client
                  max={5}
                  progressColor="bg-green-600"
                />
                <StatisticsCard
                  title="Performances marketing"
                  current={75} // À remplacer par des données réelles du client
                  max={100}
                  progressColor="bg-purple-600"
                  isPercentage
                />
              </>
            )}
          </div>
          
          {/* Dossiers récents - adapté selon le rôle */}
          {(isAdmin || isSupervisor || isPhoner || (isClient && recentDossiers.length > 0)) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  {isClient ? "Mes dossiers" : "Dossiers récents"}
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dossiers")}
                  className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                >
                  Voir tous
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <DossierList dossiers={recentDossiers} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
