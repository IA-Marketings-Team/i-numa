
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useOnboarding } from './OnboardingProvider';
import { supabase } from '@/integrations/supabase/client';

interface Besoin {
  id: string;
  nom: string;
}

const BesoinsStep: React.FC = () => {
  const { besoins, addBesoin, removeBesoin } = useOnboarding();
  const [besoinsOptions, setBesoinsOptions] = useState<Besoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch from secteurs_activite table instead of offres
    const fetchBesoins = async () => {
      try {
        const { data, error } = await supabase
          .from('secteurs_activite')
          .select('id, nom')
          .order('nom');
          
        if (error) throw error;
        
        setBesoinsOptions(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des besoins:', error);
        // Fallback to mock data if API fails
        setBesoinsOptions([
          { id: 'site-web', nom: 'Site web' },
          { id: 'seo', nom: 'Référencement naturel (SEO)' },
          { id: 'ads', nom: 'Publicité en ligne' },
          { id: 'social-media', nom: 'Gestion réseaux sociaux' },
          { id: 'email-marketing', nom: 'Email marketing' },
          { id: 'content', nom: 'Création de contenu' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBesoins();
  }, []);
  
  const handleBesoinChange = (besoinId: string, checked: boolean) => {
    if (checked) {
      addBesoin(besoinId);
    } else {
      removeBesoin(besoinId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quels sont vos besoins principaux ?</h3>
      <p className="text-muted-foreground text-sm">Sélectionnez au moins 3 services qui vous intéressent.</p>
      
      {isLoading ? (
        <div className="text-center py-2">
          <p className="text-muted-foreground">Chargement des options...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {besoinsOptions.map((besoin) => (
            <div 
              key={besoin.id} 
              className={`border rounded-lg p-3 transition-colors ${
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
                />
                <Label 
                  htmlFor={`besoin-${besoin.id}`}
                  className="text-sm cursor-pointer w-full"
                >
                  {besoin.nom}
                </Label>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-sm text-muted-foreground mt-2">
        {besoins.length}/3 sélectionnés
      </div>
    </div>
  );
};

export default BesoinsStep;
