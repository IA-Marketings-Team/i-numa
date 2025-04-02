
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
              clientId: appel.clientId,
              agentId: appel.agentId,
              date: format(new Date(appel.date), "yyyy-MM-dd'T'HH:mm"),
              duree: appel.duree,
              notes: appel.notes,
              statut: appel.statut,
              entreprise: appel.entreprise || '',
              gerant: appel.gerant || '',
              contact: appel.contact || '',
              email: appel.email || '',
              codePostal: appel.codePostal || '',
              dateRdv: appel.dateRdv ? format(new Date(appel.dateRdv), "yyyy-MM-dd") : undefined,
              heureRdv: appel.heureRdv
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
      const appelData = {
        clientId: formData.clientId,
        agentId: formData.agentId,
        date: new Date(formData.date),
        duree: formData.duree,
        notes: formData.notes,
        statut: formData.statut,
        entreprise: formData.entreprise,
        gerant: formData.gerant,
        contact: formData.contact,
        email: formData.email,
        codePostal: formData.codePostal,
        dateRdv: formData.dateRdv ? new Date(formData.dateRdv) : undefined,
        heureRdv: formData.heureRdv
      };

      if (appelId) {
        await editAppel(appelId, appelData);
      } else {
        await addAppel(appelData);
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
            value={formData.statut}
            onValueChange={(value) => handleSelectChange('statut', value)}
          >
            <SelectTrigger>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded-md bg-gray-50">
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
        <Label htmlFor="notes">Commentaires</Label>
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
