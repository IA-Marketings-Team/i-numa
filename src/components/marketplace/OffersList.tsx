
import React, { useEffect } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import OffreDetailCard from '@/components/offers/OffreDetailCard';
import EmptyOfferState from '@/components/marketplace/EmptyOfferState';

const OffersList: React.FC = () => {
  const { 
    isLoading, 
    filteredOffres, 
    handleAddToCart, 
    handleResetFilters, 
    searchQuery, 
    selectedSecteur 
  } = useMarketplace();

  // Log when the filter changes to help debug
  useEffect(() => {
    console.log(`Selected sector: ${selectedSecteur}, Offers count: ${filteredOffres.length}`);
    console.log("Offers sectors:", filteredOffres.map(o => o.secteurActivite));
  }, [selectedSecteur, filteredOffres]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des offres...</p>
      </div>
    );
  }

  if (filteredOffres.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffres.map(offre => (
          <OffreDetailCard 
            key={offre.id}
            offreId={offre.id}
            nom={offre.nom}
            description={offre.description}
            type={offre.type as 'SEO' | 'Google Ads' | 'Facebook/Instagram Ads' | 'E-réputation' | 'Deliver' | 'Email X' | 'Foner' | 'Devis'}
            prix={offre.prix || 0}
            prixMensuel={offre.prixMensuel || ""}
            fraisCreation={offre.fraisCreation || ""}
            onAddToCart={() => handleAddToCart(offre)}
          />
        ))}
      </div>
    );
  }

  return (
    <EmptyOfferState 
      onResetFilters={handleResetFilters}
      showResetButton={searchQuery !== "" || selectedSecteur !== "all"}
      disabled={false}
    />
  );
};

export default OffersList;
