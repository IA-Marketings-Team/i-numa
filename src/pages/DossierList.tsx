
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import DossierList from "@/components/dossier/DossierList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DossierStatus } from "@/types";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dossiers</h1>
        
        {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
          <Button 
            onClick={() => navigate("/dossiers/nouveau")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau dossier
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs 
          defaultValue={statusFilter} 
          onValueChange={handleStatusChange}
          className="w-full sm:w-auto"
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
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <DossierList dossiers={searchFilteredDossiers} />
    </div>
  );
};

export default DossierListPage;
