
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FixedCartDrawer } from "@/components/cart/CartDrawer";
import EmailOfferDialog from "@/components/offers/EmailOfferDialog";
import OffreDetailCard from "@/components/offers/OffreDetailCard";
import SectorsHorizontalNav from "@/components/marketplace/SectorsHorizontalNav";
import { offerCategories } from "@/data/offerData";
import { offreService } from '@/services';
import { supabase } from '@/integrations/supabase/client';
import { Offre } from "@/types";

// Import the new components
import FeatureGrid from "@/components/marketplace/FeatureGrid";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import SpecialOffersCard from "@/components/marketplace/SpecialOffersCard";
import EmptyOfferState from "@/components/marketplace/EmptyOfferState";
import UserGuideDialog from "@/components/marketplace/UserGuideDialog";
import ActiveCartOverlay from "@/components/marketplace/ActiveCartOverlay";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";

const MarketplacePage = () => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { addToCart, isInCart, cart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isPhoner = user?.role === 'agent_phoner';
  const isResponsable = user?.role === 'responsable';
  const [userSector, setUserSector] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectorParam = params.get('secteur');
    
    if (sectorParam) {
      setSelectedSecteur(sectorParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUserSector = async () => {
      if (user && isClient) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('secteur_activite')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data && data.secteur_activite) {
            setUserSector(data.secteur_activite);
            
            if (selectedSecteur === "all") {
              setSelectedSecteur(data.secteur_activite);
            }
          }
        } catch (error) {
          console.error("Error fetching user sector:", error);
        }
      }
    };
    
    fetchUserSector();
  }, [user, isClient, selectedSecteur]);

  useEffect(() => {
    const loadOffres = async () => {
      setIsLoading(true);
      try {
        const data = await offreService.fetchOffres();
        setOffres(data);
        setFilteredOffres(data);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les offres. Veuillez réessayer."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOffres();
  }, [toast]);

  useEffect(() => {
    let result = [...offres];
    
    if (searchQuery) {
      result = result.filter(offre => 
        offre.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedSecteur && selectedSecteur !== "all") {
      result = result.filter(offre => offre.secteurActivite === selectedSecteur);
    }
    
    result.sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.nom.localeCompare(b.nom)
        : b.nom.localeCompare(a.nom);
    });
    
    setFilteredOffres(result);
  }, [offres, searchQuery, selectedSecteur, sortOrder]);

  const handleAddToCart = (offre: Offre) => {
    toast({
      title: "Offre sélectionnée",
      description: `${offre.nom} a été sélectionnée. Veuillez prendre un rendez-vous.`
    });
    
    localStorage.setItem('selectedOffre', JSON.stringify({
      offreId: offre.id,
      title: offre.nom,
      category: offre.type,
      price: offre.prix?.toString() || "0"
    }));
    
    navigate('/agenda');
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSecteur(sectorId);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSecteur("all");
  };

  const isCartActive = isClient && cart.length > 0;

  return (
    <div className={`container mx-auto px-4 py-6 relative ${isCartActive ? 'pointer-events-none opacity-70' : ''}`}>
      <ActiveCartOverlay isActive={isCartActive} />
      
      <MarketplaceHeader 
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenEmailDialog={() => setIsEmailDialogOpen(true)}
        isPhoner={isPhoner}
        isResponsable={isResponsable}
        isClient={isClient}
        isCartActive={isCartActive}
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
            disabled={isCartActive}
          />
          
          <SpecialOffersCard
            onViewAll={() => setSelectedSecteur("all")}
            disabled={isCartActive}
          />
        </div>
        
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Chargement des offres...</p>
            </div>
          ) : filteredOffres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffres.map(offre => (
                <OffreDetailCard 
                  key={offre.id} 
                  offreId={offre.id}
                  nom={offre.nom}
                  description={offre.description}
                  type={offre.type}
                  prix={offre.prix || 0}
                  prixMensuel={offre.prixMensuel || ""}
                  fraisCreation={offre.fraisCreation || ""}
                />
              ))}
            </div>
          ) : (
            <EmptyOfferState 
              onResetFilters={handleResetFilters}
              showResetButton={searchQuery !== "" || selectedSecteur !== "all"}
              disabled={isCartActive}
            />
          )}
        </div>
      </div>
      
      <EmailOfferDialog 
        open={isEmailDialogOpen} 
        onOpenChange={setIsEmailDialogOpen}
        categories={offerCategories}
      />
      
      <UserGuideDialog 
        open={isGuideOpen} 
        onOpenChange={setIsGuideOpen}
      />
      
      {isClient && <FixedCartDrawer />}
    </div>
  );
};

export default MarketplacePage;
