import React from 'react';
import MarketplaceLayout from '@/layouts/MarketplaceLayout';
import MarketplaceTopBar from '@/components/marketplace/MarketplaceTopBar';
import { Button } from '@/components/ui/button';

const MarketplacePage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Promotional Banner for i-mailX */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row items-center p-6">
          <div className="lg:w-1/2 text-white mb-6 lg:mb-0 lg:pr-8">
            <h2 className="text-3xl font-bold mb-4">Découvrez i-mailX</h2>
            <p className="mb-6 text-white/90">
              Notre solution innovante de cold-mailing qui révolutionne la prospection par email.
              Augmentez vos taux d'ouverture et de conversion grâce à notre technologie d'IA avancée.
            </p>
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.open('/offres/i-mailx', '_self')}
            >
              En savoir plus
            </Button>
          </div>
          <div className="lg:w-1/2 bg-black/20 rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 flex items-center justify-center p-4">
              <div className="text-center text-white">
                <p className="text-lg font-medium">Vidéo promotionnelle i-mailX</p>
                <p className="text-sm opacity-70">Cliquez pour voir la démonstration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of marketplace content */}
      <MarketplaceLayout>
        <MarketplaceTopBar />
        <p>Contenu principal du marketplace...</p>
      </MarketplaceLayout>
    </div>
  );
};

export default MarketplacePage;
