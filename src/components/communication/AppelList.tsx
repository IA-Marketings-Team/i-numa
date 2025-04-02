
import React, { useState, useEffect } from 'react';
import { Appel } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunication } from '@/contexts/CommunicationContext';
import { fetchAppelsFiltered } from '@/services/appelService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Eye, Edit, Trash, CalendarIcon, Search, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppelForm } from './AppelForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AppelListProps {
  onlyShowClientAppels?: boolean;
  clientId?: string;
}

const AppelList: React.FC<AppelListProps> = ({ onlyShowClientAppels = false, clientId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { appels, fetchAppels, removeAppel } = useCommunication();
  
  const [loading, setLoading] = useState(false);
  const [filteredAppels, setFilteredAppels] = useState<Appel[]>([]);
  const [selectedAppel, setSelectedAppel] = useState<Appel | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filtres
  const [filters, setFilters] = useState({
    statut: '',
    dateDebut: '',
    dateFin: '',
    codePostal: '',
    agentId: ''
  });
  
  // Etats pour les dialogs
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fonction pour appliquer les filtres
  const applyFilters = async () => {
    setLoading(true);
    
    try {
      const filterParams: any = {};
      
      if (filters.statut) filterParams.statut = filters.statut;
      if (filters.codePostal) filterParams.codePostal = filters.codePostal;
      if (filters.agentId) filterParams.agentId = filters.agentId;
      if (filters.dateDebut) filterParams.dateDebut = new Date(filters.dateDebut);
      if (filters.dateFin) filterParams.dateFin = new Date(filters.dateFin);
      
      // Si on est sur la page d'un client spécifique
      if (onlyShowClientAppels && clientId) {
        filterParams.clientId = clientId;
      }
      
      const filteredData = await fetchAppelsFiltered(filterParams);
      setFilteredAppels(filteredData);
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer les filtres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      statut: '',
      dateDebut: '',
      dateFin: '',
      codePostal: '',
      agentId: ''
    });
    
    // Rafraîchir les appels avec les filtres réinitialisés
    fetchAppels();
  };
  
  // Gestionnaire de changement pour les filtres
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  // Effet pour appliquer les filtres lors du chargement initial
  useEffect(() => {
    if (onlyShowClientAppels && clientId) {
      // Filtrer les appels pour un client spécifique
      const clientAppels = appels.filter(appel => appel.clientId === clientId);
      setFilteredAppels(clientAppels);
    } else {
      // Tous les appels
      setFilteredAppels(appels);
    }
  }, [appels, clientId, onlyShowClientAppels]);
  
  // Effet pour filtrer par onglet (statut)
  useEffect(() => {
    if (activeTab === 'all') {
      if (onlyShowClientAppels && clientId) {
        setFilteredAppels(appels.filter(appel => appel.clientId === clientId));
      } else {
        setFilteredAppels(appels);
      }
    } else {
      const filteredByTab = appels.filter(appel => {
        if (onlyShowClientAppels && clientId && appel.clientId !== clientId) {
          return false;
        }
        return appel.statut === activeTab;
      });
      setFilteredAppels(filteredByTab);
    }
  }, [activeTab, appels, clientId, onlyShowClientAppels]);
  
  // Gestionnaire pour l'affichage détaillé d'un appel
  const handleViewAppel = (appel: Appel) => {
    setSelectedAppel(appel);
    setIsViewDialogOpen(true);
  };
  
  // Gestionnaire pour l'édition d'un appel
  const handleEditAppel = (appel: Appel) => {
    setSelectedAppel(appel);
    setIsEditDialogOpen(true);
  };
  
  // Gestionnaire pour la suppression d'un appel
  const handleDeleteAppel = (appel: Appel) => {
    setSelectedAppel(appel);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirmer la suppression d'un appel
  const confirmDelete = async () => {
    if (!selectedAppel) return;
    
    try {
      await removeAppel(selectedAppel.id);
      
      toast({
        title: "Appel supprimé",
        description: "L'appel a été supprimé avec succès",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedAppel(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'appel:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'appel",
        variant: "destructive"
      });
    }
  };
  
  // Fermeture des dialogues
  const closeDialogs = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedAppel(null);
    fetchAppels(); // Rafraîchir la liste après une action
  };
  
  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy à HH:mm');
  };
  
  // Récupérer les statuts un iques pour les onglets
  const uniqueStatuses = ['all', ...new Set(appels.map(appel => appel.statut))];
  
  // Fonction pour obtenir la couleur de badge en fonction du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'RDV':
        return 'bg-green-500 hover:bg-green-600';
      case 'Vente':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Répondeur':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Injoignable':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'Refus argumentaire':
      case 'Refus intro':
        return 'bg-red-500 hover:bg-red-600';
      case 'Rappel':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'Hors cible':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'planifie':
        return 'bg-blue-200 hover:bg-blue-300';
      case 'effectue':
        return 'bg-green-200 hover:bg-green-300';
      case 'manque':
        return 'bg-red-200 hover:bg-red-300';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="statut-filter">Statut d'appel</Label>
              <Select 
                value={filters.statut} 
                onValueChange={(value) => handleFilterChange('statut', value)}
              >
                <SelectTrigger id="statut-filter">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="RDV">RDV</SelectItem>
                  <SelectItem value="Vente">Vente</SelectItem>
                  <SelectItem value="Répondeur">Répondeur</SelectItem>
                  <SelectItem value="Injoignable">Injoignable</SelectItem>
                  <SelectItem value="Refus argumentaire">Refus argumentaire</SelectItem>
                  <SelectItem value="Refus intro">Refus intro</SelectItem>
                  <SelectItem value="Rappel">Rappel</SelectItem>
                  <SelectItem value="Hors cible">Hors cible</SelectItem>
                  <SelectItem value="planifie">Planifié</SelectItem>
                  <SelectItem value="effectue">Effectué</SelectItem>
                  <SelectItem value="manque">Manqué</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-debut">Date début</Label>
              <Input
                id="date-debut"
                type="date"
                value={filters.dateDebut}
                onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="date-fin">Date fin</Label>
              <Input
                id="date-fin"
                type="date"
                value={filters.dateFin}
                onChange={(e) => handleFilterChange('dateFin', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="code-postal">Code postal</Label>
              <Input
                id="code-postal"
                type="text"
                value={filters.codePostal}
                onChange={(e) => handleFilterChange('codePostal', e.target.value)}
              />
            </div>
            
            {!onlyShowClientAppels && (
              <div>
                <Label htmlFor="agent-id">ID Agent</Label>
                <Input
                  id="agent-id"
                  type="text"
                  value={filters.agentId}
                  onChange={(e) => handleFilterChange('agentId', e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button 
              variant="outline" 
              onClick={resetFilters} 
              className="flex items-center"
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button 
              onClick={applyFilters} 
              className="flex items-center"
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" />
              Appliquer
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Onglets par statut */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex overflow-x-auto pb-2 mb-2">
          <TabsTrigger value="all">Tous</TabsTrigger>
          {uniqueStatuses
            .filter(status => status !== 'all')
            .map(status => (
              <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
            ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-10">
                    <p>Chargement des appels...</p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredAppels.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-10">
                    <p>Aucun appel trouvé</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAppels.map(appel => (
                <Card key={appel.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {appel.entreprise || 'Entreprise non spécifiée'}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{appel.gerant || 'Gérant non spécifié'}</p>
                      </div>
                      <Badge className={`${getStatusColor(appel.statut)}`}>
                        {appel.statut}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm"><strong>Contact:</strong> {appel.contact || 'Non spécifié'}</span>
                        <span className="text-sm"><strong>Email:</strong> {appel.email || 'Non spécifié'}</span>
                        <span className="text-sm"><strong>Code postal:</strong> {appel.codePostal || 'Non spécifié'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <time>{formatDate(appel.date)}</time>
                        <span className="mx-2">•</span>
                        <span>{appel.duree} min</span>
                      </div>
                      
                      {appel.statut === 'RDV' && appel.dateRdv && (
                        <div className="bg-green-50 p-2 rounded border border-green-200 mt-2">
                          <p className="text-sm font-semibold">RDV prévu le {format(new Date(appel.dateRdv), 'dd/MM/yyyy')}{appel.heureRdv ? ` à ${appel.heureRdv}` : ''}</p>
                        </div>
                      )}
                      
                      {appel.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {appel.notes}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewAppel(appel)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditAppel(appel)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAppel(appel)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog pour voir les détails d'un appel */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Détails de l'appel</DialogTitle>
          </DialogHeader>
          {selectedAppel && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Entreprise</h3>
                  <p>{selectedAppel.entreprise || 'Non spécifié'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Gérant</h3>
                  <p>{selectedAppel.gerant || 'Non spécifié'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Contact</h3>
                  <p>{selectedAppel.contact || 'Non spécifié'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>{selectedAppel.email || 'Non spécifié'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Code postal</h3>
                  <p>{selectedAppel.codePostal || 'Non spécifié'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Statut</h3>
                  <Badge className={`${getStatusColor(selectedAppel.statut)}`}>
                    {selectedAppel.statut}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold">Date de contact</h3>
                  <p>{formatDate(selectedAppel.date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Durée</h3>
                  <p>{selectedAppel.duree} minutes</p>
                </div>
                
                {selectedAppel.statut === 'RDV' && selectedAppel.dateRdv && (
                  <>
                    <div>
                      <h3 className="font-semibold">Date RDV</h3>
                      <p>{format(new Date(selectedAppel.dateRdv), 'dd/MM/yyyy')}</p>
                    </div>
                    {selectedAppel.heureRdv && (
                      <div>
                        <h3 className="font-semibold">Heure RDV</h3>
                        <p>{selectedAppel.heureRdv}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold">Commentaires</h3>
                <p className="whitespace-pre-wrap">{selectedAppel.notes || 'Aucun commentaire'}</p>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditAppel(selectedAppel);
                }}>
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour éditer un appel */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Modifier l'appel</DialogTitle>
          </DialogHeader>
          <AppelForm 
            appelId={selectedAppel?.id} 
            onSuccess={closeDialogs} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour confirmer la suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer cet appel ? Cette action est irréversible.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppelList;
