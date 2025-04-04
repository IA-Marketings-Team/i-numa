
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Mail, ShoppingCart } from 'lucide-react';
import CartDrawer from "@/components/cart/CartDrawer";
import { useNavigate } from 'react-router-dom';

interface MarketplaceHeaderProps {
  onOpenGuide: () => void;
  onOpenEmailDialog: () => void;
  isPhoner: boolean;
  isResponsable: boolean;
  isClient: boolean;
  isCartActive: boolean;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  onOpenGuide,
  onOpenEmailDialog,
  isPhoner,
  isResponsable,
  isClient,
  isCartActive
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Marketplace des Offres
        </h1>
        <p className="text-muted-foreground mt-1">
          Découvrez et ajoutez des offres à votre panier
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={onOpenGuide}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden md:inline">Guide d'utilisation</span>
        </Button>
        
        {(isPhoner || isResponsable) && (
          <Button 
            variant="outline" 
            onClick={onOpenEmailDialog}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">Envoyer par email</span>
          </Button>
        )}
        {isClient && <CartDrawer />}
        <Button 
          onClick={() => navigate("/contrat-acceptation")} 
          variant="default" 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          disabled={isCartActive}
        >
          <ShoppingCart className="h-4 w-4" />
          Voir le panier
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
