
import React from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FeatureGrid from '@/components/marketplace/FeatureGrid';
import SectorsHorizontalNav from '@/components/marketplace/SectorsHorizontalNav';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import SpecialOffersCard from '@/components/marketplace/SpecialOffersCard';
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
    handleSectorSelect,
    searchQuery, 
    setSearchQuery,
    sortOrder,
    setSortOrder,
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
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mt-6">
        <div className="space-y-6">
          <MarketplaceFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            disabled={false}
          />
          
          <SpecialOffersCard
            onViewAll={() => handleSectorSelect("all")}
            disabled={false}
          />
        </div>
        
        <OffersList />
      </div>
      
      {isClient && <FixedCartDrawer />}
    </div>
  );
};

export default MarketplaceLayout;
