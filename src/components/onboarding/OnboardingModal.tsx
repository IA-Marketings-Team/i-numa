
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingProvider';
import SecteurActiviteStep from './SecteurActiviteStep';
import BesoinsStep from './BesoinsStep';
import InformationsStep from './InformationsStep';

export const OnboardingModal = () => {
  const { 
    currentStep,
    nextStep,
    prevStep,
    isStepCompleted,
    isLastStep,
    secteurActivite,
    besoins,
    completeOnboarding,
    isOpen,
    setIsOpen 
  } = useOnboarding();
  
  // Force the modal to stay open (prevent closing on outside click)
  useEffect(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen, setIsOpen]);

  const handleComplete = async () => {
    await completeOnboarding();
  };

  // Calculate step progress percentage
  const progressPercentage = ((currentStep + 1) / 3) * 100;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only allow opening, prevent closing
      if (open) setIsOpen(open);
    }}>
      <DialogContent className="max-w-2xl p-6" onClose={(e) => {
        // Prevent closing the dialog by hitting Escape
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Complétez votre profil pour accéder à tous les services
          </DialogTitle>
          
          {/* Step indicator */}
          <div className="mt-4 mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Étape {currentStep + 1} sur 3</span>
              <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </DialogHeader>
        
        {/* Step content */}
        <div className="py-4">
          {currentStep === 0 && <SecteurActiviteStep />}
          {currentStep === 1 && <BesoinsStep />}
          {currentStep === 2 && <InformationsStep />}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 0 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
            >
              Retour
            </Button>
          ) : (
            <div></div> // Placeholder for flex alignment
          )}
          
          {!isLastStep ? (
            <Button 
              onClick={nextStep}
              disabled={!isStepCompleted(currentStep)}
            >
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!isStepCompleted(currentStep)}
            >
              Terminer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
