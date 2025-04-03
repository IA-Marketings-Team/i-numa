
import React from "react";
import { useWorkflowNavigation } from "@/hooks/useWorkflowNavigation";
import { AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const RestrictedOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRestricted } = useWorkflowNavigation();
  const location = useLocation();
  const isAgendaPage = location.pathname === "/agenda";

  if (!isRestricted) {
    return <>{children}</>;
  }

  // Si c'est la page agenda, pas d'overlay
  if (isAgendaPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-lg text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Interface temporairement limitée</h2>
          <p className="mb-4">
            Veuillez d'abord prendre rendez-vous avec un de nos experts en utilisant l'agenda. 
            Un email de confirmation vous a été envoyé. Validez votre rendez-vous en cliquant sur le lien dans l'email.
          </p>
          <a href="/agenda" className="bg-primary text-white px-4 py-2 rounded-md inline-block">
            Accéder à l'agenda
          </a>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default RestrictedOverlay;
