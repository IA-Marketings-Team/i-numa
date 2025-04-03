
import React from "react";
import { OnboardingProvider as Provider } from "@/contexts/OnboardingContext";
import OnboardingWorkflow from "./OnboardingWorkflow";

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <Provider>
      {children}
      <OnboardingWorkflow />
    </Provider>
  );
};

export default OnboardingProvider;
