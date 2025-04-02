
import React, { useState, useEffect } from "react";
import { fetchOffres } from "@/services/offreService";
import { Offre } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Filter, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CartDrawer from "@/components/cart/CartDrawer";

const MarketplacePage: React.FC = () => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [secteurFilter, setSecteurFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("nom");
  const { toast } = useToast();
  const { addToCart, getCartCount } = useCart();

  // Charger les offres
  useEffect(() => {
    const loadOffres = async () => {
      try {
        setIsLoading(true);
        const loadedOffres = await fetchOffres();
        setOffres(loadedOffres);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les offres."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOffres();
  }, [toast]);

  // Types d'offres uniques pour le filtre
  const offreTypes = [...new Set(offres.map(offre => offre.type))];
  
  // Secteurs d'activités simulés (à remplacer par des données réelles)
  const secteurs = ["Marketing Digital", "E-commerce", "Artisanat", "Services", "Technologie", "Santé", "Éducation"];

  // Filtrer les offres en fonction des critères
  const filteredOffres = offres.filter(offre => {
    // Filtre de recherche
    const matchSearch = offre.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        offre.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par type
    const matchType = typeFilter === "all" || offre.type === typeFilter;

    // Filtre par secteur (simule un filtrage par secteur)
    const matchSecteur = secteurFilter === "all" || Math.random() > 0.3; // Simule une correspondance aléatoire
    
    return matchSearch && matchType && matchSecteur;
  });

  // Trier les offres
  const sortedOffres = [...filteredOffres].sort((a, b) => {
    switch (sortBy) {
      case "prix-asc":
        return (a.prix || 0) - (b.prix || 0);
      case "prix-desc":
        return (b.prix || 0) - (a.prix || 0);
      case "nom":
        return a.nom.localeCompare(b.nom);
      default:
        return 0;
    }
  });

  // Ajouter une offre au panier
  const handleAddToCart = (offre: Offre) => {
    addToCart({
      category: offre.type,
      title: offre.nom,
      price: `${offre.prix} €`,
      id: offre.id
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${offre.nom} a été ajouté à votre panier.`
    });
  };

  // Obtenir la couleur du badge en fonction du type d'offre
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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <CartDrawer />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar des filtres */}
        <div className="w-full md:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type d'offre</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {offreTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Secteur d'activité</label>
                <Select value={secteurFilter} onValueChange={setSecteurFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {secteurs.map(secteur => (
                      <SelectItem key={secteur} value={secteur}>{secteur}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-1 block">Trier par</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tri par défaut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nom">Nom (A-Z)</SelectItem>
                    <SelectItem value="prix-asc">Prix croissant</SelectItem>
                    <SelectItem value="prix-desc">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Tag className="mr-2 h-4 w-4" /> Offres populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {offres.slice(0, 5).map(offre => (
                  <li key={offre.id} className="text-sm hover:text-primary cursor-pointer">
                    {offre.nom}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Contenu principal */}
        <div className="w-full md:w-3/4 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher une offre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes les offres</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="email">Email X</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Chargement des offres...</p>
                </div>
              ) : sortedOffres.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedOffres.map(offre => (
                    <Card key={offre.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className={getBadgeColor(offre.type)}>
                            {offre.type}
                          </Badge>
                          {offre.prix !== undefined && (
                            <span className="font-bold text-lg">{offre.prix} €</span>
                          )}
                        </div>
                        <CardTitle className="text-lg">{offre.nom}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {offre.description.length > 100
                            ? `${offre.description.substring(0, 100)}...`
                            : offre.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleAddToCart(offre)}>
                          <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-2">Aucune offre trouvée</p>
                  <p className="text-sm text-gray-400">Essayez d'ajuster vos filtres</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="seo">
              {/* Contenu similaire pour les offres SEO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOffres.filter(offre => offre.type === "SEO").map(offre => (
                  <Card key={offre.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* ... contenu similaire à l'onglet "all" */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className={getBadgeColor(offre.type)}>
                          {offre.type}
                        </Badge>
                        {offre.prix !== undefined && (
                          <span className="font-bold text-lg">{offre.prix} €</span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{offre.nom}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {offre.description.length > 100
                          ? `${offre.description.substring(0, 100)}...`
                          : offre.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleAddToCart(offre)}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Autres onglets */}
            <TabsContent value="google">
              {/* Contenu pour les offres Google Ads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOffres.filter(offre => offre.type === "Google Ads").map(offre => (
                  <Card key={offre.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* ... contenu similaire */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className={getBadgeColor(offre.type)}>
                          {offre.type}
                        </Badge>
                        {offre.prix !== undefined && (
                          <span className="font-bold text-lg">{offre.prix} €</span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{offre.nom}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {offre.description.length > 100
                          ? `${offre.description.substring(0, 100)}...`
                          : offre.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleAddToCart(offre)}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="email">
              {/* Contenu pour les offres Email X */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOffres.filter(offre => offre.type === "Email X").map(offre => (
                  <Card key={offre.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* ... contenu similaire */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className={getBadgeColor(offre.type)}>
                          {offre.type}
                        </Badge>
                        {offre.prix !== undefined && (
                          <span className="font-bold text-lg">{offre.prix} €</span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{offre.nom}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {offre.description.length > 100
                          ? `${offre.description.substring(0, 100)}...`
                          : offre.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleAddToCart(offre)}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
