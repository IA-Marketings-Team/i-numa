
import React from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FeatureGrid from '@/components/marketplace/FeatureGrid';
import SectorsHorizontalNav from '@/components/marketplace/SectorsHorizontalNav';
import MarketplaceTopBar from '@/components/marketplace/MarketplaceTopBar';
import ActiveCartOverlay from '@/components/marketplace/ActiveCartOverlay';
import { FixedCartDrawer } from "@/components/cart/CartDrawer";
import OffersList from '@/components/marketplace/OffersList';

const MarketplaceLayout: React.FC = () => {
  const { 
    isCartActive,
    isClient,
    isPhoner, 
    isResponsable,
    setIsGuideOpen,
    setIsEmailDialogOpen,
    selectedSecteur,
    handleSectorSelect
  } = useMarketplace();

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <ActiveCartOverlay isActive={isCartActive} isSuccess={true} />
      
      <MarketplaceHeader 
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenEmailDialog={() => setIsEmailDialogOpen(true)}
        isPhoner={isPhoner}
        isResponsable={isResponsable}
        isClient={isClient}
        isCartActive={false}
      />
      
      <FeatureGrid />
      
      <SectorsHorizontalNav 
        selectedSector={selectedSecteur}
        onSelectSector={handleSectorSelect}
      />
      
      <div className="mt-6">
        <MarketplaceTopBar />
        <div className="mt-6">
          <OffersList />
        </div>
      </div>
      
      {isClient && <FixedCartDrawer />}
    </div>
  );
};

export default MarketplaceLayout;
