
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from './OnboardingProvider';
import OnboardingModal from './OnboardingModal';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const RestrictedOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboardingRequired, restrictInterface, setRestrictInterface } = useOnboarding();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [hasDossier, setHasDossier] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Ces paths seront toujours accessibles indépendamment des restrictions
  const allowedPaths = ['/login', '/register', '/agenda', '/connexion', '/inscription'];
  const isAllowedPath = allowedPaths.some(path => location.pathname === path);
  
  // Vérifier si le client a déjà un dossier
  useEffect(() => {
    const checkClientDossier = async () => {
      if (user && user.id && user.role === 'client') {
        try {
          // Requête pour vérifier si un dossier existe pour ce client
          const { data, error } = await supabase
            .from('dossiers')
            .select('id')
            .eq('client_id', user.id)
            .limit(1);
            
          if (error) throw error;
          
          setHasDossier(data && data.length > 0);
        } catch (error) {
          console.error('Erreur lors de la vérification des dossiers:', error);
          setHasDossier(false);
        }
      } else {
        // Si l'utilisateur n'est pas un client, il n'a pas besoin de passer par l'onboarding
        setHasDossier(true);
      }
    };
    
    checkClientDossier();
  }, [user]);
  
  // Afficher le modal d'onboarding uniquement si l'utilisateur est un client sans dossier
  useEffect(() => {
    if (isOnboardingRequired && !hasDossier && user?.role === 'client') {
      setShowOnboardingModal(true);
    } else if (hasDossier || user?.role !== 'client') {
      // Si l'utilisateur a un dossier ou n'est pas un client, ne pas restreindre l'interface
      setRestrictInterface(false);
    }
  }, [isOnboardingRequired, hasDossier, setRestrictInterface, user]);
  
  const handleNavigateToAgenda = () => {
    navigate('/agenda');
  };
  
  if (!isOnboardingRequired && !restrictInterface) {
    return <>{children}</>;
  }
  
  return (
    <>
      {/* Onboarding Modal */}
      {showOnboardingModal && !hasDossier && user?.role === 'client' && (
        <OnboardingModal
          open={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          closeOnOutsideClick={false}
        />
      )}
      
      {/* Soit montrer l'overlay de restriction, soit le contenu normal */}
      {restrictInterface && !isAllowedPath && !hasDossier && user?.role === 'client' ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Votre prochaine étape</h2>
            <p className="mb-6 text-muted-foreground">
              Pour pouvoir accéder à toutes les fonctionnalités de votre espace, 
              vous devez d'abord planifier un rendez-vous avec l'un de nos conseillers.
            </p>
            
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleNavigateToAgenda}
            >
              Prendre rendez-vous
            </Button>
            
            <p className="mt-4 text-sm text-muted-foreground">
              Une fois votre rendez-vous confirmé, vous aurez accès à l'ensemble de la plateforme.
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default RestrictedOverlay;
