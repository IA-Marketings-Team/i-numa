
import React, { useState } from 'react';
import { useOnboarding } from './OnboardingProvider';
import { 
  Building, 
  UtensilsCrossed, 
  ShoppingBag, 
  Hammer, 
  HardHat, 
  Briefcase, 
  Stethoscope, 
  GraduationCap, 
  Hotel, 
  Car,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecteurOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  isMain?: boolean;
}

const SecteurActiviteStep: React.FC = () => {
  const { secteurActivite, setSecteurActivite } = useOnboarding();
  const [showMoreSectors, setShowMoreSectors] = useState(false);
  
  const mainSecteurs: SecteurOption[] = [
    { id: 'restaurant', name: 'Restaurant', icon: <UtensilsCrossed size={24} />, isMain: true },
    { id: 'commerce', name: 'Commerce', icon: <ShoppingBag size={24} />, isMain: true },
    { id: 'artisan', name: 'Artisan', icon: <Hammer size={24} />, isMain: true },
    { id: 'batiment', name: 'Bâtiment', icon: <HardHat size={24} />, isMain: true },
    { id: 'pme', name: 'PME', icon: <Briefcase size={24} />, isMain: true },
    { id: 'sante', name: 'Santé', icon: <Stethoscope size={24} />, isMain: true },
  ];
  
  const additionalSecteurs: SecteurOption[] = [
    { id: 'education', name: 'Éducation', icon: <GraduationCap size={24} /> },
    { id: 'hotellerie', name: 'Hôtellerie', icon: <Hotel size={24} /> },
    { id: 'automobile', name: 'Automobile', icon: <Car size={24} /> },
    { id: 'autre', name: 'Autre', icon: <Building size={24} /> },
  ];

  const allSecteurs = [...mainSecteurs, ...additionalSecteurs];
  const displayedSecteurs = showMoreSectors ? allSecteurs : mainSecteurs;

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        Sélectionnez votre secteur d'activité pour recevoir des offres adaptées à vos besoins
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        {displayedSecteurs.map((secteur) => (
          <div
            key={secteur.id}
            className={`
              flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors
              ${secteurActivite === secteur.id ? 'border-primary bg-primary/10' : 'border-muted'}
            `}
            onClick={() => setSecteurActivite(secteur.id)}
          >
            <div className="p-2 rounded-full bg-muted mb-2">
              {secteur.icon}
            </div>
            <span className="font-medium text-center">{secteur.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="ghost" 
          onClick={() => setShowMoreSectors(!showMoreSectors)}
          className="flex items-center gap-1"
        >
          {showMoreSectors ? 
            <>Moins d'options <ChevronUp size={16} /></> : 
            <>Autres <ChevronDown size={16} /></>
          }
        </Button>
      </div>
    </div>
  );
};

export default SecteurActiviteStep;
