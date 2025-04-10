
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { fetchClients } from "@/services/client/clientService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Trash, 
  PhoneCall, 
  Download, 
  Upload 
} from "lucide-react";
import { format } from "date-fns";
import ClientImportModal from "./ClientImportModal";

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  useEffect(() => {
    loadClients();
  }, []);
  
  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des clients",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportCSV = () => {
    const headers = [
      "ID", 
      "Nom", 
      "Prénom", 
      "Email", 
      "Téléphone", 
      "Adresse", 
      "Code Postal", 
      "Ville",
      "Secteur d'activité", 
      "Type d'entreprise"
    ];
    
    const csvData = clients.map(client => [
      client.id,
      client.nom,
      client.prenom,
      client.email,
      client.telephone || "",
      client.adresse || "",
      client.codePostal || "",
      client.ville || "",
      client.secteurActivite || "",
      client.typeEntreprise || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.nom.toLowerCase().includes(searchLower) ||
      client.prenom.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.telephone && client.telephone.toLowerCase().includes(searchLower)) ||
      (client.secteurActivite && client.secteurActivite.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Clients</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/clients/nouveau")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nouveau client
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Secteur d'activité</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Chargement des clients...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.prenom} {client.nom}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.telephone || "Non renseigné"}</TableCell>
                      <TableCell>{client.secteurActivite || "Non spécifié"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dossiers/nouveau`, { state: { client } })}>
                              <Plus className="mr-2 h-4 w-4" />
                              Créer un dossier
                            </DropdownMenuItem>
                            {client.telephone && (
                              <DropdownMenuItem onClick={() => window.open(`tel:${client.telephone}`)}>
                                <PhoneCall className="mr-2 h-4 w-4" />
                                Appeler
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => navigate(`/clients/${client.id}/delete`)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Aucun client trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <ClientImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={loadClients}
      />
    </div>
  );
};

export default ClientList;
