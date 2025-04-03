
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

const BESOINS = [
  { id: 'site-web', nom: 'Site web' },
  { id: 'referencement', nom: 'Référencement SEO' },
  { id: 'publicite', nom: 'Publicité en ligne' },
  { id: 'email-marketing', nom: 'Email marketing' },
  { id: 'reseaux-sociaux', nom: 'Gestion réseaux sociaux' },
  { id: 'contenu', nom: 'Création de contenu' },
  { id: 'ecommerce', nom: 'E-commerce' },
  { id: 'crm', nom: 'CRM' },
  { id: 'analyse', nom: 'Analyse de données' },
];

const BesoinsStep: React.FC = () => {
  const { besoins, addBesoin, removeBesoin } = useOnboarding();
  
  const toggleBesoin = (besoinId: string) => {
    if (besoins.includes(besoinId)) {
      removeBesoin(besoinId);
    } else {
      addBesoin(besoinId);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quels sont vos besoins principaux ?</h3>
      
      <div className="space-y-4">
        {/* Première rangée - 5 cartes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {BESOINS.slice(0, 5).map((besoin) => (
            <Card 
              key={besoin.id}
              className={`cursor-pointer transition-all ${
                besoins.includes(besoin.id) 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:bg-accent'
              }`}
              onClick={() => toggleBesoin(besoin.id)}
            >
              <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-center w-full">{besoin.nom}</span>
                  {besoins.includes(besoin.id) && (
                    <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Deuxième rangée - 4 cartes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BESOINS.slice(5).map((besoin) => (
            <Card 
              key={besoin.id}
              className={`cursor-pointer transition-all ${
                besoins.includes(besoin.id) 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:bg-accent'
              }`}
              onClick={() => toggleBesoin(besoin.id)}
            >
              <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-center w-full">{besoin.nom}</span>
                  {besoins.includes(besoin.id) && (
                    <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center mt-4">
        Sélectionnez au moins 3 besoins principaux pour votre entreprise
      </p>
      
      <div className="mt-4 text-sm">
        <div className="flex items-center justify-center">
          <span className="font-semibold mr-2">Sélection actuelle:</span>
          <span>{besoins.length} / 3 minimum</span>
        </div>
      </div>
    </div>
  );
};

export default BesoinsStep;
