
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import DossierList from "@/components/dossier/DossierList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DossierStatus } from "@/types";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const DossierListPage = () => {
  const { filteredDossiers, setStatusFilter, statusFilter, fetchDossiers } = useDossier();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Chargement initial des dossiers depuis l'API
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchDossiers()
        .then(() => {
          console.log("[DossierListPage] Dossiers chargés avec succès");
        })
        .catch((error) => {
          console.error("[DossierListPage] Erreur lors du chargement des dossiers:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les dossiers"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, fetchDossiers, toast]);

  // Log component initialization
  useEffect(() => {
    console.log("[DossierListPage] Component initialized:", { 
      userRole: user?.role,
      hasPermissions: hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']),
      dossierCount: filteredDossiers.length,
      statusFilter
    });
  }, [statusFilter, filteredDossiers.length, user, hasPermission]);

  // Filtrer les dossiers en fonction du terme de recherche
  const searchFilteredDossiers = filteredDossiers.filter(
    (dossier) =>
      (dossier.client?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dossier.client?.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dossier.client?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dossier.client?.secteurActivite || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (status: string) => {
    console.log("[DossierListPage] Status filter changed:", status);
    setStatusFilter(status as DossierStatus | 'all');
  };

  const handleNewDossierClick = () => {
    console.log("[DossierListPage] New dossier button clicked, navigating to /dossiers/nouveau");
    // Ajouter une pause pour debug
    setTimeout(() => {
      console.log("[DossierListPage] Executing navigation to /dossiers/nouveau");
      navigate("/dossiers/nouveau");
      console.log("[DossierListPage] Navigation executed");
    }, 100);
  };

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Dossiers</CardTitle>
          
          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
            <Button 
              onClick={handleNewDossierClick}
              size="sm"
              className="flex items-center gap-2"
              data-testid="nouveau-dossier-btn"
            >
              <Plus className="w-4 h-4" />
              Nouveau dossier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs 
            defaultValue={statusFilter} 
            onValueChange={handleStatusChange}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="prospect">Prospects</TabsTrigger>
              <TabsTrigger value="rdv_en_cours">RDV</TabsTrigger>
              <TabsTrigger value="valide">Validés</TabsTrigger>
              <TabsTrigger value="signe">Signés</TabsTrigger>
              <TabsTrigger value="archive">Archivés</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full md:w-64 self-end">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="bg-background rounded-md border p-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p>Chargement des dossiers...</p>
            </div>
          ) : (
            <DossierList dossiers={searchFilteredDossiers} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DossierListPage;
