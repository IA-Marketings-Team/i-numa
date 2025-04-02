
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
import MarketCard from "@/components/dashboard/MarketCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import OverviewSection from "@/components/dashboard/OverviewSection";
import PerformanceSection from "@/components/dashboard/PerformanceSection";
import StatisticsCard from "@/components/dashboard/StatisticsCard";

const Dashboard = () => {
  const { user } = useAuth();
  const { filteredDossiers, dossiers } = useDossier();
  const { statistiques: contextStats, isLoading: statsLoading } = useStatistique();
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

  // Filtrer les statistiques mensuelles
  const monthlyStats = statistiques.filter(stat => stat.periode === "mois");

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

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-slate-400">Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Section de statistiques principales */}
          <OverviewSection statistiques={statistiques} />
          
          {/* Section de graphiques de performance */}
          <PerformanceSection statistiques={statistiques} />
          
          {/* Section des statistiques de conversion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticsCard
              title="Taux de validation des dossiers"
              current={dossierStats.valides + dossierStats.signes}
              max={dossierStats.rdv + dossierStats.valides + dossierStats.signes}
              progressColor="bg-green-600"
            />
            <StatisticsCard
              title="Taux de transformation d'appels"
              current={statistiques.reduce((sum, stat) => sum + stat.appelsTransformes, 0)}
              max={statistiques.reduce((sum, stat) => sum + stat.appelsDecroches, 0)}
              progressColor="bg-blue-600"
            />
            <StatisticsCard
              title="Rendez-vous honorés"
              current={statistiques.reduce((sum, stat) => sum + stat.rendezVousHonores, 0)}
              max={statistiques.reduce((sum, stat) => sum + (stat.rendezVousHonores + stat.rendezVousNonHonores), 0)}
              progressColor="bg-purple-600"
            />
          </div>
          
          {/* Dossiers récents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Dossiers récents
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
