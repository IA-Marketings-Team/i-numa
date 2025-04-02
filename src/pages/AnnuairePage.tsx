
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
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Client } from '@/types';

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
  
  // Formulaire pour la création/modification de client
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  
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
    setValue('nom', client.nom || '');
    setValue('prenom', client.prenom || '');
    setValue('email', client.email || '');
    setValue('telephone', client.telephone || '');
    setValue('adresse', client.adresse || '');
    setValue('ville', client.ville || '');
    setValue('codePostal', client.codePostal || '');
    setValue('secteurActivite', client.secteurActivite || '');
    setValue('typeEntreprise', client.typeEntreprise || '');
    setValue('besoins', client.besoins || '');
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreateNewClient = () => {
    reset({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      secteurActivite: '',
      typeEntreprise: '',
      besoins: ''
    });
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Détails du client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nom</Label>
                <p className="font-medium">{selectedClient.nom || '-'}</p>
              </div>
              <div>
                <Label>Prénom</Label>
                <p className="font-medium">{selectedClient.prenom || '-'}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="font-medium">{selectedClient.email || '-'}</p>
              </div>
              <div>
                <Label>Téléphone</Label>
                <p className="font-medium">{selectedClient.telephone || '-'}</p>
              </div>
              <div>
                <Label>Adresse</Label>
                <p className="font-medium">{selectedClient.adresse || '-'}</p>
              </div>
              <div>
                <Label>Ville</Label>
                <p className="font-medium">{selectedClient.ville || '-'}</p>
              </div>
              <div>
                <Label>Code postal</Label>
                <p className="font-medium">{selectedClient.codePostal || '-'}</p>
              </div>
              <div>
                <Label>Secteur d'activité</Label>
                <p className="font-medium">{selectedClient.secteurActivite || '-'}</p>
              </div>
              <div>
                <Label>Type d'entreprise</Label>
                <p className="font-medium">{selectedClient.typeEntreprise || '-'}</p>
              </div>
              <div className="col-span-2">
                <Label>Besoins</Label>
                <p className="font-medium whitespace-pre-wrap">{selectedClient.besoins || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour créer un nouveau client */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" {...register('nom')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" {...register('prenom')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" {...register('telephone')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" {...register('adresse')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="ville">Ville</Label>
                <Input id="ville" {...register('ville')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="codePostal">Code postal</Label>
                <Input id="codePostal" {...register('codePostal')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="secteurActivite">Secteur d'activité</Label>
                <Input id="secteurActivite" {...register('secteurActivite')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="typeEntreprise">Type d'entreprise</Label>
                <Select onValueChange={(value) => setValue('typeEntreprise', value)} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PME">PME</SelectItem>
                    <SelectItem value="TPE">TPE</SelectItem>
                    <SelectItem value="ETI">ETI</SelectItem>
                    <SelectItem value="Indépendant">Indépendant</SelectItem>
                    <SelectItem value="Profession libérale">Profession libérale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="besoins">Besoins</Label>
                <Textarea id="besoins" {...register('besoins')} rows={4} disabled={loading} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                Créer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour éditer un client */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nom">Nom</Label>
                <Input id="edit-nom" {...register('nom')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-prenom">Prénom</Label>
                <Input id="edit-prenom" {...register('prenom')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" {...register('email')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-telephone">Téléphone</Label>
                <Input id="edit-telephone" {...register('telephone')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-adresse">Adresse</Label>
                <Input id="edit-adresse" {...register('adresse')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-ville">Ville</Label>
                <Input id="edit-ville" {...register('ville')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-codePostal">Code postal</Label>
                <Input id="edit-codePostal" {...register('codePostal')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-secteurActivite">Secteur d'activité</Label>
                <Input id="edit-secteurActivite" {...register('secteurActivite')} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="edit-typeEntreprise">Type d'entreprise</Label>
                <Select 
                  defaultValue={selectedClient?.typeEntreprise}
                  onValueChange={(value) => setValue('typeEntreprise', value)} 
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PME">PME</SelectItem>
                    <SelectItem value="TPE">TPE</SelectItem>
                    <SelectItem value="ETI">ETI</SelectItem>
                    <SelectItem value="Indépendant">Indépendant</SelectItem>
                    <SelectItem value="Profession libérale">Profession libérale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-besoins">Besoins</Label>
                <Textarea id="edit-besoins" {...register('besoins')} rows={4} disabled={loading} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
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
