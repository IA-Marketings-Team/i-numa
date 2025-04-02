
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * Composant réutilisable pour afficher un indicateur de chargement
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Chargement..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">{message}</p>
        <div className="mt-4 animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
