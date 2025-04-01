
import { useState, useEffect } from "react";
import { useStatistique } from "@/contexts/StatistiqueContext";
import { Statistique } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Statistics = () => {
  const [periode, setPeriode] = useState<"jour" | "semaine" | "mois">("mois");
  const [currentStats, setCurrentStats] = useState<Statistique[]>([]);
  const { getStatistiquesByPeriodeType } = useStatistique();
  const { hasPermission, user } = useAuth();
  
  const showFinancialData = hasPermission(['superviseur', 'responsable']);

  useEffect(() => {
    // Get statistics for the selected period
    const stats = getStatistiquesByPeriodeType(periode);
    setCurrentStats(stats);
  }, [periode, getStatistiquesByPeriodeType]);

  // Formatter pour les dates selon la période
  const formatDate = (date: Date): string => {
    switch (periode) {
      case "jour":
        return format(new Date(date), "dd/MM", { locale: fr });
      case "semaine":
        return `${format(new Date(date), "dd/MM", { locale: fr })}`;
      case "mois":
        return format(new Date(date), "MMM yyyy", { locale: fr });
      default:
        return "";
    }
  };

  // Transformer les données pour les graphiques
  const lineChartData = currentStats.map(stat => ({
    name: formatDate(stat.dateDebut),
    appels: stat.appelsEmis,
    rdv: stat.rendezVousHonores + stat.rendezVousNonHonores,
    dossiers: stat.dossiersValides + stat.dossiersSigne
  }));

  const conversionData = currentStats.map(stat => ({
    name: formatDate(stat.dateDebut),
    taux: stat.appelsEmis > 0 
      ? Math.round((stat.appelsTransformes / stat.appelsEmis) * 100) 
      : 0
  }));

  const revenusData = currentStats.map(stat => ({
    name: formatDate(stat.dateDebut),
    montant: stat.chiffreAffaires || 0
  }));

  // Performance des agents (exemple cohérent avec les autres données)
  const performanceData = [
    { name: "Obj. Appels", agent1: 100, agent2: 120, agent3: 150, agent4: 130 },
    { 
      name: "Appels émis", 
      agent1: Math.round(currentStats[currentStats.length - 1]?.appelsEmis * 0.25) || 95, 
      agent2: Math.round(currentStats[currentStats.length - 1]?.appelsEmis * 0.3) || 110, 
      agent3: Math.round(currentStats[currentStats.length - 1]?.appelsEmis * 0.35) || 155, 
      agent4: Math.round(currentStats[currentStats.length - 1]?.appelsEmis * 0.1) || 120 
    },
    { name: "Obj. RDV", agent1: 30, agent2: 35, agent3: 40, agent4: 35 },
    { 
      name: "RDV fixés", 
      agent1: Math.round((currentStats[currentStats.length - 1]?.rendezVousHonores || 0) * 0.25), 
      agent2: Math.round((currentStats[currentStats.length - 1]?.rendezVousHonores || 0) * 0.3), 
      agent3: Math.round((currentStats[currentStats.length - 1]?.rendezVousHonores || 0) * 0.35), 
      agent4: Math.round((currentStats[currentStats.length - 1]?.rendezVousHonores || 0) * 0.1) 
    },
    { name: "Obj. Dossiers", agent1: 15, agent2: 18, agent3: 22, agent4: 18 },
    { 
      name: "Dossiers signés", 
      agent1: Math.round((currentStats[currentStats.length - 1]?.dossiersSigne || 0) * 0.25), 
      agent2: Math.round((currentStats[currentStats.length - 1]?.dossiersSigne || 0) * 0.3), 
      agent3: Math.round((currentStats[currentStats.length - 1]?.dossiersSigne || 0) * 0.35), 
      agent4: Math.round((currentStats[currentStats.length - 1]?.dossiersSigne || 0) * 0.1)
    },
  ];

  // Calculer des taux cohérents à partir des données statistiques
  const calculerTauxDeconversion = (stats: Statistique): number => {
    if (stats.rendezVousHonores + stats.rendezVousNonHonores > 0) {
      return Math.round((stats.dossiersSigne / (stats.rendezVousHonores + stats.rendezVousNonHonores)) * 100);
    }
    return 0;
  };

  const calculerTauxPresence = (stats: Statistique): number => {
    if ((stats.rendezVousHonores + stats.rendezVousNonHonores) > 0) {
      return Math.round((stats.rendezVousHonores / (stats.rendezVousHonores + stats.rendezVousNonHonores)) * 100);
    }
    return 0;
  };

  const calculerTauxDecrochage = (stats: Statistique): number => {
    if (stats.appelsEmis > 0) {
      return Math.round((stats.appelsDecroches / stats.appelsEmis) * 100);
    }
    return 0;
  };

  const latestStats = currentStats.length > 0 ? currentStats[currentStats.length - 1] : null;

  // Burndown chart (données de suivi d'objectifs progressives)
  const generateBurndownData = () => {
    const data = [];
    const periodTarget = periode === "jour" ? 30 : periode === "semaine" ? 100 : 300;
    const progressStep = periodTarget / (periode === "jour" ? 24 : periode === "semaine" ? 7 : 30);
    
    for (let i = 0; i <= (periode === "jour" ? 24 : periode === "semaine" ? 7 : 30); i++) {
      data.push({
        jour: i.toString(),
        prevision: Math.round(periodTarget - (progressStep * i)),
        realisation: Math.round(periodTarget - (progressStep * i * 0.95) + (Math.random() * 5 - 2.5)) // Léger écart aléatoire
      });
    }
    return data;
  };

  const burndownData = generateBurndownData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Statistiques</h1>
      
      <div className="flex justify-between items-center">
        <Tabs value={periode} onValueChange={(value) => setPeriode(value as "jour" | "semaine" | "mois")}>
          <TabsList>
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Appels émis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestStats?.appelsEmis || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de décrochage: {latestStats ? calculerTauxDecrochage(latestStats) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV fixés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestStats ? latestStats.rendezVousHonores + latestStats.rendezVousNonHonores : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de présence: {latestStats ? calculerTauxPresence(latestStats) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dossiers validés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestStats?.dossiersValides || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latestStats?.dossiersSigne || 0} dossiers signés
            </p>
          </CardContent>
        </Card>
        
        {showFinancialData && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestStats?.chiffreAffaires
                  ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(latestStats.chiffreAffaires) 
                  : "0 €"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {periode === "jour" ? "Ce jour" : periode === "semaine" ? "Cette semaine" : "Ce mois"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des KPIs</CardTitle>
            <CardDescription>
              Tendance des appels, rendez-vous et dossiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="appels" stroke="#6366F1" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="rdv" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="dossiers" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Taux de conversion</CardTitle>
            <CardDescription>
              Ratio d'appels transformés en RDV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={conversionData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Area type="monotone" dataKey="taux" stroke="#6366F1" fill="#818CF8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {showFinancialData && (
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenus {periode === "jour" ? "journaliers" : periode === "semaine" ? "hebdomadaires" : "mensuels"}</CardTitle>
              <CardDescription>
                Évolution du chiffre d'affaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
                    <Bar dataKey="montant" name="Revenus (€)" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance des agents</CardTitle>
            <CardDescription>
              Comparaison de la performance entre agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="agent1" name="Agent 1" fill="#6366F1" />
                  <Bar dataKey="agent2" name="Agent 2" fill="#3B82F6" />
                  <Bar dataKey="agent3" name="Agent 3" fill="#10B981" />
                  <Bar dataKey="agent4" name="Agent 4" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Suivi des objectifs</CardTitle>
            <CardDescription>
              Progression des objectifs {periode === "jour" ? "journaliers" : periode === "semaine" ? "hebdomadaires" : "mensuels"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={burndownData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="prevision" name="Prévision" stroke="#6B7280" strokeWidth={2} />
                  <Line type="monotone" dataKey="realisation" name="Réalisation" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
