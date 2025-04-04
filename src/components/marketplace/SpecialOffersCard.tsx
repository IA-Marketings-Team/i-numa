
import React from 'react';
import { Button } from '@/components/ui/button';

interface SpecialOffersCardProps {
  onViewAll: () => void;
  disabled?: boolean;
}

const SpecialOffersCard: React.FC<SpecialOffersCardProps> = ({ onViewAll, disabled = false }) => {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-medium mb-3">Offres spéciales</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Découvrez nos offres personnalisées pour votre secteur d'activité.
      </p>
      <Button 
        variant="default" 
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        onClick={onViewAll}
        disabled={disabled}
      >
        Voir tout
      </Button>
    </div>
  );
};

export default SpecialOffersCard;
