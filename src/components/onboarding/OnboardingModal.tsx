
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingProvider';
import SecteurActiviteStep from './SecteurActiviteStep';
import BesoinsStep from './BesoinsStep';
import InformationsStep from './InformationsStep';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingModalProps {
  onClose?: () => void;
}

export const OnboardingModal = ({ onClose }: OnboardingModalProps) => {
  try {
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
    
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // Allow the modal to be displayed
    useEffect(() => {
      if (!isOpen) {
        setIsOpen(true);
      }
    }, [isOpen, setIsOpen]);

    const handleComplete = async () => {
      await completeOnboarding();
      
      // Show success toast notification
      toast({
        title: "Profil complété",
        description: "Votre profil a été complété avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.",
        variant: "success"
      });
      
      // Close the modal and redirect to marketplace
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
      // Redirect to marketplace after completing onboarding
      navigate('/marketplace');
    };

    const handleCloseDialog = () => {
      if (onClose) {
        onClose();
      } else {
        setIsOpen(false);
      }
    };

    // Calculate step progress percentage
    const progressPercentage = ((currentStep + 1) / 3) * 100;
    
    return (
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open && onClose) {
            onClose();
          } else {
            setIsOpen(open);
          }
        }}
      >
        <DialogContent className="max-w-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <button 
            onClick={handleCloseDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            type="button"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

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
          <div className="flex justify-between mt-3">
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
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Terminer
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  } catch (error) {
    console.error("Failed to render OnboardingModal:", error);
    return null; // Render nothing if there's an error
  }
};

export default OnboardingModal;
