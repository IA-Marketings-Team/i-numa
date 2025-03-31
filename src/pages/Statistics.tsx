
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Données pour le graphique de burndown
const burndownData = [
  { day: '1', prospect: 35, rdv: 30, valide: 25, signe: 20 },
  { day: '5', prospect: 33, rdv: 28, valide: 22, signe: 18 },
  { day: '10', prospect: 30, rdv: 25, valide: 20, signe: 16 },
  { day: '15', prospect: 28, rdv: 23, valide: 18, signe: 15 },
  { day: '20', prospect: 25, rdv: 20, valide: 15, signe: 14 },
  { day: '25', prospect: 20, rdv: 18, valide: 12, signe: 12 },
  { day: '30', prospect: 15, rdv: 12, valide: 10, signe: 10 },
];

// Données pour le graphique de progression mensuelle
const progressionData = [
  { mois: 'Jan', nouveaux: 20, signés: 13, convertis: 65 },
  { mois: 'Fév', nouveaux: 25, signés: 18, convertis: 72 },
  { mois: 'Mar', nouveaux: 30, signés: 20, convertis: 67 },
  { mois: 'Avr', nouveaux: 22, signés: 16, convertis: 73 },
  { mois: 'Mai', nouveaux: 28, signés: 19, convertis: 68 },
  { mois: 'Juin', nouveaux: 35, signés: 25, convertis: 71 },
];

// Données pour le graphique de répartition par statut
const statusData = [
  { statut: 'Prospect', nombre: 24, couleur: '#3b82f6' },
  { statut: 'RDV', nombre: 18, couleur: '#6366f1' },
  { statut: 'Validé', nombre: 12, couleur: '#14b8a6' },
  { statut: 'Signé', nombre: 9, couleur: '#22c55e' },
  { statut: 'Archivé', nombre: 7, couleur: '#94a3b8' },
];

const Statistics = () => {
  const [period, setPeriod] = useState("month");
  const [chartType, setChartType] = useState("bar");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-muted-foreground">
            Suivez vos performances et l'évolution de vos dossiers en temps réel
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type de graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Barres</SelectItem>
              <SelectItem value="line">Lignes</SelectItem>
              <SelectItem value="area">Aires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total dossiers</p>
              <h2 className="text-3xl font-bold">70</h2>
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">↑</span> +12% vs période précédente
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
              <h2 className="text-3xl font-bold">68%</h2>
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">↑</span> +5% vs période précédente
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Montant moyen</p>
              <h2 className="text-3xl font-bold">1 568 €</h2>
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">↓</span> -3% vs période précédente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="status">Par statut</TabsTrigger>
          <TabsTrigger value="burndown">Burndown chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Progression mensuelle</CardTitle>
              <CardDescription>
                Évolution du nombre de dossiers et du taux de conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={progressionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="nouveaux" name="Nouveaux dossiers" fill="#3b82f6" />
                      <Bar yAxisId="left" dataKey="signés" name="Dossiers signés" fill="#22c55e" />
                      <Line yAxisId="right" dataKey="convertis" name="Taux de conversion (%)" stroke="#f97316" type="monotone" />
                    </BarChart>
                  ) : chartType === "line" ? (
                    <LineChart data={progressionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" dataKey="nouveaux" name="Nouveaux dossiers" stroke="#3b82f6" type="monotone" />
                      <Line yAxisId="left" dataKey="signés" name="Dossiers signés" stroke="#22c55e" type="monotone" />
                      <Line yAxisId="right" dataKey="convertis" name="Taux de conversion (%)" stroke="#f97316" type="monotone" />
                    </LineChart>
                  ) : (
                    <AreaChart data={progressionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="nouveaux" name="Nouveaux dossiers" stroke="#3b82f6" fill="#3b82f630" />
                      <Area type="monotone" dataKey="signés" name="Dossiers signés" stroke="#22c55e" fill="#22c55e30" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Répartition par statut</CardTitle>
              <CardDescription>
                Distribution des dossiers selon leur statut actuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="statut" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nombre" name="Nombre de dossiers">
                      {statusData.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="burndown" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Burndown Chart</CardTitle>
              <CardDescription>
                Évolution des dossiers par statut sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Jour du mois', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Nombre de dossiers', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="prospect" name="Prospect" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="rdv" name="Rendez-vous" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="valide" name="Validé" stroke="#14b8a6" strokeWidth={2} />
                    <Line type="monotone" dataKey="signe" name="Signé" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
