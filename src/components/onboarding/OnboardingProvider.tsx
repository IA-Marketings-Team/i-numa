
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingState {
  isOnboarded: boolean;
  isOnboardingRequired: boolean;
  currentStep: number;
  secteurActivite: string;
  besoins: string[];
  restrictInterface: boolean;
  setIsOnboarded: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  setSecteurActivite: (secteur: string) => void;
  addBesoin: (besoin: string) => void;
  removeBesoin: (besoin: string) => void;
  resetBesoins: () => void;
  completeOnboarding: () => void;
  setRestrictInterface: (restrict: boolean) => void;
  saveOnboardingData: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOnboarded, setIsOnboarded] = useState<boolean>(
    localStorage.getItem('isOnboarded') === 'true'
  );
  const [isOnboardingRequired, setIsOnboardingRequired] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [secteurActivite, setSecteurActivite] = useState<string>('');
  const [besoins, setBesoins] = useState<string[]>([]);
  const [restrictInterface, setRestrictInterface] = useState<boolean>(false);
  
  // Charger les données d'onboarding depuis le profil utilisateur si elles existent
  useEffect(() => {
    const loadUserOnboardingData = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('secteur_activite, besoins')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            // Si l'utilisateur a déjà des données d'onboarding
            if (data.secteur_activite) {
              setSecteurActivite(data.secteur_activite);
            }
            
            if (data.besoins) {
              // Si besoins est stocké comme une chaîne, le convertir en tableau
              if (typeof data.besoins === 'string') {
                setBesoins(data.besoins.split(','));
              } else if (Array.isArray(data.besoins)) {
                setBesoins(data.besoins);
              }
            }
            
            // Si l'utilisateur a complété son onboarding précédemment
            if (data.secteur_activite && data.besoins) {
              setIsOnboarded(true);
              localStorage.setItem('isOnboarded', 'true');
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données d'onboarding:", error);
        }
      }
    };
    
    if (!isLoading && user) {
      loadUserOnboardingData();
    }
  }, [user, isLoading]);
  
  // Check if user needs onboarding after login
  useEffect(() => {
    if (!isLoading && user && user.role === 'client' && !isOnboarded) {
      // Only show onboarding if user is logged in, not onboarded yet, and not on login/register page
      const isAuthPage = ['/login', '/register', '/connexion', '/inscription'].some(
        path => location.pathname.startsWith(path)
      );
      setIsOnboardingRequired(!isAuthPage);
    } else {
      setIsOnboardingRequired(false);
    }
  }, [user, isLoading, isOnboarded, location.pathname]);
  
  const addBesoin = (besoin: string) => {
    if (!besoins.includes(besoin) && besoins.length < 3) {
      setBesoins([...besoins, besoin]);
    }
  };
  
  const removeBesoin = (besoin: string) => {
    setBesoins(besoins.filter(b => b !== besoin));
  };
  
  const resetBesoins = () => {
    setBesoins([]);
  };
  
  // Fonction pour sauvegarder les données d'onboarding dans la base de données
  const saveOnboardingData = async () => {
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            secteur_activite: secteurActivite,
            besoins: besoins.join(',')
          })
          .eq('id', user.id);
          
        if (error) throw error;
        
        return Promise.resolve();
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des données d'onboarding:", error);
        return Promise.reject(error);
      }
    }
    return Promise.resolve();
  };
  
  const completeOnboarding = async () => {
    try {
      await saveOnboardingData();
      setIsOnboarded(true);
      localStorage.setItem('isOnboarded', 'true');
      setRestrictInterface(true);
      navigate('/marketplace');
    } catch (error) {
      console.error("Erreur lors de la complétion de l'onboarding:", error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarded,
        isOnboardingRequired,
        currentStep,
        secteurActivite,
        besoins,
        restrictInterface,
        setIsOnboarded,
        setCurrentStep,
        setSecteurActivite,
        addBesoin,
        removeBesoin,
        resetBesoins,
        completeOnboarding,
        setRestrictInterface,
        saveOnboardingData
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
