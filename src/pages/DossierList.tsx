
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import DossierList from "@/components/dossier/DossierList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DossierStatus } from "@/types";
import { Plus, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DossierListPage = () => {
  const { filteredDossiers, setStatusFilter, statusFilter } = useDossier();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Filtrer les dossiers en fonction du terme de recherche
  const searchFilteredDossiers = filteredDossiers.filter(
    (dossier) =>
      dossier.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (status: string) => {
    setStatusFilter(status as DossierStatus | 'all');
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Dossiers</CardTitle>
          
          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
            <Button 
              onClick={() => navigate("/dossiers/nouveau")}
              size="sm"
              className="flex items-center gap-2"
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
        
        <div className="bg-background rounded-md border p-1">
          <DossierList dossiers={searchFilteredDossiers} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DossierListPage;
