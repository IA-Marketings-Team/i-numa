
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';
import { supabase } from '@/integrations/supabase/client';

interface Secteur {
  id: string;
  nom: string;
  description?: string;
}

const SecteurActiviteStep: React.FC = () => {
  const { secteurActivite, setSecteurActivite } = useOnboarding();
  const [secteurs, setSecteurs] = useState<Secteur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSecteurs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('secteurs_activite')
          .select('*')
          .order('nom');
        
        if (error) throw error;
        
        setSecteurs(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des secteurs d\'activité:', error);
        // Fallback avec des valeurs par défaut en cas d'erreur
        setSecteurs([
          { id: '1', nom: 'Restauration' },
          { id: '2', nom: 'Commerce' },
          { id: '3', nom: 'Santé' },
          { id: '4', nom: 'Éducation' },
          { id: '5', nom: 'BTP' },
          { id: '6', nom: 'Immobilier' },
          { id: '7', nom: 'Transport' },
          { id: '8', nom: 'Industrie' },
          { id: '9', nom: 'Technologie' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSecteurs();
  }, []);
  
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center">Chargement des secteurs d'activité...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {secteurs.slice(0, 5).map((secteur) => (
                <Card 
                  key={secteur.id}
                  className={`cursor-pointer transition-all ${
                    secteurActivite === secteur.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setSecteurActivite(secteur.id)}
                >
                  <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-center w-full">{secteur.nom}</span>
                      {secteurActivite === secteur.id && (
                        <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {secteurs.slice(5, 9).map((secteur) => (
                <Card 
                  key={secteur.id}
                  className={`cursor-pointer transition-all ${
                    secteurActivite === secteur.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setSecteurActivite(secteur.id)}
                >
                  <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-center w-full">{secteur.nom}</span>
                      {secteurActivite === secteur.id && (
                        <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {secteurs.length > 9 && (
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {secteurs.slice(9).map((secteur) => (
                  <Card 
                    key={secteur.id}
                    className={`cursor-pointer transition-all ${
                      secteurActivite === secteur.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSecteurActivite(secteur.id)}
                  >
                    <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-center w-full">{secteur.nom}</span>
                        {secteurActivite === secteur.id && (
                          <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground text-center mt-4">
        Sélectionnez le secteur d'activité qui correspond le mieux à votre entreprise
      </p>
    </div>
  );
};

export default SecteurActiviteStep;
