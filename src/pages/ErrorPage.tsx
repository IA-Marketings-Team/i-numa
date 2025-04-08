
import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, message }) => {
  const error = useRouteError() as any;
  const errorTitle = title || "Une erreur est survenue";
  const errorMessage = message || (error ? (error.statusText || error.message) : "Désolé, une erreur inattendue s'est produite.");

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">{errorTitle}</h1>
        <p className="text-muted-foreground">{errorMessage}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/connexion">Se connecter</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
