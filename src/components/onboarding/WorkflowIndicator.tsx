
import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

const steps = [
  { id: 1, label: "Secteur d'activité" },
  { id: 2, label: "Besoins" },
  { id: 3, label: "Coordonnées" },
  { id: 4, label: "Rendez-vous" },
  { id: 5, label: "Confirmation" },
];

const WorkflowIndicator: React.FC = () => {
  const { state } = useOnboarding();

  return (
    <div className="mt-8">
      <h2 className="text-center text-xl font-bold text-primary mb-6">
        Workflow i-numera - Parcours Utilisateur
      </h2>
      <div className="flex items-center justify-center flex-wrap">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex flex-col items-center ${
                state.currentStep >= index ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  state.currentStep > index
                    ? "bg-primary text-white border-primary"
                    : state.currentStep === index
                    ? "border-primary text-primary"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {state.currentStep > index ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <span className="text-xs mt-1 text-center max-w-[100px]">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight
                className={`mx-1 ${
                  state.currentStep > index ? "text-primary" : "text-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowIndicator;
