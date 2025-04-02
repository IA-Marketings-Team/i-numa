
import React, { useState, useEffect } from 'react';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Appel } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '@/services';
import { supabase } from '@/integrations/supabase/client';

interface AppelFormProps {
  appelId?: string | null;
  onSuccess?: () => void;
}

export const AppelForm: React.FC<AppelFormProps> = ({ appelId, onSuccess }) => {
  const { user } = useAuth();
  const { getAppelById, addAppel, editAppel, removeAppel } = useCommunication();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Array<{ id: string, nom: string, prenom: string }>>([]);
  const [agents, setAgents] = useState<Array<{ id: string, nom: string, prenom: string, role: string }>>([]);
  
  const [formData, setFormData] = useState<{
    clientId: string;
    agentId: string;
    date: string;
    duree: number;
    notes: string;
    statut: 'RDV' | 'Vente' | 'Répondeur' | 'Injoignable' | 'Refus argumentaire' | 'Refus intro' | 'Rappel' | 'Hors cible' | 'planifie' | 'effectue' | 'manque';
    entreprise: string;
    gerant: string;
    contact: string;
    email: string;
    codePostal: string;
    dateRdv?: string;
    heureRdv?: string;
  }>({
    clientId: '',
    agentId: user?.id || '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duree: 15,
    notes: '',
    statut: 'planifie',
    entreprise: '',
    gerant: '',
    contact: '',
    email: '',
    codePostal: '',
  });

  // Chargement des clients et agents pour les dropdowns
  useEffect(() => {
    const fetchClientsAndAgents = async () => {
      try {
        // Chargement des clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('profiles')
          .select('id, nom, prenom')
          .eq('role', 'client');
          
        if (clientsError) {
          console.error("Erreur lors du chargement des clients:", clientsError);
          return;
        }
        
        setClients(clientsData || []);
        
        // Chargement des agents
        const { data: agentsData, error: agentsError } = await supabase
          .from('profiles')
          .select('id, nom, prenom, role')
          .in('role', ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']);
          
        if (agentsError) {
          console.error("Erreur lors du chargement des agents:", agentsError);
          return;
        }
        
        setAgents(agentsData || []);
      } catch (error) {
        console.error("Erreur inattendue:", error);
      }
    };
    
    fetchClientsAndAgents();
  }, []);

  // Show fields related to RDV only when statut is RDV
  const showRdvFields = formData.statut === 'RDV';

  useEffect(() => {
    const loadAppel = async () => {
      if (appelId) {
        setLoading(true);
        try {
          const appel = await getAppelById(appelId);
          if (appel) {
            setFormData({
              clientId: appel.clientId || '',
              agentId: appel.agentId || user?.id || '',
              date: format(new Date(appel.date), "yyyy-MM-dd'T'HH:mm"),
              duree: appel.duree,
              notes: appel.notes || '',
              statut: appel.statut,
              entreprise: appel.entreprise || '',
              gerant: appel.gerant || '',
              contact: appel.contact || '',
              email: appel.email || '',
              codePostal: appel.codePostal || '',
              dateRdv: appel.dateRdv ? format(new Date(appel.dateRdv), "yyyy-MM-dd") : undefined,
              heureRdv: appel.heureRdv || ''
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'appel:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de l'appel",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadAppel();
  }, [appelId, getAppelById, user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appelData = {
        clientId: formData.clientId || null,
        agentId: formData.agentId || null,
        date: new Date(formData.date),
        duree: formData.duree,
        notes: formData.notes,
        statut: formData.statut,
        entreprise: formData.entreprise,
        gerant: formData.gerant,
        contact: formData.contact,
        email: formData.email,
        codePostal: formData.codePostal,
        dateRdv: formData.dateRdv ? new Date(formData.dateRdv) : null,
        heureRdv: formData.heureRdv || null
      };

      if (appelId) {
        await editAppel(appelId, appelData);
        toast({
          title: "Succès",
          description: "L'appel a été mis à jour avec succès",
        });
      } else {
        await addAppel(appelData);
        toast({
          title: "Succès",
          description: "L'appel a été ajouté avec succès",
        });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'appel:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de l'appel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!appelId) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet appel?")) {
      setLoading(true);
      try {
        await removeAppel(appelId);
        toast({
          title: "Succès",
          description: "L'appel a été supprimé avec succès",
        });
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'appel:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de l'appel",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entreprise">Nom de l'entreprise</Label>
          <Input
            id="entreprise"
            name="entreprise"
            value={formData.entreprise}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gerant">Nom du gérant</Label>
          <Input
            id="gerant"
            name="gerant"
            value={formData.gerant}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="codePostal">Code postal</Label>
          <Input
            id="codePostal"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <Select
            value={formData.clientId}
            onValueChange={(value) => handleSelectChange('clientId', value)}
          >
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.length === 0 ? (
                <SelectItem value="none" disabled>Aucun client disponible</SelectItem>
              ) : (
                clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.prenom} {client.nom}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="agentId">Agent</Label>
          <Select
            value={formData.agentId}
            onValueChange={(value) => handleSelectChange('agentId', value)}
          >
            <SelectTrigger id="agentId">
              <SelectValue placeholder="Sélectionner un agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.length === 0 ? (
                <SelectItem value="none" disabled>Aucun agent disponible</SelectItem>
              ) : (
                agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.prenom} {agent.nom} ({agent.role})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date de contact</Label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duree">Durée (minutes)</Label>
          <Input
            id="duree"
            name="duree"
            type="number"
            min="1"
            value={formData.duree}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="statut">Statut d'appel</Label>
          <Select 
            value={formData.statut || "planifie"}
            onValueChange={(value) => handleSelectChange('statut', value)}
          >
            <SelectTrigger id="statut">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
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
      </div>

      {/* Champs conditionnels pour RDV */}
      {showRdvFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="space-y-2">
            <Label htmlFor="dateRdv">Date du RDV</Label>
            <Input
              id="dateRdv"
              name="dateRdv"
              type="date"
              value={formData.dateRdv || ''}
              onChange={handleChange}
              required={showRdvFields}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heureRdv">Heure du RDV</Label>
            <Input
              id="heureRdv"
              name="heureRdv"
              type="time"
              value={formData.heureRdv || ''}
              onChange={handleChange}
              required={showRdvFields}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {appelId && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            Supprimer
          </Button>
        )}
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Chargement...' : appelId ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default AppelForm;
