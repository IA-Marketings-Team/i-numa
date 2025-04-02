import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatistique } from "@/contexts/StatistiqueContext";
import { useAuth } from "@/contexts/AuthContext";
import { Statistique, Agent } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StatistiquesDashboard = () => {
  const { user } = useAuth();
  const { getStatistiquesByPeriodeType, getAgentStatistics } = useStatistique();
  const [period, setPeriod] = useState<"jour" | "semaine" | "mois">("mois");
  const [agentStats, setAgentStats] = useState<any | null>(null);
  const [statData, setStatData] = useState<Statistique[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      const stats = await getStatistiquesByPeriodeType(period);
      setStatData(stats);
      
      if (user && (user.role === 'agent_phoner' || user.role === 'agent_visio')) {
        const agentData = await getAgentStatistics(user.id);
        if (agentData) {
          setAgentStats(agentData.statistiques);
        }
      }
    };
    
    loadData();
  }, [user, period, getStatistiquesByPeriodeType, getAgentStatistics]);

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Données pour le graphique circulaire des statuts des dossiers
  const pieData = [
    { name: 'Prospects', value: 35, color: '#0088FE' },
    { name: 'RDV en cours', value: 25, color: '#00C49F' },
    { name: 'Validés', value: 15, color: '#FFBB28' },
    { name: 'Signés', value: 20, color: '#FF8042' },
    { name: 'Archivés', value: 5, color: '#8884d8' }
  ];

  // Formater les dates selon la période
  const formatPeriodDate = (date: Date): string => {
    switch (period) {
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

  // Transformer les statistiques en données pour les graphiques
  const prepareChartData = (key1: string, key2: string, key3: string) => {
    return statData.map(stat => {
      const periodName = formatPeriodDate(stat.dateDebut);
      return {
        nom: periodName,
        [key1]: stat[key1 as keyof Statistique] as number,
        [key2]: stat[key2 as keyof Statistique] as number,
        [key3]: stat[key3 as keyof Statistique] as number
      };
    });
  };

  // Données pour les appels
  const callsData = prepareChartData('appelsEmis', 'appelsDecroches', 'appelsTransformes');

  // Données pour les rendez-vous
  const rdvData = prepareChartData('rendezVousHonores', 'rendezVousNonHonores', 'dossiersValides');

  // Données pour le burndown chart (similaire à Statistics.tsx)
  const generateBurndownData = () => {
    const data = [];
    const periodTarget = period === "jour" ? 30 : period === "semaine" ? 100 : 300;
    const progressStep = periodTarget / (period === "jour" ? 24 : period === "semaine" ? 7 : 30);
    
    for (let i = 0; i <= (period === "jour" ? 24 : period === "semaine" ? 7 : 30); i++) {
      data.push({
        jour: i.toString(),
        Estimé: Math.round(periodTarget - (progressStep * i)),
        Réel: Math.round(periodTarget - (progressStep * i * 0.95) + (Math.random() * 5 - 2.5)) // Léger écart aléatoire
      });
    }
    return data;
  };

  const burndownData = generateBurndownData();

  // Calculer des statistiques globales
  const latestStats = statData.length > 0 ? statData[statData.length - 1] : null;
  
  const tauxConversion = latestStats && latestStats.appelsEmis > 0 
    ? Math.round((latestStats.appelsTransformes / latestStats.appelsEmis) * 100) 
    : 0;
    
  const tauxSignature = latestStats && (latestStats.rendezVousHonores + latestStats.rendezVousNonHonores) > 0 
    ? Math.round((latestStats.dossiersSigne / (latestStats.rendezVousHonores + latestStats.rendezVousNonHonores)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="apercu" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="apercu">Aperçu général</TabsTrigger>
          <TabsTrigger value="appels">Statistiques d'appels</TabsTrigger>
          <TabsTrigger value="rdv">Rendez-vous</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apercu" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dossiers actifs</CardTitle>
                <CardDescription>Total des dossiers en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{latestStats?.dossiersValides || 0}</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taux de conversion</CardTitle>
                <CardDescription>Appels transformés en RDV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{tauxConversion}%</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taux de signature</CardTitle>
                <CardDescription>RDV transformés en contrats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{tauxSignature}%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Répartition des dossiers</CardTitle>
                <CardDescription>Par statut</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {user?.role === 'responsable' && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Progression des dossiers</CardTitle>
                  <CardDescription>Estimation vs. Réalité</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={burndownData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="jour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Estimé" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Réel" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            
            {(user?.role === 'agent_phoner' || user?.role === 'agent_visio') && agentStats && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Mes performances</CardTitle>
                  <CardDescription>Statistiques personnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.role === 'agent_phoner' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span>Appels émis</span>
                          <span className="font-semibold">{agentStats.appelsEmis}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Appels décrochés</span>
                          <span className="font-semibold">{agentStats.appelsDecroches}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Appels transformés</span>
                          <span className="font-semibold">{agentStats.appelsTransformes}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center">
                      <span>RDV honorés</span>
                      <span className="font-semibold">{agentStats.rendezVousHonores}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RDV non honorés</span>
                      <span className="font-semibold">{agentStats.rendezVousNonHonores}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dossiers validés</span>
                      <span className="font-semibold">{agentStats.dossiersValides}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dossiers signés</span>
                      <span className="font-semibold">{agentStats.dossiersSigne}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="appels">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Tabs value={period} onValueChange={(value) => setPeriod(value as "jour" | "semaine" | "mois")}>
                <TabsList>
                  <TabsTrigger value="jour">Jour</TabsTrigger>
                  <TabsTrigger value="semaine">Semaine</TabsTrigger>
                  <TabsTrigger value="mois">Mois</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques d'appels</CardTitle>
                <CardDescription>
                  Évolution 
                  {period === "jour" ? " journalière" : period === "semaine" ? " hebdomadaire" : " mensuelle"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={callsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="appelsEmis" name="Appels émis" fill="#8884d8" />
                    <Bar dataKey="appelsDecroches" name="Appels décrochés" fill="#82ca9d" />
                    <Bar dataKey="appelsTransformes" name="Appels transformés" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rdv">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Tabs value={period} onValueChange={(value) => setPeriod(value as "jour" | "semaine" | "mois")}>
                <TabsList>
                  <TabsTrigger value="jour">Jour</TabsTrigger>
                  <TabsTrigger value="semaine">Semaine</TabsTrigger>
                  <TabsTrigger value="mois">Mois</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Rendez-vous clients</CardTitle>
                <CardDescription>Honorés vs non honorés</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rdvData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rendezVousHonores" name="RDV honorés" fill="#82ca9d" />
                    <Bar dataKey="rendezVousNonHonores" name="RDV non honorés" fill="#ff8042" />
                    <Bar dataKey="dossiersValides" name="Dossiers validés" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatistiquesDashboard;
