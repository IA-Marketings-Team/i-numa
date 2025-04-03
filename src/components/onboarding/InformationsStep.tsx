import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface InformationsStepProps {
  onSubmitSuccess: () => void;
}

const InformationsStep: React.FC<InformationsStepProps> = ({ onSubmitSuccess }) => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save user information (in a real app this would be saved to backend)
      localStorage.setItem('userInfo', JSON.stringify(formData));
      
      toast({
        title: "Informations enregistrées",
        description: "Merci pour vos informations, vous allez être redirigé vers votre espace client.",
      });
      
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
