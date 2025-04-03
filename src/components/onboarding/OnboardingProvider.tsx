
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // Check if user needs onboarding after login
  useEffect(() => {
    if (!isLoading && user && !isOnboarded) {
      // Only show onboarding if user is logged in, not onboarded yet, and not on login/register page
      const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
      setIsOnboardingRequired(!isAuthPage);
    } else {
      setIsOnboardingRequired(false);
    }
  }, [user, isLoading, isOnboarded, location.pathname]);
  
  const addBesoin = (besoin: string) => {
    if (!besoins.includes(besoin)) {
      setBesoins([...besoins, besoin]);
    }
  };
  
  const removeBesoin = (besoin: string) => {
    setBesoins(besoins.filter(b => b !== besoin));
  };
  
  const resetBesoins = () => {
    setBesoins([]);
  };
  
  const completeOnboarding = () => {
    setIsOnboarded(true);
    localStorage.setItem('isOnboarded', 'true');
    setRestrictInterface(true);
    navigate('/marketplace');
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
        setRestrictInterface
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
