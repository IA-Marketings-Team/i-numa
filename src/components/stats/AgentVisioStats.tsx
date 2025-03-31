
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { CalendarIcon, CheckCircle, XCircle, PhoneCall, FileSignature } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AgentVisioStats: React.FC = () => {
  const { user } = useAuth();
  const { rendezVous, dossiers } = useDossier();
  
  // Filtrer les rendez-vous et dossiers pour l'agent visio actuel
  const userRendezVous = rendezVous.filter(rdv => {
    const dossier = dossiers.find(d => d.id === rdv.dossierId);
    return dossier && dossier.agentVisioId === user?.id;
  });
  
  // Statistiques des rendez-vous
  const rdvEnCours = userRendezVous.filter(rdv => new Date(rdv.date) > new Date()).length;
  const rdvHonores = userRendezVous.filter(rdv => rdv.status === 'realise').length;
  const rdvNonHonores = userRendezVous.filter(rdv => rdv.status === 'annule').length;
  
  // Signatures effectuées
  const signaturesEffectuees = dossiers.filter(
    d => d.agentVisioId === user?.id && d.status === 'signe'
  ).length;
  
  // Nombre d'appels (simulé avec une valeur aléatoire entre 10 et 30)
  const nbAppels = Math.floor(Math.random() * 20) + 10;
  
  // Rendez-vous imminents (dans les 48h)
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const rdvImminents = userRendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date);
    return rdvDate > now && rdvDate <= in48Hours;
  });
  
  // Données pour le graphique des rendez-vous par statut
  const rdvStatsData = [
    { name: "En attente", value: rdvEnCours, fill: "#3B82F6" },
    { name: "Honorés", value: rdvHonores, fill: "#10B981" },
    { name: "Non honorés", value: rdvNonHonores, fill: "#EF4444" },
  ];
  
  // Agenda des rendez-vous (prochains rendez-vous triés par date)
  const prochainRdvs = [...userRendezVous]
    .filter(rdv => new Date(rdv.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord Agent Visio</h2>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{rdvEnCours}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RDV honorés/non honorés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-lg font-semibold">{rdvHonores}</span>
              </div>
              <div className="text-xl">/</div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-lg font-semibold">{rdvNonHonores}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signatures effectuées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{signaturesEffectuees}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nombre d'appels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{nbAppels}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agenda des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            {prochainRdvs.length > 0 ? (
              <div className="space-y-4">
                {prochainRdvs.map((rdv) => {
                  const dossier = dossiers.find(d => d.id === rdv.dossierId);
                  return (
                    <div key={rdv.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">{dossier?.client.secteurActivite}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rdv.date).toLocaleDateString()} à {rdv.heure || "Non définie"}
                        </p>
                      </div>
                      <div className={`status-${rdv.status === 'realise' ? 'valide' : rdv.status === 'annule' ? 'archive' : 'rdv'}`}>
                        {rdv.status === 'realise' ? 'Réalisé' : rdv.status === 'annule' ? 'Annulé' : 'Planifié'}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">Aucun rendez-vous à venir</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rdvStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Nombre de RDV" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous imminents (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          {rdvImminents.length > 0 ? (
            <div className="space-y-4">
              {rdvImminents.map((rdv) => {
                const dossier = dossiers.find(d => d.id === rdv.dossierId);
                return (
                  <div key={rdv.id} className="p-4 border rounded-md flex justify-between items-center bg-amber-50">
                    <div>
                      <p className="font-semibold">{dossier?.client.secteurActivite}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(rdv.date).toLocaleDateString()} à {rdv.heure || "Non définie"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Besoins: {dossier?.besoins || "Non spécifiés"}
                      </p>
                    </div>
                    <div className="text-amber-600">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">Aucun rendez-vous imminent</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentVisioStats;
