
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface InformationsStepProps {
  onSubmitSuccess: () => void;
}

const InformationsStep: React.FC<InformationsStepProps> = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    societe: '',
    email: '',
    telephonePortable: '',
    telephoneFixe: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Charger les données utilisateur existantes
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('nom, prenom, email, telephone')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setFormData(prev => ({
              ...prev,
              nom: data.nom || '',
              prenom: data.prenom || '',
              email: data.email || user.email || '',
              telephonePortable: data.telephone || '',
            }));
          } else if (user.email) {
            setFormData(prev => ({
              ...prev,
              email: user.email
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        }
      }
    };
    
    loadUserData();
  }, [user]);
  
  useEffect(() => {
    // Check if all required fields are filled
    const { nom, prenom, fonction, societe, email, telephonePortable } = formData;
    setIsFormValid(
      !!nom && !!prenom && !!fonction && !!societe && !!email && !!telephonePortable
    );
  }, [formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (user?.id) {
        // Mettre à jour le profil de l'utilisateur
        const { error } = await supabase
          .from('profiles')
          .update({
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephonePortable,
            // Stockez d'autres informations pertinentes
            // Ces champs doivent exister dans la table profiles
            // Si la structure de la table est différente, ajustez en conséquence
          })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      // Stocker également les informations dans localStorage comme sauvegarde
      localStorage.setItem('userInfo', JSON.stringify(formData));
      
      toast({
        title: "Informations enregistrées",
        description: "Merci pour vos informations, vous allez être redirigé vers votre espace client.",
      });
      
      onSubmitSuccess();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos informations.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prenom">
            Prénom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nom">
            Nom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fonction">
          Fonction <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fonction"
          name="fonction"
          value={formData.fonction}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="societe">
          Société <span className="text-red-500">*</span>
        </Label>
        <Input
          id="societe"
          name="societe"
          value={formData.societe}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
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
        <Label htmlFor="telephonePortable">
          Téléphone portable <span className="text-red-500">*</span>
        </Label>
        <Input
          id="telephonePortable"
          name="telephonePortable"
          value={formData.telephonePortable}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telephoneFixe">
          Téléphone fixe <span className="text-muted-foreground">(facultatif)</span>
        </Label>
        <Input
          id="telephoneFixe"
          name="telephoneFixe"
          value={formData.telephoneFixe}
          onChange={handleChange}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full mt-6"
        disabled={isSubmitting || !isFormValid}
      >
        {isSubmitting ? 'Enregistrement...' : 'Terminer'}
      </Button>
    </form>
  );
};

export default InformationsStep;
