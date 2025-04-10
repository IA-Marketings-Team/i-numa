
import React, { useState, useEffect } from 'react';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Meeting } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MeetingFormProps {
  meetingId?: string | null;
  onSuccess?: () => void;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({ meetingId, onSuccess }) => {
  const { user } = useAuth();
  const { getMeetingById, addMeeting, editMeeting, removeMeeting } = useCommunication();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    titre: string;
    description: string;
    date: string;
    duree: number;
    lien: string;
    type: 'visio' | 'presentiel' | 'telephonique';
    statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque';
    participants: string[];
    newParticipant: string;
  }>({
    titre: '',
    description: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duree: 30,
    lien: '',
    type: 'visio',
    statut: 'planifie',
    participants: user?.id ? [user.id] : [],
    newParticipant: ''
  });

  useEffect(() => {
    const loadMeeting = async () => {
      if (meetingId) {
        setLoading(true);
        try {
          const meeting = await getMeetingById(meetingId);
          if (meeting) {
            setFormData({
              titre: meeting.titre,
              description: meeting.description,
              date: format(new Date(meeting.date), "yyyy-MM-dd'T'HH:mm"),
              duree: meeting.duree,
              lien: meeting.lien,
              type: meeting.type,
              statut: meeting.statut,
              participants: meeting.participants,
              newParticipant: ''
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la réunion:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMeeting();
  }, [meetingId, getMeetingById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddParticipant = () => {
    if (formData.newParticipant.trim() === '') return;
    if (formData.participants.includes(formData.newParticipant)) return;
    
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, prev.newParticipant],
      newParticipant: ''
    }));
  };

  const handleRemoveParticipant = (participantId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(id => id !== participantId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateObj = new Date(formData.date);
      const heure = format(dateObj, 'HH:mm'); // Extract the time from the datetime
      
      const meetingData = {
        titre: formData.titre,
        description: formData.description,
        date: dateObj,
        heure: heure,
        duree: formData.duree,
        lien: formData.lien,
        type: formData.type,
        statut: formData.statut,
        participants: formData.participants
      };
      
      if (meetingId) {
        await editMeeting(meetingId, meetingData);
      } else {
        await addMeeting(meetingData);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la réunion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!meetingId) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réunion?")) {
      setLoading(true);
      try {
        await removeMeeting(meetingId);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Erreur lors de la suppression de la réunion:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titre">Titre</Label>
        <Input
          id="titre"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
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
            min="5"
            step="5"
            value={formData.duree}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select 
            value={formData.type}
            onValueChange={(value: 'visio' | 'presentiel' | 'telephonique') => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visio">Visioconférence</SelectItem>
              <SelectItem value="presentiel">Présentiel</SelectItem>
              <SelectItem value="telephonique">Téléphonique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="statut">Statut</Label>
          <Select 
            value={formData.statut}
            onValueChange={(value: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque') => 
              handleSelectChange('statut', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planifie">Planifiée</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="termine">Terminée</SelectItem>
              <SelectItem value="annule">Annulée</SelectItem>
              <SelectItem value="effectue">Effectuée</SelectItem>
              <SelectItem value="manque">Manquée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lien">Lien de réunion</Label>
        <Input
          id="lien"
          name="lien"
          value={formData.lien}
          onChange={handleChange}
          placeholder="https://meet.google.com/..."
          disabled={formData.type !== 'visio'}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Participants</Label>
        <div className="flex gap-2">
          <Input
            name="newParticipant"
            value={formData.newParticipant}
            onChange={handleChange}
            placeholder="ID du participant"
          />
          <Button 
            type="button"
            onClick={handleAddParticipant}
            variant="secondary"
          >
            Ajouter
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.participants.map(participantId => (
            <Badge key={participantId} variant="secondary" className="flex items-center gap-1">
              {participantId}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleRemoveParticipant(participantId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        {meetingId && (
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
            {meetingId ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
};
