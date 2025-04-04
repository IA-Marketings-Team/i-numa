import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/contexts/CartContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer, { FixedCartDrawer } from "@/components/cart/CartDrawer";
import EmailOfferDialog from "@/components/offers/EmailOfferDialog";
import OffreDetailCard from "@/components/offers/OffreDetailCard";
import SectorsHorizontalNav from "@/components/marketplace/SectorsHorizontalNav";
import { Offre } from "@/types";
import { offerCategories } from "@/data/offerData";
import { 
  Mail, 
  ShoppingCart, 
  Building, 
  MessageCircle, 
  Star, 
  Globe, 
  ThumbsUp, 
  Gauge, 
  Gift, 
  Cloud, 
  TrendingUp, 
  CandlestickChart, 
  TrendingDown,
  Filter,
  Search,
  Tags,
  BookOpen
} from 'lucide-react';
import { offreService } from '@/services';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isPhoner = user?.role === 'agent_phoner';
  const isResponsable = user?.role === 'responsable';
  const [userSector, setUserSector] = useState<string | null>(null);

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
            setSelectedSecteur(data.secteur_activite);
          }
        } catch (error) {
          console.error("Error fetching user sector:", error);
        }
      }
    };
    
    fetchUserSector();
  }, [user, isClient]);

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
    addToCart({
      offreId: offre.id,
      title: offre.nom,
      category: offre.type,
      price: offre.prix?.toString() || "0",
      quantity: 1
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${offre.nom} a été ajouté à votre panier.`
    });
    
    if (isClient) {
      setTimeout(() => {
        navigate('/agenda');
      }, 1500);
    }
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSecteur(sectorId);
  };
  
  const UserGuide = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Bienvenue sur notre marketplace ! Voici comment utiliser notre application :
      </p>
      
      <div className="space-y-2">
        <h4 className="font-medium">1. Parcourir les offres</h4>
        <p className="text-sm">Explorez les offres filtrées selon votre secteur d'activité.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">2. Ajouter au panier</h4>
        <p className="text-sm">Cliquez sur "Ajouter au panier" pour sélectionner une offre.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">3. Prendre rendez-vous</h4>
        <p className="text-sm">Après avoir ajouté une offre, vous serez redirigé vers l'agenda pour choisir une date et une heure de rendez-vous.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">4. Confirmer par email</h4>
        <p className="text-sm">Vous recevrez un email de confirmation pour valider votre rendez-vous.</p>
      </div>
    </div>
  );

  const isCartActive = isClient && cart.length > 0;

  return (
    <div className={`container mx-auto px-4 py-6 relative ${isCartActive ? 'pointer-events-none opacity-70' : ''}`}>
      {isCartActive && (
        <div className="fixed inset-0 z-40 bg-black/20 pointer-events-none flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg pointer-events-auto max-w-md text-center">
            <p className="font-medium mb-4">
              Vous avez des articles dans votre panier
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Veuillez prendre rendez-vous dans l'agenda pour continuer.
            </p>
            <Button 
              onClick={() => navigate('/agenda')} 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Aller à l'agenda
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Marketplace des Offres</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et ajoutez des offres à votre panier
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Guide d'utilisation</span>
          </Button>
          
          {(isPhoner || isResponsable) && (
            <Button 
              variant="outline" 
              onClick={() => setIsEmailDialogOpen(true)}
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
      
      <div className="mb-10 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Nos offres vous permettent de...
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <Building className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Générez des <strong>visites en magasin</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <MessageCircle className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Animez/créez votre <strong>communauté</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <Star className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Valorisez <strong>votre expertise</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <Globe className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Augmentez votre <strong>visibilité / notoriété</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <ThumbsUp className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Générez des <strong>avis positifs</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <Gauge className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Gagnez en <strong>efficacité</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <Gift className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm"><strong>Fidélisez</strong> vos clients</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <Cloud className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm">Exploitez vos <strong>données clients</strong></p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <TrendingUp className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm"><strong>Développez</strong> votre activité</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CandlestickChart className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm"><strong>Pilotez</strong> votre activité</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <TrendingDown className="h-8 w-8 mb-2 text-indigo-500" />
            <p className="text-center text-sm"><strong>Diminuez</strong> vos coûts</p>
          </div>
        </div>
      </div>
      
      <SectorsHorizontalNav 
        selectedSector={selectedSecteur}
        onSelectSector={handleSectorSelect}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mt-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-medium mb-3 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              <Filter className="mr-2 h-4 w-4 text-indigo-500" />
              Filtres
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-8 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isCartActive}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Trier par</label>
                <Select value={sortOrder} onValueChange={setSortOrder} disabled={isCartActive}>
                  <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Nom (A-Z)</SelectItem>
                    <SelectItem value="desc">Nom (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Offres spéciales</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Découvrez nos offres personnalisées pour votre secteur d'activité.
            </p>
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => setSelectedSecteur("all")}
              disabled={isCartActive}
            >
              Voir tout
            </Button>
          </div>
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
            <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-dashed p-6 border-gray-200 dark:border-gray-800">
              <Tags className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium">Aucune offre trouvée</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
              </p>
              {(searchQuery || selectedSecteur !== "all") && (
                <Button 
                  variant="outline" 
                  className="mt-4 bg-white dark:bg-gray-900"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSecteur("all");
                  }}
                  disabled={isCartActive}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <EmailOfferDialog 
        open={isEmailDialogOpen} 
        onOpenChange={setIsEmailDialogOpen}
        categories={offerCategories}
      />
      
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guide d'utilisation</DialogTitle>
          </DialogHeader>
          <UserGuide />
        </DialogContent>
      </Dialog>
      
      {isClient && <FixedCartDrawer />}
    </div>
  );
};

export default MarketplacePage;
