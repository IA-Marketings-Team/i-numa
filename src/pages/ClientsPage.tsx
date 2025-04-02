
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Eye, MoreHorizontal, Trash, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchClients, deleteClient } from "@/services/clientService";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    loadClients();
  }, []);
  
  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete.id);
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setClientToDelete(null);
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client.",
        variant: "destructive",
      });
    }
  };
  
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.nom.toLowerCase().includes(searchLower) ||
      client.prenom.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.secteurActivite && client.secteurActivite.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => navigate("/dashboard/clients/nouveau")}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un client
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {isLoading ? (
        <div className="text-center p-6">
          <p>Chargement des clients...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Secteur d'activité</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
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
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/clients/${client.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/dossiers/nouveau`, { state: { client } })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Créer un dossier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`tel:${client.telephone}`)}>
                            <PhoneCall className="mr-2 h-4 w-4" />
                            Appeler
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setClientToDelete(client)}
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
      )}
      
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce client seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
