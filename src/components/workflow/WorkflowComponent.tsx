
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, CheckCircle, Clock, FileText, 
  PhoneCall, Video, CalendarCheck, FileSignature 
} from "lucide-react";

interface WorkflowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ 
  icon, 
  title, 
  description, 
  isActive = false,
  isCompleted = false
}) => {
  return (
    <div className={`relative flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-70'}`}>
      <div className={`
        h-12 w-12 flex items-center justify-center rounded-full border-2
        ${isCompleted ? 'bg-green-100 border-green-500' : isActive ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'}
      `}>
        {isCompleted ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <div className="h-6 w-6 text-blue-500">
            {icon}
          </div>
        )}
      </div>
      <h3 className={`mt-2 text-sm font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-[120px] text-center">
        {description}
      </p>
    </div>
  );
};

interface WorkflowProps {
  currentStep?: number;
  completedSteps?: number[];
}

const WorkflowComponent: React.FC<WorkflowProps> = ({ 
  currentStep = 1,
  completedSteps = []
}) => {
  const steps = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Création de dossier",
      description: "Ouverture d'un nouveau dossier client"
    },
    {
      icon: <PhoneCall className="h-6 w-6" />,
      title: "Contact téléphonique",
      description: "Premier appel par un agent Phoner"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Prise de RDV",
      description: "Planification d'un rendez-vous"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Rendez-vous Visio",
      description: "Démonstration en visioconférence"
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "Validation",
      description: "Validation de l'offre proposée"
    },
    {
      icon: <FileSignature className="h-6 w-6" />,
      title: "Signature",
      description: "Finalisation et signature du contrat"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Processus de gestion des dossiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <WorkflowStep
                icon={step.icon}
                title={step.title}
                description={step.description}
                isActive={index + 1 === currentStep}
                isCompleted={completedSteps.includes(index + 1)}
              />
              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowComponent;
