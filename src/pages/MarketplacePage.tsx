import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Filter, Search, Check, Tags, Mail } from "lucide-react";
import {
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fetchOffres } from "@/services/offreService";
import { offerCategories } from "@/data/offerData";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import EmailOfferDialog from "@/components/offers/EmailOfferDialog";

interface Offre {
  id: string;
  nom: string;
  description: string;
  type: string;
  prix?: number;
}

const MarketplacePage = () => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isPhoner = user?.role === 'agent_phoner';
  const isResponsable = user?.role === 'responsable';

  useEffect(() => {
    const loadOffres = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOffres();
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
    
    if (selectedSecteur && selectedSecteur !== "all_categories") {
      result = result.filter(offre => offre.type === selectedSecteur);
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
      quantity: 1,
      nom: offre.nom,
      description: offre.description,
      type: offre.type,
      prix: offre.prix
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${offre.nom} a été ajouté à votre panier.`
    });
  };

  const getUniqueSecteurs = () => {
    const secteurs = new Set(offres.map(offre => offre.type));
    return Array.from(secteurs);
  };

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "seo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "google ads":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "email x":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "foner":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "devis":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Marketplace des Offres</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et ajoutez des offres à votre panier
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button onClick={() => navigate("/contrat-acceptation")} variant="default" className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
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
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Secteur d'activité</label>
                <Select 
                  value={selectedSecteur} 
                  onValueChange={setSelectedSecteur}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_categories">Tous les secteurs</SelectItem>
                    {getUniqueSecteurs().map(secteur => (
                      <SelectItem key={secteur} value={secteur}>
                        {secteur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Trier par</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
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
              onClick={() => setSelectedSecteur("")}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffres.map(offre => (
                <Card key={offre.id} className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                    <div className="flex justify-between items-start">
                      <Badge className={`${getBadgeColor(offre.type)}`}>
                        {offre.type}
                      </Badge>
                      {offre.prix && <span className="font-semibold">{offre.prix} €</span>}
                    </div>
                    <CardTitle className="text-xl mt-2">{offre.nom}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {offre.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {offre.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between bg-gradient-to-b from-transparent to-indigo-50 dark:to-indigo-950">
                    <Button 
                      variant={isInCart(offre.id) ? "outline" : "default"}
                      size="sm" 
                      onClick={() => handleAddToCart(offre)}
                      disabled={isInCart(offre.id)}
                      className={`w-full ${!isInCart(offre.id) ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" : ""}`}
                    >
                      {isInCart(offre.id) ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Dans le panier
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Ajouter au panier
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-dashed p-6 border-gray-200 dark:border-gray-800">
              <Tags className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium">Aucune offre trouvée</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
              </p>
              {(searchQuery || selectedSecteur) && (
                <Button 
                  variant="outline" 
                  className="mt-4 bg-white dark:bg-gray-900"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSecteur("");
                  }}
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
    </div>
  );
};

export default MarketplacePage;
