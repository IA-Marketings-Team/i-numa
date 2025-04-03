
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from './OnboardingProvider';
import OnboardingModal from './OnboardingModal';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const RestrictedOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboardingRequired, restrictInterface, setRestrictInterface } = useOnboarding();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [isCheckingAppointment, setIsCheckingAppointment] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Ces paths seront toujours accessibles indépendamment des restrictions
  const allowedPaths = ['/login', '/register', '/connexion', '/inscription', '/agenda'];
  const isAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));
  
  // Vérifier si l'utilisateur a déjà un rendez-vous
  useEffect(() => {
    const checkAppointment = async () => {
      setIsCheckingAppointment(true);
      
      if (user && user.id && user.role === 'client') {
        try {
          // Vérifier dans la table rendez_vous
          const { data: appointmentData, error: appointmentError } = await supabase
            .from('rendez_vous')
            .select('*')
            .eq('client_id', user.id)
            .limit(1);
            
          if (appointmentError) throw appointmentError;
          
          // Si l'utilisateur a un rendez-vous, ne pas afficher les pop-ups d'onboarding
          if (appointmentData && appointmentData.length > 0) {
            setHasAppointment(true);
            setRestrictInterface(false);
          } else {
            // Si pas de rendez-vous, vérifier s'il y a un rendez-vous dans les dossiers
            const { data: dossierData, error: dossierError } = await supabase
              .from('dossiers')
              .select('*')
              .eq('client_id', user.id)
              .not('date_rdv', 'is', null)
              .limit(1);
              
            if (dossierError) throw dossierError;
            
            setHasAppointment(dossierData && dossierData.length > 0);
            setRestrictInterface(!(dossierData && dossierData.length > 0));
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des rendez-vous:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de vérifier vos rendez-vous. Veuillez réessayer."
          });
          setHasAppointment(false);
        }
      } else {
        // Si l'utilisateur n'est pas un client, ne pas restreindre l'interface
        if (user && user.role !== 'client') {
          setRestrictInterface(false);
        }
      }
      
      setIsCheckingAppointment(false);
    };
    
    checkAppointment();
  }, [user, setRestrictInterface]);
  
  // Afficher le modal d'onboarding uniquement si l'utilisateur est un client, n'a pas de rendez-vous, et un onboarding est requis
  useEffect(() => {
    if (user?.role === 'client' && isOnboardingRequired && !hasAppointment && !isCheckingAppointment) {
      setShowOnboardingModal(true);
    }
  }, [isOnboardingRequired, hasAppointment, user, isCheckingAppointment]);
  
  const handleNavigateToAgenda = () => {
    navigate('/agenda');
  };
  
  if (isCheckingAppointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Vérification de vos rendez-vous...</p>
        </div>
      </div>
    );
  }
  
  if (!isOnboardingRequired && !restrictInterface) {
    return <>{children}</>;
  }
  
  return (
    <>
      {/* Onboarding Modal */}
      {showOnboardingModal && user?.role === 'client' && !hasAppointment && (
        <OnboardingModal
          open={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}
      
      {/* Soit montrer l'overlay de restriction, soit le contenu normal */}
      {restrictInterface && !isAllowedPath && !hasAppointment && user?.role === 'client' ? (
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
