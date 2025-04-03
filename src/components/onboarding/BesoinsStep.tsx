
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useOnboarding } from './OnboardingProvider';

const predefinedBesoins = [
  { id: 'generer-leads', nom: 'Générer des leads' },
  { id: 'animer', nom: 'Animer' },
  { id: 'creer-contenus', nom: 'Créer des contenus' },
  { id: 'valoriser-expertises', nom: 'Valoriser vos expertises' },
  { id: 'augmenter-visibilite', nom: 'Augmenter visibilité' },
  { id: 'generer-avis', nom: 'Générer des avis positifs' },
  { id: 'gagner-efficacite', nom: 'Gagner en efficacité' },
  { id: 'fideliser-clients', nom: 'Fidéliser vos clients' },
  { id: 'exploiter-donnees', nom: 'Exploiter données clients' },
  { id: 'developper-activite', nom: 'Développer activité' },
  { id: 'piloter-activite', nom: 'Piloter votre activité' },
  { id: 'diminuer-couts', nom: 'Diminuer vos coûts' },
];

const BesoinsStep: React.FC = () => {
  const { besoins, addBesoin, removeBesoin } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBesoinChange = (besoinId: string, checked: boolean) => {
    if (checked) {
      // Only add if we haven't reached the max of 3
      if (besoins.length < 3) {
        addBesoin(besoinId);
      }
    } else {
      removeBesoin(besoinId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quels sont vos besoins principaux ?</h3>
      <p className="text-muted-foreground text-sm">Sélectionnez jusqu'à 3 besoins qui vous intéressent.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {predefinedBesoins.map((besoin) => (
          <div 
            key={besoin.id} 
            className={`border rounded-lg p-2 transition-colors ${
              besoins.includes(besoin.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`besoin-${besoin.id}`}
                checked={besoins.includes(besoin.id)}
                onCheckedChange={(checked) => handleBesoinChange(besoin.id, checked === true)}
                disabled={!besoins.includes(besoin.id) && besoins.length >= 3}
              />
              <Label 
                htmlFor={`besoin-${besoin.id}`}
                className="text-xs sm:text-sm cursor-pointer w-full"
              >
                {besoin.nom}
              </Label>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-sm text-muted-foreground mt-2">
        {besoins.length}/3 sélectionnés
      </div>
    </div>
  );
};

export default BesoinsStep;
