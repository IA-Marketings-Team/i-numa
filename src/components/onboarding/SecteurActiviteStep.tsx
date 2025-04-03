
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';
import { supabase } from '@/integrations/supabase/client';

interface SecteurActivite {
  id: string;
  nom: string;
  description?: string;
}

const SecteurActiviteStep: React.FC = () => {
  const { secteurActivite, setSecteurActivite } = useOnboarding();
  const [secteurs, setSecteurs] = useState<SecteurActivite[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const { data, error } = await supabase
          .from('secteurs_activite')
          .select('id, nom, description')
          .order('nom');
          
        if (error) {
          console.error('Error fetching secteurs:', error);
          return;
        }
        
        setSecteurs(data || []);
      } catch (error) {
        console.error('Error fetching secteurs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSecteurs();
  }, []);
  
  if (loading) {
    return <div className="text-center py-4">Chargement des secteurs d'activité...</div>;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sélectionnez votre secteur d'activité</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {secteurs.map((secteur) => (
          <Card 
            key={secteur.id}
            className={`cursor-pointer transition-all ${
              secteurActivite === secteur.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:bg-accent'
            }`}
            onClick={() => setSecteurActivite(secteur.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium">{secteur.nom}</h4>
                {secteur.description && (
                  <p className="text-sm text-muted-foreground">{secteur.description}</p>
                )}
              </div>
              
              {secteurActivite === secteur.id && (
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground text-center mt-4">
        Choisissez le secteur d'activité qui correspond le mieux à votre entreprise
      </p>
    </div>
  );
};

export default SecteurActiviteStep;
