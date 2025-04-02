import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Filter, Search, Check, Tags } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('offres')
          .select('*')
          .order('nom');
        
        if (error) {
          throw error;
        }
        
        setOffres(data || []);
        setFilteredOffres(data || []);
      } catch (error) {
        console.error("Error fetching offres:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les offres. Veuillez réessayer."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffres();
  }, [toast]);

  useEffect(() => {
    let result = [...offres];
    
    if (searchQuery) {
      result = result.filter(offre => 
        offre.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(offre => offre.type === selectedCategory);
    }
    
    result.sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.nom.localeCompare(b.nom)
        : b.nom.localeCompare(a.nom);
    });
    
    setFilteredOffres(result);
  }, [offres, searchQuery, selectedCategory, sortOrder]);

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

  const getUniqueCategories = () => {
    const categories = new Set(offres.map(offre => offre.type));
    return Array.from(categories);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace des Offres</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et ajoutez des offres à votre panier
          </p>
        </div>
        <Button onClick={() => navigate("/dossiers")} variant="outline" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Voir le panier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Catégorie</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {getUniqueCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Trier par</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full">
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
        </div>
        
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Chargement des offres...</p>
            </div>
          ) : filteredOffres.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffres.map(offre => (
                <Card key={offre.id} className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{offre.type}</Badge>
                      {offre.prix && <span className="font-semibold">{offre.prix} €</span>}
                    </div>
                    <CardTitle className="text-xl mt-2">{offre.nom}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {offre.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {offre.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddToCart(offre)}
                      disabled={isInCart(offre.id)}
                      className="w-full"
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
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed p-6">
              <Tags className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Aucune offre trouvée</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
              </p>
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
