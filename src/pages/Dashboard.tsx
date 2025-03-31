
import { useAuth } from "@/contexts/AuthContext";
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";
import { useDossier } from "@/contexts/DossierContext";
import DossierList from "@/components/dossier/DossierList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { filteredDossiers } = useDossier();
  const navigate = useNavigate();
  
  // Récupérer les 5 derniers dossiers
  const recentDossiers = [...filteredDossiers]
    .sort((a, b) => new Date(b.dateMiseAJour).getTime() - new Date(a.dateMiseAJour).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bonjour, {user?.prenom}</h1>
        <p className="text-gray-600">
          {user?.role === 'client' 
            ? "Bienvenue dans votre espace client" 
            : "Bienvenue dans votre espace de travail"}
        </p>
      </div>

      <StatistiquesDashboard />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dossiers récents</h2>
        <Button onClick={() => navigate("/dossiers")} variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Voir tous les dossiers
        </Button>
      </div>
      
      {recentDossiers.length > 0 ? (
        <DossierList dossiers={recentDossiers} />
      ) : (
        <div className="bg-white border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dossier récent</h3>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de dossiers dans votre espace.
          </p>
          <Button onClick={() => navigate("/dossiers/nouveau")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Créer un dossier
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
