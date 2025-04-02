
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DossierList from "@/components/dossier/DossierList";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import AgentVisioStats from "@/components/stats/AgentVisioStats";
import { useEffect, useState } from "react";
import { fetchStatistiques } from "@/services/statistiqueService";
import { Statistique } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  const { filteredDossiers, dossiers } = useDossier();
  const navigate = useNavigate();
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (user?.role === 'agent_visio') {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6 space-y-6 md:space-y-8">
        <AgentVisioStats />
      </div>
    );
  }

  const dossierStats = {
    prospects: dossiers.filter(d => d.status === "prospect").length,
    rdv: dossiers.filter(d => d.status === "rdv_en_cours").length,
    valides: dossiers.filter(d => d.status === "valide").length,
    signes: dossiers.filter(d => d.status === "signe").length,
    archives: dossiers.filter(d => d.status === "archive").length,
  };

  const donutData = [
    { name: "Prospects", value: dossierStats.prospects, color: "#6366F1" },
    { name: "RDV en cours", value: dossierStats.rdv, color: "#3B82F6" },
    { name: "Validés", value: dossierStats.valides, color: "#10B981" },
    { name: "Signés", value: dossierStats.signes, color: "#059669" },
    { name: "Archivés", value: dossierStats.archives, color: "#6B7280" },
  ];

  // Transformons les données de statistiques pour le graphique à barres
  const barData = statistiques.length > 0 
    ? statistiques.slice(0, 6).map(stat => ({
        name: new Date(stat.dateDebut).toLocaleDateString('fr-FR', { month: 'short' }),
        dossiers: stat.dossiersValides + stat.dossiersSigne,
        revenus: stat.chiffreAffaires || 0
      })).reverse()
    : [
        { name: "Jan", dossiers: 10, revenus: 5500 },
        { name: "Fév", dossiers: 15, revenus: 8200 },
        { name: "Mar", dossiers: 12, revenus: 6800 },
        { name: "Avr", dossiers: 18, revenus: 9500 },
        { name: "Mai", dossiers: 20, revenus: 12000 },
        { name: "Juin", dossiers: 22, revenus: 13500 },
      ];

  const recentDossiers = [...filteredDossiers]
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  // Filtrer les statistiques mensuelles
  const monthlyStats = statistiques.filter(stat => stat.periode === "mois");

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 space-y-6 md:space-y-8">
      <h1 className="text-3xl font-bold mb-4 md:mb-6">Tableau de bord</h1>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dossiers actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dossiers.filter(d => d.status !== "archive").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{dossierStats.prospects} nouveaux prospects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dossiers.length > 0 
                ? Math.round((dossierStats.signes / dossiers.length) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dossierStats.signes} dossiers signés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV planifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dossierStats.rdv}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rendez-vous en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dossierStats.rdv > 0 
                ? Math.round(((dossierStats.valides + dossierStats.signes) / (dossierStats.rdv + dossierStats.valides + dossierStats.signes)) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dossierStats.valides + dossierStats.signes} dossiers validés/signés
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribution des dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} dossiers`, 'Quantité']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="dossiers" name="Dossiers" fill="#3B82F6" />
                  <Bar yAxisId="right" dataKey="revenus" name="Revenus (€)" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Dossiers récents</h2>
          <Button variant="outline" onClick={() => navigate("/dossiers")}>
            Voir tous les dossiers
          </Button>
        </div>
        
        <DossierList dossiers={recentDossiers} />
      </div>
      
      {(user?.role === 'superviseur' || user?.role === 'responsable') && (
        <StatistiquesDashboard 
          statistiques={monthlyStats} 
          periode="mois"
          showMonetaryStats={user?.role === 'responsable'} 
        />
      )}
    </div>
  );
};

export default Dashboard;
