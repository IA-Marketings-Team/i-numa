
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Offre } from "@/types";
import { offreService } from '@/services';

type MarketplaceContextType = {
  offres: Offre[];
  filteredOffres: Offre[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSecteur: string;
  setSelectedSecteur: (secteur: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  userSector: string | null;
  isEmailDialogOpen: boolean;
  setIsEmailDialogOpen: (isOpen: boolean) => void;
  isGuideOpen: boolean;
  setIsGuideOpen: (isOpen: boolean) => void;
  isSuccessOverlay: boolean;
  setIsSuccessOverlay: (isSuccess: boolean) => void;
  handleAddToCart: (offre: Offre) => void;
  handleSectorSelect: (sectorId: string) => void;
  handleResetFilters: () => void;
  isCartActive: boolean;
  handleOnboardingSuccess: () => void;
  isClient: boolean;
  isPhoner: boolean;
  isResponsable: boolean;
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSuccessOverlay, setIsSuccessOverlay] = useState(false);
  const [userSector, setUserSector] = useState<string | null>(null);
  
  const { addToCart, isInCart, cart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isPhoner = user?.role === 'agent_phoner';
  const isResponsable = user?.role === 'responsable';
  
  // Récupérer le secteur depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectorParam = params.get('secteur');
    
    if (sectorParam) {
      setSelectedSecteur(sectorParam);
    }
  }, [location.search]);

  // Récupérer le secteur d'activité de l'utilisateur depuis la base de données
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

  // Charger les offres depuis le service
  useEffect(() => {
    const loadOffres = async () => {
      setIsLoading(true);
      try {
        const data = await offreService.fetchOffres();
        console.log("Offres loaded:", data);
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

  // Filtrer les offres en fonction des critères
  useEffect(() => {
    let result = [...offres];
    
    if (searchQuery) {
      result = result.filter(offre => 
        offre.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedSecteur && selectedSecteur !== "all") {
      // Filter by sector, checking if the sector is included in comma-separated list
      result = result.filter(offre => {
        if (!offre.secteurActivite) return false;
        
        // Split the sectors by comma and trim whitespace
        const secteurs = offre.secteurActivite.split(',').map(s => s.trim());
        console.log(`Filtering ${offre.nom} with sectors: [${secteurs.join(', ')}], selected: ${selectedSecteur}`);
        
        // Check if the selected sector is in the list
        return secteurs.includes(selectedSecteur);
      });
    }
    
    result.sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.nom.localeCompare(b.nom)
        : b.nom.localeCompare(a.nom);
    });
    
    console.log(`Filtered offers: ${result.length} of ${offres.length}`);
    setFilteredOffres(result);
  }, [offres, searchQuery, selectedSecteur, sortOrder]);

  const handleAddToCart = (offre: Offre) => {
    // Ajouter au panier
    addToCart({
      offreId: offre.id,
      quantity: 1,
      title: offre.nom,
      category: offre.type,
      price: offre.prix?.toString() || "0"
    });
    
    // Afficher le message de succès
    setIsSuccessOverlay(true);
    
    // Notification toast
    toast({
      title: "Offre ajoutée",
      description: `${offre.nom} a été ajouté à votre panier.`
    });
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSecteur(sectorId);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSecteur("all");
  };

  // Afficher le message de succès uniquement après ajout au panier
  const isCartActive = isClient && cart.length > 0 && isSuccessOverlay;
  
  // Handler for onboarding completion
  const handleOnboardingSuccess = () => {
    toast({
      title: "Profil complété",
      description: "Votre profil a été complété avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.",
      variant: "default"
    });
  };

  return (
    <MarketplaceContext.Provider 
      value={{
        offres,
        filteredOffres,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedSecteur,
        setSelectedSecteur,
        sortOrder,
        setSortOrder,
        userSector,
        isEmailDialogOpen,
        setIsEmailDialogOpen,
        isGuideOpen,
        setIsGuideOpen,
        isSuccessOverlay,
        setIsSuccessOverlay,
        handleAddToCart,
        handleSectorSelect,
        handleResetFilters,
        isCartActive,
        handleOnboardingSuccess,
        isClient,
        isPhoner,
        isResponsable
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};
