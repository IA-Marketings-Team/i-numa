
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tags } from 'lucide-react';

interface EmptyOfferStateProps {
  onResetFilters: () => void;
  showResetButton: boolean;
  disabled?: boolean;
}

const EmptyOfferState: React.FC<EmptyOfferStateProps> = ({ 
  onResetFilters, 
  showResetButton, 
  disabled = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-dashed p-6 border-gray-200 dark:border-gray-800">
      <Tags className="h-12 w-12 text-indigo-400 mb-4" />
      <h3 className="text-lg font-medium">Aucune offre trouvée</h3>
      <p className="text-sm text-gray-500 text-center mt-1">
        Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
      </p>
      {showResetButton && (
        <Button 
          variant="outline" 
          className="mt-4 bg-white dark:bg-gray-900"
          onClick={onResetFilters}
          disabled={disabled}
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
};

export default EmptyOfferState;
