
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingModal } from './OnboardingModal';
import { supabase } from '@/integrations/supabase/client';
import { useOnboarding } from './OnboardingProvider';
import { useToast } from '@/hooks/use-toast';

interface RestrictedOverlayProps {
  children: React.ReactNode;
}

export const RestrictedOverlay = ({ children }: RestrictedOverlayProps) => {
  const { user } = useAuth();
  const { setIsOnboarded } = useOnboarding();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [forceModalClosed, setForceModalClosed] = useState(false);

  useEffect(() => {
    const checkUserDossier = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Only check for client accounts
      if (user.role !== 'client') {
        setIsLoading(false);
        return;
      }

      try {
        // Check if the client has any dossiers
        const { data, error } = await supabase
          .from('dossiers')
          .select('id')
          .eq('client_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error checking dossiers:', error);
          setIsLoading(false);
          return;
        }

        // If no dossiers found and not forced closed, show the onboarding modal
        setShowModal(data.length === 0 && !forceModalClosed);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking dossiers:', error);
        setIsLoading(false);
      }
    };

    checkUserDossier();
  }, [user, forceModalClosed, setIsOnboarded]);

  const handleCloseModal = () => {
    setForceModalClosed(true);
    setShowModal(false);
    toast({
      title: "Profil complété",
      description: "Vos informations ont été sauvegardées avec succès."
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <>
      {children}
      {showModal && <OnboardingModal onClose={handleCloseModal} />}
    </>
  );
};

export default RestrictedOverlay;
