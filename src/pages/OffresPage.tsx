
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import OffreCard from "@/components/offres/OffreCard";
import CreateOffreDialog from "@/components/offres/CreateOffreDialog";
import { useToast } from "@/hooks/use-toast";
import { fetchOffresWithSecteurs, deleteOffre, fetchSecteurs } from "@/services/offreService";
import { Offre, SecteurActivite } from "@/types";

const OffresPage: React.FC = () => {
  const { toast } = useToast();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [secteurs, setSecteurs] = useState<SecteurActivite[]>([]);
  const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
  
  // Charger les offres depuis Supabase
  useEffect(() => {
    const loadOffres = async () => {
      setIsLoading(true);
      try {
        const loadedOffres = await fetchOffresWithSecteurs();
        setOffres(loadedOffres);
        
        // Load sectors
        const loadedSecteurs = await fetchSecteurs();
        setSecteurs(loadedSecteurs);
      } catch (error) {
        console.error("Error loading offres:", error);
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

  // Filtrer les offres en fonction de la recherche, du tab actif et des secteurs sélectionnés
  const filteredOffres = offres.filter(offre => {
    // Filtre de recherche
    const matchesSearch = offre.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          offre.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de catégorie
    const matchesCategory = activeTab === "tous" || offre.type.toLowerCase() === activeTab.toLowerCase();
    
    // Filtre de secteur
    const matchesSector = selectedSecteurs.length === 0 || 
                          (offre.secteurs && offre.secteurs.some(secteur => 
                            selectedSecteurs.includes(secteur.id)
                          ));
    
    return matchesSearch && matchesCategory && matchesSector;
  });

  // Obtenir les catégories uniques
  const categories = [...new Set(offres.map(offre => offre.type))];

  // Gérer la suppression d'une offre
  const handleDeleteOffre = async (id: string) => {
    try {
      await deleteOffre(id);
      setOffres(offres.filter(offre => offre.id !== id));
      toast({
        title: "Offre supprimée",
        description: "L'offre a été supprimée avec succès."
      });
    } catch (error) {
      console.error("Error deleting offre:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'offre."
      });
    }
  };

  // Gérer l'ajout d'une offre
  const handleAddOffre = (newOffre: Offre) => {
    setOffres([...offres, newOffre]);
  };

  // Gérer la sélection/désélection d'un secteur
  const handleSecteurChange = (secteurId: string) => {
    setSelectedSecteurs(prev => {
      if (prev.includes(secteurId)) {
        return prev.filter(id => id !== secteurId);
      } else {
        return [...prev, secteurId];
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des offres</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle offre
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtrer par secteur</span>
              {selectedSecteurs.length > 0 && (
                <Badge className="ml-1">{selectedSecteurs.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="end">
            <ScrollArea className="h-[300px] p-4">
              <div className="space-y-2">
                {secteurs.map((secteur) => (
                  <div key={secteur.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`filter-secteur-${secteur.id}`}
                      checked={selectedSecteurs.includes(secteur.id)}
                      onCheckedChange={() => handleSecteurChange(secteur.id)}
                    />
                    <div>
                      <label
                        htmlFor={`filter-secteur-${secteur.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {secteur.nom}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {selectedSecteurs.length > 0 && (
              <div className="border-t p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedSecteurs([])}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs defaultValue="tous" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="tous">Tous</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Chargement des offres...</p>
              </CardContent>
            </Card>
          ) : filteredOffres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffres.map(offre => (
                <OffreCard
                  key={offre.id}
                  offre={offre}
                  onDelete={handleDeleteOffre}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Aucune offre trouvée.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <CreateOffreDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onOffreCreated={handleAddOffre}
      />
    </div>
  );
};

export default OffresPage;
