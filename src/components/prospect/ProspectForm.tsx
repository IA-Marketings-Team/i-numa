
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunication } from '@/contexts/CommunicationContext';
import { fetchAppelById, updateAppel, createAppel } from '@/services/appelService';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  entreprise: z.string().optional(),
  gerant: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email("Format d'email invalide").optional().or(z.literal('')),
  codePostal: z.string().optional(),
  statut: z.string(),
  duree: z.string().transform(val => Number(val)),
  notes: z.string().optional(),
  dateRdv: z.string().optional(),
  heureRdv: z.string().optional(),
  age: z.string().optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProspectFormProps {
  appelId?: string;
  onSuccess?: () => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({ appelId, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchAppels } = useCommunication();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!appelId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entreprise: '',
      gerant: '',
      contact: '',
      email: '',
      codePostal: '',
      statut: 'Injoignable',
      duree: '0',
      notes: '',
      dateRdv: '',
      heureRdv: '',
      age: '',
      telephone: '',
      adresse: '',
      ville: '',
    }
  });
  
  useEffect(() => {
    if (appelId) {
      const loadAppel = async () => {
        try {
          setLoading(true);
          const appel = await fetchAppelById(appelId);
          if (appel) {
            form.reset({
              entreprise: appel.entreprise || '',
              gerant: appel.gerant || '',
              contact: appel.contact || '',
              email: appel.email || '',
              codePostal: appel.codePostal || '',
              statut: appel.statut || 'Injoignable',
              duree: appel.duree.toString(),
              notes: appel.notes || '',
              dateRdv: appel.dateRdv ? new Date(appel.dateRdv).toISOString().split('T')[0] : '',
              heureRdv: appel.heureRdv || '',
              age: '', // Champ supplémentaire
              telephone: '', // Champ supplémentaire
              adresse: '', // Champ supplémentaire
              ville: '', // Champ supplémentaire
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la fiche:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger la fiche de prospection",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      loadAppel();
    }
  }, [appelId, form, toast]);
  
  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const appelData = {
        entreprise: data.entreprise,
        gerant: data.gerant,
        contact: data.contact,
        email: data.email,
        codePostal: data.codePostal,
        statut: data.statut,
        duree: data.duree,
        notes: data.notes,
        dateRdv: data.dateRdv ? new Date(data.dateRdv) : undefined,
        heureRdv: data.heureRdv,
        // Ajout des commentaires supplémentaires dans les notes
        notes: `${data.notes || ''}\n\nInformations complémentaires:\nÂge: ${data.age || 'Non spécifié'}\nTéléphone: ${data.telephone || 'Non spécifié'}\nAdresse: ${data.adresse || 'Non spécifié'}\nVille: ${data.ville || 'Non spécifié'}`,
      };
      
      if (isEditing && appelId) {
        await updateAppel(appelId, appelData);
        toast({
          title: "Succès",
          description: "La fiche de prospection a été mise à jour",
        });
      } else {
        await createAppel({
          ...appelData,
          agentId: user.id,
          date: new Date(),
        });
        toast({
          title: "Succès",
          description: "La fiche de prospection a été créée",
        });
      }
      
      fetchAppels();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la fiche:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la fiche de prospection",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entreprise">Entreprise</Label>
          <Input 
            id="entreprise" 
            {...form.register('entreprise')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="gerant">Gérant</Label>
          <Input 
            id="gerant" 
            {...form.register('gerant')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="contact">Nom</Label>
          <Input 
            id="contact" 
            {...form.register('contact')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input 
            id="telephone" 
            {...form.register('telephone')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            {...form.register('email')} 
            disabled={loading}
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="age">Âge</Label>
          <Input 
            id="age" 
            {...form.register('age')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="adresse">Adresse</Label>
          <Input 
            id="adresse" 
            {...form.register('adresse')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="ville">Ville</Label>
          <Input 
            id="ville" 
            {...form.register('ville')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="codePostal">Code postal</Label>
          <Input 
            id="codePostal" 
            {...form.register('codePostal')} 
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select 
            defaultValue={form.getValues('statut')} 
            onValueChange={(value) => form.setValue('statut', value)}
            disabled={loading}
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
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="duree">Durée (minutes)</Label>
          <Input 
            id="duree" 
            type="number" 
            min="0" 
            {...form.register('duree')} 
            disabled={loading}
          />
        </div>
      </div>
      
      {form.watch('statut') === 'RDV' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateRdv">Date RDV</Label>
            <Input 
              id="dateRdv" 
              type="date" 
              {...form.register('dateRdv')} 
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="heureRdv">Heure RDV</Label>
            <Input 
              id="heureRdv" 
              type="time" 
              {...form.register('heureRdv')} 
              disabled={loading}
            />
          </div>
        </div>
      )}
      
      <div>
        <Label htmlFor="notes">Commentaires</Label>
        <Textarea 
          id="notes" 
          {...form.register('notes')} 
          rows={4} 
          disabled={loading}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
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
          className="bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default ProspectForm;
