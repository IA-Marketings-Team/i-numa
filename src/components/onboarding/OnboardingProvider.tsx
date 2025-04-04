
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define the context
interface OnboardingContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  secteurActivite: string;
  setSecteurActivite: (id: string) => void;
  besoins: string[];
  addBesoin: (id: string) => void;
  removeBesoin: (id: string) => void;
  informations: {
    address: string;
    city: string;
    postalCode: string;
  };
  updateInformations: (key: string, value: string) => void;
  isStepCompleted: (step: number) => boolean;
  completeOnboarding: () => Promise<void>;
  isLastStep: boolean;
  setIsOnboarded: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [secteurActivite, setSecteurActivite] = useState('');
  const [besoins, setBesoins] = useState<string[]>([]);
  const [informations, setInformations] = useState({
    address: '',
    city: '',
    postalCode: '',
  });
  
  const isLastStep = currentStep === 2;
  
  // Add a state to track if onboarding is completed
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    // Check localStorage for saved state
    const savedState = localStorage.getItem('isOnboarded');
    return savedState === 'true';
  });
  
  const nextStep = () => {
    if (currentStep < 2 && isStepCompleted(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const addBesoin = (id: string) => {
    setBesoins([...besoins, id]);
  };
  
  const removeBesoin = (id: string) => {
    setBesoins(besoins.filter(besoinId => besoinId !== id));
  };
  
  const updateInformations = (key: string, value: string) => {
    setInformations({
      ...informations,
      [key]: value,
    });
  };
  
  const isStepCompleted = (step: number): boolean => {
    switch(step) {
      case 0:
        return secteurActivite !== '';
      case 1:
        return besoins.length > 0 && besoins.length <= 3;
      case 2:
        // Check if the third step is completed (both address and postalCode are required)
        return informations.address !== '' && 
               informations.city !== '' && 
               informations.postalCode !== '';
      default:
        return false;
    }
  };
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      // Save onboarding data to profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          secteur_activite: secteurActivite,
          besoins: besoins.join(','),
          adresse: informations.address,
          ville: informations.city,
          code_postal: informations.postalCode
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Set onboarding as completed
      setIsOnboarded(true);
      localStorage.setItem('isOnboarded', 'true');
      
      // Close the modal
      setIsOpen(false);
      
      toast({
        title: "Profil complété",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      // Redirect to marketplace
      navigate('/marketplace');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos informations.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        isOpen,
        setIsOpen,
        currentStep,
        nextStep,
        prevStep,
        secteurActivite,
        setSecteurActivite,
        besoins,
        addBesoin,
        removeBesoin,
        informations,
        updateInformations,
        isStepCompleted,
        completeOnboarding,
        isLastStep,
        setIsOnboarded,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
