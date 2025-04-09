
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Eye, Edit, Trash, Plus, Search, RefreshCw } from 'lucide-react';
import { fetchClients, fetchClientById, createClient, updateClient, deleteClient } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';
import { User, Client } from '@/types';
import ClientForm from '@/components/client/ClientForm';

const AnnuairePage: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // États pour les dialogues
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Chargement des clients
  useEffect(() => {
    loadClients();
  }, []);
  
  // Filtrage des clients en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      client.nom?.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.prenom?.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.telephone?.includes(searchTerm) ||
      client.adresse?.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.codePostal?.includes(searchTerm)
    );
    
    setFilteredClients(filtered);
  }, [searchTerm, clients]);
  
  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };
  
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreateNewClient = () => {
    setIsCreateDialogOpen(true);
  };
  
  const onSubmitCreate = async (data: any) => {
    try {
      setLoading(true);
      await createClient({
        ...data,
        role: 'client',
        dateCreation: new Date()
      });
      
      toast({
        title: "Succès",
        description: "Client créé avec succès",
      });
      
      setIsCreateDialogOpen(false);
      loadClients();
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmitEdit = async (data: any) => {
    if (!selectedClient) return;
    
    try {
      setLoading(true);
      await updateClient(selectedClient.id, data);
      
      toast({
        title: "Succès",
        description: "Client mis à jour avec succès",
      });
      
      setIsEditDialogOpen(false);
      setSelectedClient(null);
      loadClients();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le client",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = async () => {
    if (!selectedClient) return;
    
    try {
      setLoading(true);
      await deleteClient(selectedClient.id);
      
      toast({
        title: "Succès",
        description: "Client supprimé avec succès",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
      loadClients();
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent">Annuaire des clients</h1>
        <Button 
          onClick={handleCreateNewClient}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Nouveau client
        </Button>
      </div>
      
      {/* Barre de recherche */}
      <Card className="border shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={loadClients}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Liste des clients */}
      <Card className="border-0 shadow-md bg-card-gradient">
        <CardHeader>
          <CardTitle>Répertoire des clients</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <p>Chargement des clients...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <p>Aucun client trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom / Entreprise</TableHead>
                  <TableHead>Prénom / Gérant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Code postal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell>{client.nom || '-'}</TableCell>
                    <TableCell>{client.prenom || '-'}</TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell>{client.telephone || '-'}</TableCell>
                    <TableCell>{client.codePostal || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog pour voir les détails d'un client */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Nom / Entreprise</span>
                <p className="font-medium">{selectedClient.nom || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Prénom / Gérant</span>
                <p className="font-medium">{selectedClient.prenom || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium">{selectedClient.email || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Téléphone</span>
                <p className="font-medium">{selectedClient.telephone || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Adresse</span>
                <p className="font-medium">{selectedClient.adresse || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Code postal</span>
                <p className="font-medium">{selectedClient.codePostal || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Ville</span>
                <p className="font-medium">{selectedClient.ville || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Statut juridique</span>
                <p className="font-medium">{selectedClient.statutJuridique || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Secteur d'activité</span>
                <p className="font-medium">{selectedClient.secteurActivite || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Type d'entreprise</span>
                <p className="font-medium">{selectedClient.typeEntreprise || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Site web</span>
                <p className="font-medium">{selectedClient.siteWeb || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Moyens de communication</span>
                <p className="font-medium">
                  {selectedClient.moyensCommunication && selectedClient.moyensCommunication.length > 0 
                    ? selectedClient.moyensCommunication.join(', ') 
                    : '-'}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-500">Activité détaillée</span>
                <p className="font-medium">{selectedClient.activiteDetail || '-'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-500">Besoins</span>
                <p className="font-medium whitespace-pre-wrap">{selectedClient.besoins || '-'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-500">Commentaires</span>
                <p className="font-medium whitespace-pre-wrap">{selectedClient.commentaires || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour créer un nouveau client */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau client</DialogTitle>
          </DialogHeader>
          <ClientForm 
            onSubmit={onSubmitCreate} 
            isLoading={loading} 
            onCancel={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour éditer un client */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm 
              client={selectedClient}
              onSubmit={onSubmitEdit} 
              isLoading={loading} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour confirmer la suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnuairePage;
