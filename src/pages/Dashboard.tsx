
import { useAuth } from "@/contexts/AuthContext";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import { useDossier } from "@/contexts/DossierContext";
import DossierList from "@/components/dossier/DossierList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Inbox, Calendar, BarChart2, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const { filteredDossiers } = useDossier();
  const navigate = useNavigate();
  
  // Récupérer les 5 derniers dossiers
  const recentDossiers = [...filteredDossiers]
    .sort((a, b) => new Date(b.dateMiseAJour).getTime() - new Date(a.dateMiseAJour).getTime())
    .slice(0, 5);

  // Calculer les statistiques pour les quick cards
  const totalDossiersEnCours = filteredDossiers.filter(d => 
    d.statut === 'prospect' || d.statut === 'rdv_en_cours' || d.statut === 'valide'
  ).length;
  
  const totalDossiersSignes = filteredDossiers.filter(d => d.statut === 'signe').length;
  
  const totalDossiersArchives = filteredDossiers.filter(d => d.statut === 'archive').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bienvenue, {user?.prenom}</h1>
          <p className="text-muted-foreground">
            {user?.role === 'client' 
              ? "Voici un aperçu de vos dossiers et activités récentes" 
              : "Voici un récapitulatif de vos dossiers et statistiques"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            onClick={() => navigate("/dossiers/nouveau")} 
            size="sm"
            className="h-9"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-shadow card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dossiers en cours</p>
                <h2 className="text-2xl font-bold mt-1">{totalDossiersEnCours}</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Inbox className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dossiers signés</p>
                <h2 className="text-2xl font-bold mt-1">{totalDossiersSignes}</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rendez-vous ce mois</p>
                <h2 className="text-2xl font-bold mt-1">12</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dossiers archivés</p>
                <h2 className="text-2xl font-bold mt-1">{totalDossiersArchives}</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Dossiers récents</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dossiers")} className="text-sm">
                  Voir tous
                </Button>
              </div>
              <CardDescription>
                Vos dossiers les plus récents et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentDossiers.length > 0 ? (
                <DossierList dossiers={recentDossiers} />
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">Aucun dossier récent</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore de dossiers dans votre espace.
                  </p>
                  <Button onClick={() => navigate("/dossiers/nouveau")} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Créer un dossier
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Statistiques</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/statistiques")} className="text-sm">
                  Détails
                </Button>
              </div>
              <CardDescription>
                Analyse des performances et évolution des dossiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatistiquesDashboard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
