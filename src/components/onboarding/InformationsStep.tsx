
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from './OnboardingProvider';

interface InformationsStepProps {
  onSubmitSuccess: () => void;
}

const InformationsStep: React.FC<InformationsStepProps> = ({ onSubmitSuccess }) => {
  const { updateInformations, informations } = useOnboarding();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    societe: '',
    email: '',
    telephonePortable: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    // Check if required fields are filled (only email and telephone portable)
    const { email, telephonePortable } = formData;
    setIsFormValid(!!email && !!telephonePortable);
  }, [formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update onboarding context
    if (name === 'address' || name === 'city' || name === 'postalCode') {
      updateInformations(name, value);
    }
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
      // Update information in context
      updateInformations('address', formData.fonction);
      updateInformations('city', formData.societe);
      updateInformations('postalCode', formData.telephonePortable);
      
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Votre prénom"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Votre nom"
          />
        </div>
      
        <div className="space-y-1">
          <Label htmlFor="fonction">Fonction</Label>
          <Input
            id="fonction"
            name="fonction"
            value={formData.fonction}
            onChange={handleChange}
            placeholder="Votre fonction"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="societe">Société</Label>
          <Input
            id="societe"
            name="societe"
            value={formData.societe}
            onChange={handleChange}
            placeholder="Nom de votre société"
          />
        </div>
      
        <div className="space-y-1">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="telephonePortable">
            Téléphone portable <span className="text-red-500">*</span>
          </Label>
          <Input
            id="telephonePortable"
            name="telephonePortable"
            value={formData.telephonePortable}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
            required
          />
        </div>
      </div>
    </form>
  );
};

export default InformationsStep;
