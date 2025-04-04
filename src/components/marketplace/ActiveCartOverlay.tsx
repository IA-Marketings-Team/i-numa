
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ActiveCartOverlayProps {
  isActive: boolean;
  isSuccess?: boolean;
}

const ActiveCartOverlay: React.FC<ActiveCartOverlayProps> = ({ isActive, isSuccess = false }) => {
  const navigate = useNavigate();
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md text-center">
        <p className="font-medium mb-4">
          {isSuccess ? "Article ajouté avec succès" : "Vous avez des articles dans votre panier"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Veuillez prendre rendez-vous dans l'agenda pour continuer.
        </p>
        <Button 
          onClick={() => navigate('/agenda')} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          Aller à l'agenda
        </Button>
      </div>
    </div>
  );
};

export default ActiveCartOverlay;
