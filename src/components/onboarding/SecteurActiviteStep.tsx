
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useOnboarding } from './OnboardingProvider';
import { supabase } from '@/integrations/supabase/client';

interface SecteurActivite {
  id: string;
  nom: string;
}

const SecteurActiviteStep: React.FC = () => {
  const { secteurActivite, setSecteurActivite } = useOnboarding();
  const [secteurs, setSecteurs] = useState<SecteurActivite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const { data, error } = await supabase
          .from('secteurs_activite')
          .select('id, nom')
          .order('nom');
          
        if (error) throw error;
        
        setSecteurs(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des secteurs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSecteurs();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quel est votre secteur d'activité ?</h3>
      
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Chargement des secteurs...</p>
        </div>
      ) : (
        <RadioGroup
          value={secteurActivite}
          onValueChange={setSecteurActivite}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
        >
          {secteurs.map((secteur) => (
            <div 
              key={secteur.id} 
              className={`border rounded-lg p-2 transition-colors ${
                secteurActivite === secteur.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={secteur.id} id={`secteur-${secteur.id}`} />
                <Label 
                  htmlFor={`secteur-${secteur.id}`} 
                  className="text-xs sm:text-sm cursor-pointer w-full"
                >
                  {secteur.nom}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
      
      {secteurs.length === 0 && !isLoading && (
        <p className="text-muted-foreground">Aucun secteur d'activité disponible.</p>
      )}
    </div>
  );
};

export default SecteurActiviteStep;
