
import React, { useState, useEffect } from 'react';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Email } from '@/types';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';

interface EmailFormProps {
  emailId?: string | null; // Si null, c'est un nouvel email. Sinon, c'est une réponse
  onSuccess?: () => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ emailId, onSuccess }) => {
  const { user } = useAuth();
  const { getEmailById, addEmail } = useCommunication();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    expediteurId: string;
    destinataireIds: string[];
    destinatairesCc: string[];
    destinatairesBcc: string[];
    sujet: string;
    contenu: string;
    pieceJointes: string[];
    dossierLie?: string;
    clientLie?: string;
    newDestinataire: string;
    newCc: string;
    newBcc: string;
    newPieceJointe: string;
  }>({
    expediteurId: user?.id || '',
    destinataireIds: [],
    destinatairesCc: [],
    destinatairesBcc: [],
    sujet: '',
    contenu: '',
    pieceJointes: [],
    dossierLie: undefined,
    clientLie: undefined,
    newDestinataire: '',
    newCc: '',
    newBcc: '',
    newPieceJointe: ''
  });

  useEffect(() => {
    const loadEmail = async () => {
      if (emailId) {
        setLoading(true);
        try {
          const email = await getEmailById(emailId);
          if (email) {
            // C'est une réponse à un email
            setFormData({
              expediteurId: user?.id || '',
              destinataireIds: [email.expediteurId], // Répondre à l'expéditeur original
              destinatairesCc: [],
              destinatairesBcc: [],
              sujet: `Re: ${email.sujet}`,
              contenu: `\n\n-------- Email original --------\nDe: ${email.expediteurId}\nDate: ${email.dateEnvoi.toLocaleString()}\nObjet: ${email.sujet}\n\n${email.contenu}`,
              pieceJointes: [],
              dossierLie: email.dossierLie,
              clientLie: email.clientLie,
              newDestinataire: '',
              newCc: '',
              newBcc: '',
              newPieceJointe: ''
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'email:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEmail();
  }, [emailId, getEmailById, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDestinataire = () => {
    if (formData.newDestinataire.trim() === '') return;
    if (formData.destinataireIds.includes(formData.newDestinataire)) return;
    
    setFormData(prev => ({
      ...prev,
      destinataireIds: [...prev.destinataireIds, prev.newDestinataire],
      newDestinataire: ''
    }));
  };

  const handleRemoveDestinataire = (destinataire: string) => {
    setFormData(prev => ({
      ...prev,
      destinataireIds: prev.destinataireIds.filter(id => id !== destinataire)
    }));
  };

  const handleAddCc = () => {
    if (formData.newCc.trim() === '') return;
    if (formData.destinatairesCc.includes(formData.newCc)) return;
    
    setFormData(prev => ({
      ...prev,
      destinatairesCc: [...prev.destinatairesCc, prev.newCc],
      newCc: ''
    }));
  };

  const handleRemoveCc = (destinataire: string) => {
    setFormData(prev => ({
      ...prev,
      destinatairesCc: prev.destinatairesCc.filter(id => id !== destinataire)
    }));
  };

  const handleAddBcc = () => {
    if (formData.newBcc.trim() === '') return;
    if (formData.destinatairesBcc.includes(formData.newBcc)) return;
    
    setFormData(prev => ({
      ...prev,
      destinatairesBcc: [...prev.destinatairesBcc, prev.newBcc],
      newBcc: ''
    }));
  };

  const handleRemoveBcc = (destinataire: string) => {
    setFormData(prev => ({
      ...prev,
      destinatairesBcc: prev.destinatairesBcc.filter(id => id !== destinataire)
    }));
  };

  const handleAddPieceJointe = () => {
    if (formData.newPieceJointe.trim() === '') return;
    if (formData.pieceJointes.includes(formData.newPieceJointe)) return;
    
    setFormData(prev => ({
      ...prev,
      pieceJointes: [...prev.pieceJointes, prev.newPieceJointe],
      newPieceJointe: ''
    }));
  };

  const handleRemovePieceJointe = (piece: string) => {
    setFormData(prev => ({
      ...prev,
      pieceJointes: prev.pieceJointes.filter(p => p !== piece)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destinataireIds.length === 0) {
      alert("Veuillez ajouter au moins un destinataire");
      return;
    }
    
    setLoading(true);

    try {
      await addEmail({
        expediteurId: formData.expediteurId,
        destinataireIds: formData.destinataireIds,
        destinatairesCc: formData.destinatairesCc,
        destinatairesBcc: formData.destinatairesBcc,
        sujet: formData.sujet,
        contenu: formData.contenu,
        dateEnvoi: new Date(),
        pieceJointes: formData.pieceJointes,
        lu: false,
        dossierLie: formData.dossierLie,
        clientLie: formData.clientLie
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="destinataireIds">À</Label>
        <div className="flex gap-2">
          <Input
            id="newDestinataire"
            name="newDestinataire"
            value={formData.newDestinataire}
            onChange={handleChange}
            placeholder="ID du destinataire"
          />
          <Button 
            type="button"
            onClick={handleAddDestinataire}
            variant="secondary"
            size="icon"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {formData.destinataireIds.map(destinataire => (
            <Badge key={destinataire} variant="secondary" className="flex items-center gap-1">
              {destinataire}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleRemoveDestinataire(destinataire)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destinatairesCc">Cc</Label>
        <div className="flex gap-2">
          <Input
            id="newCc"
            name="newCc"
            value={formData.newCc}
            onChange={handleChange}
            placeholder="ID du destinataire en copie"
          />
          <Button 
            type="button"
            onClick={handleAddCc}
            variant="secondary"
            size="icon"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {formData.destinatairesCc.map(destinataire => (
            <Badge key={destinataire} variant="secondary" className="flex items-center gap-1">
              {destinataire}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleRemoveCc(destinataire)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destinatairesBcc">Bcc</Label>
        <div className="flex gap-2">
          <Input
            id="newBcc"
            name="newBcc"
            value={formData.newBcc}
            onChange={handleChange}
            placeholder="ID du destinataire en copie cachée"
          />
          <Button 
            type="button"
            onClick={handleAddBcc}
            variant="secondary"
            size="icon"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {formData.destinatairesBcc.map(destinataire => (
            <Badge key={destinataire} variant="secondary" className="flex items-center gap-1">
              {destinataire}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleRemoveBcc(destinataire)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sujet">Sujet</Label>
        <Input
          id="sujet"
          name="sujet"
          value={formData.sujet}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contenu">Message</Label>
        <Textarea
          id="contenu"
          name="contenu"
          rows={8}
          value={formData.contenu}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pieceJointes">Pièces jointes</Label>
        <div className="flex gap-2">
          <Input
            id="newPieceJointe"
            name="newPieceJointe"
            value={formData.newPieceJointe}
            onChange={handleChange}
            placeholder="URL de la pièce jointe"
          />
          <Button 
            type="button"
            onClick={handleAddPieceJointe}
            variant="secondary"
            size="icon"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {formData.pieceJointes.map(piece => (
            <Badge key={piece} variant="secondary" className="flex items-center gap-1">
              {piece}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleRemovePieceJointe(piece)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={loading || formData.destinataireIds.length === 0}
        >
          Envoyer
        </Button>
      </div>
    </form>
  );
};
