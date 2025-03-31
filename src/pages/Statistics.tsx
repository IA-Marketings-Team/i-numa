
import { useState } from "react";
import { useStatistique } from "@/contexts/StatistiqueContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Simulated data for various statistics charts
const lineChartData = [
  { name: "Jan", appels: 65, rdv: 28, dossiers: 15 },
  { name: "Fév", appels: 59, rdv: 24, dossiers: 13 },
  { name: "Mar", appels: 80, rdv: 35, dossiers: 20 },
  { name: "Avr", appels: 81, rdv: 45, dossiers: 28 },
  { name: "Mai", appels: 56, rdv: 22, dossiers: 18 },
  { name: "Juin", appels: 75, rdv: 40, dossiers: 30 },
];

const conversionData = [
  { name: "Jan", taux: 22.5 },
  { name: "Fév", taux: 24.8 },
  { name: "Mar", taux: 25.0 },
  { name: "Avr", taux: 35.5 },
  { name: "Mai", taux: 32.1 },
  { name: "Juin", taux: 40.0 },
];

const revenusData = [
  { name: "Jan", montant: 5500 },
  { name: "Fév", montant: 6200 },
  { name: "Mar", montant: 8100 },
  { name: "Avr", montant: 9500 },
  { name: "Mai", montant: 7800 },
  { name: "Juin", montant: 12500 },
];

// Burndown chart data
const burndownData = [
  { jour: 1, prevision: 100, realisation: 95 },
  { jour: 2, prevision: 90, realisation: 89 },
  { jour: 3, prevision: 80, realisation: 82 },
  { jour: 4, prevision: 70, realisation: 68 },
  { jour: 5, prevision: 60, realisation: 55 },
  { jour: 6, prevision: 50, realisation: 51 },
  { jour: 7, prevision: 40, realisation: 42 },
  { jour: 8, prevision: 30, realisation: 31 },
  { jour: 9, prevision: 20, realisation: 18 },
  { jour: 10, prevision: 10, realisation: 12 },
  { jour: 11, prevision: 0, realisation: 0 },
];

// Performance comparison data
const performanceData = [
  { name: "Obj. Appels", agent1: 100, agent2: 120, agent3: 150, agent4: 130 },
  { name: "Appels émis", agent1: 95, agent2: 110, agent3: 155, agent4: 120 },
  { name: "Obj. RDV", agent1: 30, agent2: 35, agent3: 40, agent4: 35 },
  { name: "RDV fixés", agent1: 28, agent2: 32, agent3: 42, agent4: 30 },
  { name: "Obj. Dossiers", agent1: 15, agent2: 18, agent3: 22, agent4: 18 },
  { name: "Dossiers signés", agent1: 13, agent2: 17, agent3: 24, agent4: 16 },
];

const Statistics = () => {
  const [periode, setPeriode] = useState<"jour" | "semaine" | "mois">("mois");
  const { statistiques } = useStatistique();
  const { hasPermission } = useAuth();
  
  const showFinancialData = hasPermission(['superviseur', 'responsable']);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Statistiques</h1>
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="mois" onValueChange={(value) => setPeriode(value as "jour" | "semaine" | "mois")}>
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
              {statistiques.length > 0 ? statistiques[0].appelsEmis : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de décrochage: {statistiques.length > 0 ? Math.round((statistiques[0].appelsDecroches / statistiques[0].appelsEmis) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV fixés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statistiques.length > 0 ? statistiques[0].rendezVousHonores + statistiques[0].rendezVousNonHonores : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de présence: {
                statistiques.length > 0 && (statistiques[0].rendezVousHonores + statistiques[0].rendezVousNonHonores) > 0 
                  ? Math.round((statistiques[0].rendezVousHonores / (statistiques[0].rendezVousHonores + statistiques[0].rendezVousNonHonores)) * 100) 
                  : 0
              }%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dossiers validés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statistiques.length > 0 ? statistiques[0].dossiersValides : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistiques.length > 0 ? statistiques[0].dossiersSigne : 0} dossiers signés
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
                {statistiques.length > 0 && statistiques[0].chiffreAffaires 
                  ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(statistiques[0].chiffreAffaires) 
                  : "0 €"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ce mois
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
              Ratio de dossiers signés par rapport aux RDV
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
              <CardTitle>Revenus mensuels</CardTitle>
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
            <CardTitle>Burndown Chart</CardTitle>
            <CardDescription>
              Progression des objectifs hebdomadaires
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
