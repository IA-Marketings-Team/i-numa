
import React from 'react';
import { MarketplaceProvider } from '@/contexts/MarketplaceContext';
import MarketplaceLayout from '@/components/marketplace/MarketplaceLayout';
import EmailOfferDialog from "@/components/offers/EmailOfferDialog";
import UserGuideDialog from "@/components/marketplace/UserGuideDialog";
import { offerCategories } from "@/data/offerData";
import { useMarketplace } from '@/contexts/MarketplaceContext';

// Component to handle dialogs
const MarketplaceDialogs: React.FC = () => {
  const { isEmailDialogOpen, setIsEmailDialogOpen, isGuideOpen, setIsGuideOpen } = useMarketplace();
  
  return (
    <>
      <EmailOfferDialog 
        open={isEmailDialogOpen} 
        onOpenChange={setIsEmailDialogOpen}
        categories={offerCategories}
      />
      
      <UserGuideDialog 
        open={isGuideOpen} 
        onOpenChange={setIsGuideOpen}
      />
    </>
  );
};

const MarketplacePageContent: React.FC = () => {
  return (
    <>
      <MarketplaceLayout />
      <MarketplaceDialogs />
    </>
  );
};

// Main MarketplacePage component
const MarketplacePage = () => {
  return (
    <MarketplaceProvider>
      <MarketplacePageContent />
    </MarketplaceProvider>
  );
};

export default MarketplacePage;
