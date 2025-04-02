
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunication } from '@/contexts/CommunicationContext';
import { Appel } from '@/types';
import { fetchAppelsFiltered } from '@/services/appelService';
import { fetchClients } from '@/services/clientService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ProspectByClient: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { appels } = useCommunication();
  
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clients, setClients] = useState<any[]>([]);
  const [filteredAppels, setFilteredAppels] = useState<Appel[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Charger la liste des clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const allClients = await fetchClients();
        setClients(allClients);
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
    
    loadClients();
  }, [toast]);
  
  // Filtrer les appels par client
  useEffect(() => {
    if (!selectedClientId) {
      setFilteredAppels([]);
      return;
    }
    
    const getAppelsByClient = async () => {
      try {
        setLoading(true);
        const filtered = await fetchAppelsFiltered({ clientId: selectedClientId });
        setFilteredAppels(filtered);
      } catch (error) {
        console.error("Erreur lors du filtrage des appels par client:", error);
        toast({
          title: "Erreur",
          description: "Impossible de filtrer les appels par client",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getAppelsByClient();
  }, [selectedClientId, toast]);
  
  // Filtrage immédiat (sans requête) pour l'interface utilisateur
  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
  };
  
  return (
    <div className="space-y-6">
      <Card className="border shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="client-select">Sélectionner un client</Label>
              <Select 
                value={selectedClientId}
                onValueChange={handleClientChange}
              >
                <SelectTrigger id="client-select">
                  <SelectValue placeholder="Choisir un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.prenom} {client.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Chargement des données...</p>
        </div>
      ) : selectedClientId ? (
        filteredAppels.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {filteredAppels.map(appel => (
              <Card key={appel.id} className="border shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="pt-4">
                  <h3 className="font-semibold">{appel.entreprise || 'Entreprise non spécifiée'}</h3>
                  <p className="text-sm">Contact: {appel.contact || 'Non spécifié'}</p>
                  <p className="text-sm">Email: {appel.email || 'Non spécifié'}</p>
                  <p className="text-sm">Code postal: {appel.codePostal || 'Non spécifié'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Statut: {appel.statut} • {new Date(appel.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>Aucun appel trouvé pour ce client</p>
          </div>
        )
      ) : (
        <div className="text-center py-10">
          <p>Veuillez sélectionner un client pour voir ses appels</p>
        </div>
      )}
    </div>
  );
};

export default ProspectByClient;
