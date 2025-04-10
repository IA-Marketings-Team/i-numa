
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
import { canAccessDossierType } from "@/utils/accessControl";

const DossierListPage = () => {
  const { filteredDossiers, setStatusFilter, statusFilter, isLoading } = useDossier();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

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
      dossier.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dossier.client.secteurActivite && 
       dossier.client.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = (status: string) => {
    console.log("[DossierListPage] Status filter changed:", status);
    
    // Vérifier si l'utilisateur peut accéder à ce type de dossier
    if (!canAccessDossierType(user?.role, status) && status !== 'all') {
      toast({
        variant: "destructive",
        title: "Accès limité",
        description: "Vous n'avez pas accès à ce type de dossier."
      });
      return;
    }
    
    setStatusFilter(status as DossierStatus | 'all');
  };

  const handleNewDossierClick = () => {
    console.log("[DossierListPage] New dossier button clicked, navigating to /dossiers/nouveau");
    navigate("/dossiers/nouveau");
  };

  // Déterminer quels onglets de statut sont visibles en fonction du rôle
  const renderStatusTabs = () => {
    // Tous les statuts disponibles
    const allStatuses = [
      { value: 'all', label: 'Tous' },
      { value: 'prospect_chaud', label: 'Prospects chauds' },
      { value: 'prospect_froid', label: 'Prospects froids' },
      { value: 'rdv_honore', label: 'RDV honorés' },
      { value: 'rdv_non_honore', label: 'RDV non honorés' },
      { value: 'valide', label: 'Validés' },
      { value: 'signe', label: 'Signés' },
      { value: 'archive', label: 'Archivés' }
    ];
    
    // Filtrer en fonction du rôle
    const visibleStatuses = allStatuses.filter(status => 
      status.value === 'all' || canAccessDossierType(user?.role, status.value)
    );
    
    return (
      <TabsList className={`grid grid-cols-${Math.min(visibleStatuses.length, 4)} sm:grid-cols-${visibleStatuses.length}`}>
        {visibleStatuses.map(status => (
          <TabsTrigger key={status.value} value={status.value}>{status.label}</TabsTrigger>
        ))}
      </TabsList>
    );
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
            {renderStatusTabs()}
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
            <div className="p-4 text-center">Chargement des dossiers...</div>
          ) : searchFilteredDossiers.length === 0 ? (
            <div className="p-4 text-center">Aucun dossier trouvé</div>
          ) : (
            <DossierList dossiers={searchFilteredDossiers} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DossierListPage;
