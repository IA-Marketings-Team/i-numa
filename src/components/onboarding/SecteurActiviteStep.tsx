
import React from 'react';
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
  Car
} from 'lucide-react';

interface SecteurOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const SecteurActiviteStep: React.FC = () => {
  const { secteurActivite, setSecteurActivite } = useOnboarding();
  
  const secteurs: SecteurOption[] = [
    { id: 'restaurant', name: 'Restaurant', icon: <UtensilsCrossed size={24} /> },
    { id: 'commerce', name: 'Commerce', icon: <ShoppingBag size={24} /> },
    { id: 'artisan', name: 'Artisan', icon: <Hammer size={24} /> },
    { id: 'batiment', name: 'Bâtiment', icon: <HardHat size={24} /> },
    { id: 'pme', name: 'PME', icon: <Briefcase size={24} /> },
    { id: 'sante', name: 'Santé', icon: <Stethoscope size={24} /> },
    { id: 'education', name: 'Éducation', icon: <GraduationCap size={24} /> },
    { id: 'hotellerie', name: 'Hôtellerie', icon: <Hotel size={24} /> },
    { id: 'automobile', name: 'Automobile', icon: <Car size={24} /> },
    { id: 'autre', name: 'Autre', icon: <Building size={24} /> },
  ];

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        Sélectionnez votre secteur d'activité pour recevoir des offres adaptées à vos besoins
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {secteurs.map((secteur) => (
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
            <span className="font-medium">{secteur.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecteurActiviteStep;
