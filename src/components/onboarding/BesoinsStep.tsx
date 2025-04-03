
import React from 'react';
import { useOnboarding } from './OnboardingProvider';
import { Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BesoinOption {
  id: string;
  name: string;
}

const BesoinsStep: React.FC = () => {
  const { besoins, addBesoin, removeBesoin } = useOnboarding();
  
  const optionsBesoins: BesoinOption[] = [
    { id: 'leads', name: 'Générer des leads / visites en magasin' },
    { id: 'animer', name: 'Animer / créer votre communauté' },
    { id: 'contenu', name: 'Créer des contenus' },
    { id: 'expertise', name: 'Valoriser votre expertise' },
    { id: 'visibilite', name: 'Augmenter votre visibilité / notoriété' },
    { id: 'avis', name: 'Générer des avis positifs' },
    { id: 'efficacite', name: 'Gagner en efficacité' },
    { id: 'fideliser', name: 'Fidéliser vos clients' },
    { id: 'donnees', name: 'Exploiter vos données clients' },
    { id: 'developper', name: 'Développer votre activité' },
    { id: 'piloter', name: 'Piloter votre activité' },
    { id: 'couts', name: 'Diminuer vos coûts' },
  ];
  
  const toggleBesoin = (besoinId: string) => {
    if (besoins.includes(besoinId)) {
      removeBesoin(besoinId);
    } else {
      if (besoins.length >= 3) {
        toast({
          variant: "destructive",
          title: "Limite atteinte",
          description: "Vous ne pouvez sélectionner que 3 besoins maximum."
        });
        return;
      }
      addBesoin(besoinId);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-2">
        Sélectionnez 3 besoins maximum pour votre activité
      </p>
      <p className="text-center text-sm text-muted-foreground mb-6">
        <span className={besoins.length === 3 ? "text-green-500 font-medium" : ""}>
          {besoins.length}
        </span> 
        <span> sélectionné(s) sur 3 maximum</span>
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {optionsBesoins.map((besoin) => (
          <div
            key={besoin.id}
            className={`
              flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors
              ${besoins.includes(besoin.id) ? 'border-primary bg-primary/10' : 'border-muted'}
              ${besoins.length >= 3 && !besoins.includes(besoin.id) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => toggleBesoin(besoin.id)}
          >
            <div 
              className={`
                w-5 h-5 rounded flex items-center justify-center
                ${besoins.includes(besoin.id) ? 'bg-primary text-primary-foreground' : 'border border-muted-foreground'}
              `}
            >
              {besoins.includes(besoin.id) && <Check size={14} />}
            </div>
            <span>{besoin.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BesoinsStep;
