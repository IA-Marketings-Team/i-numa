
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunication } from '@/contexts/CommunicationContext';
import { Appel } from '@/types';
import { fetchAppelsFiltered } from '@/services/appelService';
import { fetchUsers } from '@/services/userService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ProspectList from './ProspectList';
import { useToast } from '@/hooks/use-toast';

const ProspectByPhoner: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { appels } = useCommunication();
  
  const [selectedPhonerId, setSelectedPhonerId] = useState<string>('');
  const [phoners, setPhoners] = useState<any[]>([]);
  const [filteredAppels, setFilteredAppels] = useState<Appel[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Charger la liste des phoners
  useEffect(() => {
    const loadPhoners = async () => {
      try {
        setLoading(true);
        const allUsers = await fetchUsers();
        const phonerUsers = allUsers.filter(user => 
          user.role === 'agent_phoner' || user.role === 'superviseur'
        );
        setPhoners(phonerUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des phoners:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des phoners",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPhoners();
  }, [toast]);
  
  // Filtrer les appels par phoner
  useEffect(() => {
    if (!selectedPhonerId) {
      setFilteredAppels([]);
      return;
    }
    
    const getAppelsByPhoner = async () => {
      try {
        setLoading(true);
        const filtered = await fetchAppelsFiltered({ agentId: selectedPhonerId });
        setFilteredAppels(filtered);
      } catch (error) {
        console.error("Erreur lors du filtrage des appels par phoner:", error);
        toast({
          title: "Erreur",
          description: "Impossible de filtrer les appels par phoner",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getAppelsByPhoner();
  }, [selectedPhonerId, toast]);
  
  // Filtrage immédiat (sans requête) pour l'interface utilisateur
  const handlePhonerChange = (value: string) => {
    setSelectedPhonerId(value);
  };
  
  return (
    <div className="space-y-6">
      <Card className="border shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="phoner-select">Sélectionner un phoner</Label>
              <Select 
                value={selectedPhonerId}
                onValueChange={handlePhonerChange}
              >
                <SelectTrigger id="phoner-select">
                  <SelectValue placeholder="Choisir un phoner" />
                </SelectTrigger>
                <SelectContent>
                  {phoners.map(phoner => (
                    <SelectItem key={phoner.id} value={phoner.id}>
                      {phoner.prenom} {phoner.nom}
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
      ) : selectedPhonerId ? (
        filteredAppels.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {filteredAppels.map(appel => (
              <Card key={appel.id} className="border shadow-sm hover:shadow-md transition-shadow bg-white">
                {/* Contenu similaire à celui de ProspectList, mais simplifié */}
                <CardContent className="pt-4">
                  <h3 className="font-semibold">{appel.entreprise || 'Entreprise non spécifiée'}</h3>
                  <p className="text-sm">{appel.contact || 'Contact non spécifié'}</p>
                  <p className="text-sm">{appel.email || 'Email non spécifié'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Statut: {appel.statut} • {new Date(appel.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>Aucun appel trouvé pour ce phoner</p>
          </div>
        )
      ) : (
        <div className="text-center py-10">
          <p>Veuillez sélectionner un phoner pour voir ses appels</p>
        </div>
      )}
    </div>
  );
};

export default ProspectByPhoner;
