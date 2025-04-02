
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

interface AppelFormProps {
  appelId?: string | null;
  onSuccess?: () => void;
}

export const AppelForm: React.FC<AppelFormProps> = ({ appelId, onSuccess }) => {
  const { user } = useAuth();
  const { getAppelById, addAppel, editAppel, removeAppel } = useCommunication();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    clientId: string;
    agentId: string;
    date: string;
    duree: number;
    notes: string;
    statut: 'planifie' | 'effectue' | 'manque';
  }>({
    clientId: '',
    agentId: user?.id || '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duree: 15,
    notes: '',
    statut: 'planifie'
  });

  useEffect(() => {
    const loadAppel = async () => {
      if (appelId) {
        setLoading(true);
        try {
          const appel = await getAppelById(appelId);
          if (appel) {
            setFormData({
              clientId: appel.clientId,
              agentId: appel.agentId,
              date: format(new Date(appel.date), "yyyy-MM-dd'T'HH:mm"),
              duree: appel.duree,
              notes: appel.notes,
              statut: appel.statut
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'appel:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAppel();
  }, [appelId, getAppelById]);

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
      if (appelId) {
        await editAppel(appelId, {
          clientId: formData.clientId,
          agentId: formData.agentId,
          date: new Date(formData.date),
          duree: formData.duree,
          notes: formData.notes,
          statut: formData.statut
        });
      } else {
        await addAppel({
          clientId: formData.clientId,
          agentId: formData.agentId,
          date: new Date(formData.date),
          duree: formData.duree,
          notes: formData.notes,
          statut: formData.statut
        });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'appel:", error);
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
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'appel:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientId">ID du client</Label>
        <Input
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="agentId">ID de l'agent</Label>
        <Input
          id="agentId"
          name="agentId"
          value={formData.agentId}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date et heure</Label>
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
        <Label htmlFor="statut">Statut</Label>
        <Select 
          value={formData.statut}
          onValueChange={(value) => handleSelectChange('statut', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planifie">Planifié</SelectItem>
            <SelectItem value="effectue">Effectué</SelectItem>
            <SelectItem value="manque">Manqué</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
      
      <div className="flex justify-between">
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
        <div className="flex gap-2 ml-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {appelId ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
};
