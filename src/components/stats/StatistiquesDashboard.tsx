
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatistique } from "@/contexts/StatistiqueContext";
import { useAuth } from "@/contexts/AuthContext";
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

const StatistiquesDashboard = () => {
  const { user } = useAuth();
  const { getAuthorizedStatistics, getAgentStatistics } = useStatistique();
  const [period, setPeriod] = useState<"jour" | "semaine" | "mois">("mois");
  const [agentStats, setAgentStats] = useState<any | null>(null);
  const [statData, setStatData] = useState<any[]>([]);
  
  useEffect(() => {
    if (user) {
      // Charger les statistiques selon le rôle
      const stats = getAuthorizedStatistics(user.role);
      setStatData(stats);
      
      // Si c'est un agent, charger ses statistiques personnelles
      if (user.role === 'agent_phoner' || user.role === 'agent_visio') {
        const agentData = getAgentStatistics(user.id);
        if (agentData) {
          setAgentStats(agentData.statistiques);
        }
      }
    }
  }, [user, getAuthorizedStatistics, getAgentStatistics]);

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

  // Données pour les appels
  const callsData = [
    { nom: 'Appels émis', Janvier: 120, Février: 150, Mars: 180 },
    { nom: 'Appels décrochés', Janvier: 80, Février: 100, Mars: 130 },
    { nom: 'Appels transformés', Janvier: 25, Février: 35, Mars: 45 }
  ];

  // Données pour les rendez-vous
  const rdvData = [
    { nom: 'RDV honorés', Janvier: 18, Février: 25, Mars: 30 },
    { nom: 'RDV non honorés', Janvier: 7, Février: 10, Mars: 15 }
  ];

  // Données pour le burndown chart
  const burndownData = [
    { jour: '1', Estimé: 100, Réel: 95 },
    { jour: '5', Estimé: 85, Réel: 90 },
    { jour: '10', Estimé: 70, Réel: 80 },
    { jour: '15', Estimé: 55, Réel: 65 },
    { jour: '20', Estimé: 40, Réel: 45 },
    { jour: '25', Estimé: 25, Réel: 30 },
    { jour: '30', Estimé: 10, Réel: 15 }
  ];

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
                <div className="text-4xl font-bold">75</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taux de conversion</CardTitle>
                <CardDescription>Appels transformés en RDV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">28%</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taux de signature</CardTitle>
                <CardDescription>RDV transformés en contrats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">65%</div>
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
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques d'appels</CardTitle>
              <CardDescription>Évolution sur 3 mois</CardDescription>
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
                  <Bar dataKey="Janvier" fill="#8884d8" />
                  <Bar dataKey="Février" fill="#82ca9d" />
                  <Bar dataKey="Mars" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rdv">
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
                  <Bar dataKey="Janvier" fill="#8884d8" />
                  <Bar dataKey="Février" fill="#82ca9d" />
                  <Bar dataKey="Mars" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatistiquesDashboard;
