
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
      <DialogContent className="max-w-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">
            Complétez votre profil
          </DialogTitle>
          
          {/* Step indicator */}
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs">Étape {currentStep + 1}/3</span>
              <span className="text-xs font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </DialogHeader>
        
        {/* Step content */}
        <div className="py-2">
          {currentStep === 0 && <SecteurActiviteStep />}
          {currentStep === 1 && <BesoinsStep />}
          {currentStep === 2 && <InformationsStep onSubmitSuccess={handleComplete} />}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          {currentStep > 0 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
              size="sm"
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
              size="sm"
            >
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!isStepCompleted(currentStep)}
              size="sm"
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
