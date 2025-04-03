
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingProvider';
import SecteurActiviteStep from './SecteurActiviteStep';
import BesoinsStep from './BesoinsStep';
import InformationsStep from './InformationsStep';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onClose }) => {
  const { 
    currentStep, 
    setCurrentStep, 
    secteurActivite, 
    besoins, 
    completeOnboarding 
  } = useOnboarding();
  
  const navigate = useNavigate();
  
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  useEffect(() => {
    // Validation logic for each step
    switch (currentStep) {
      case 1:
        setIsNextDisabled(secteurActivite === '');
        break;
      case 2:
        setIsNextDisabled(besoins.length < 1); // Au moins 1 besoin sélectionné
        break;
      case 3:
        // This is handled within the InformationsStep component
        setIsNextDisabled(false);
        break;
      default:
        setIsNextDisabled(true);
    }
  }, [currentStep, secteurActivite, besoins]);
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      onClose();
      navigate('/marketplace');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            className={`flex items-center ${step < 3 ? 'w-1/3' : ''}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step === currentStep 
                  ? 'bg-primary text-primary-foreground'
                  : step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            
            {step < 3 && (
              <div 
                className={`h-1 flex-1 ${
                  step < currentStep ? 'bg-green-500' : 'bg-muted'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SecteurActiviteStep />;
      case 2:
        return <BesoinsStep />;
      case 3:
        return <InformationsStep onSubmitSuccess={handleNext} />;
      default:
        return null;
    }
  };
  
  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Sélectionnez votre secteur d'activité";
      case 2:
        return "Quels sont vos besoins ?";
      case 3:
        return "Vos coordonnées";
      default:
        return "";
    }
  };

  // Empêcher la fermeture du modal en cliquant à l'extérieur ou en appuyant sur Escape
  const preventClose = () => {
    // Ne rien faire, pour empêcher la fermeture
    return false;
  };
  
  return (
    <Dialog open={open} onOpenChange={preventClose}>
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {renderStepTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepIndicator()}
        
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Retour
          </Button>
          
          {currentStep !== 3 ? (
            <Button 
              onClick={handleNext} 
              disabled={isNextDisabled}
            >
              {currentStep === 3 ? 'Terminer' : 'Suivant'}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
