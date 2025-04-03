
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from './OnboardingProvider';
import OnboardingModal from './OnboardingModal';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const RestrictedOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboardingRequired, restrictInterface, setRestrictInterface } = useOnboarding();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // These paths will always be accessible regardless of restrictions
  const allowedPaths = ['/login', '/register', '/agenda'];
  const isAllowedPath = allowedPaths.includes(location.pathname);
  
  // Handle onboarding modal
  useEffect(() => {
    if (isOnboardingRequired) {
      setShowOnboardingModal(true);
    }
  }, [isOnboardingRequired]);
  
  const handleNavigateToAgenda = () => {
    navigate('/agenda');
  };
  
  if (!isOnboardingRequired && !restrictInterface) {
    return <>{children}</>;
  }
  
  return (
    <>
      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <OnboardingModal
          open={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}
      
      {/* Either show restricted overlay or normal content */}
      {restrictInterface && !isAllowedPath ? (
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
