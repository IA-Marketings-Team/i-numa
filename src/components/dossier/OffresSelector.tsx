
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { fetchOffresWithSecteurs, fetchSecteurs } from "@/services/offreService";
import { Offre, SecteurActivite } from "@/types";

interface OffresSelectorProps {
  selectedOffres: string[];
  onOffreChange: (offreId: string) => void;
  hasPermission: (roles: string[]) => boolean;
}

const OffresSelector: React.FC<OffresSelectorProps> = ({
  selectedOffres,
  onOffreChange,
  hasPermission
}) => {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [secteurs, setSecteurs] = useState<SecteurActivite[]>([]);
  const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedOffres, fetchedSecteurs] = await Promise.all([
          fetchOffresWithSecteurs(),
          fetchSecteurs()
        ]);
        
        setOffres(fetchedOffres);
        setSecteurs(fetchedSecteurs);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleBrowseOffres = () => {
    navigate('/marketplace');
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label>Offres</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Filter offers by selected sectors if any are selected
  const filteredOffres = selectedSecteurs.length > 0
    ? offres.filter(offre => 
        offre.secteurs && offre.secteurs.some(secteur => 
          selectedSecteurs.includes(secteur.id)
        )
      )
    : offres;

  // Regrouper les offres par type
  const offresByType: Record<string, Offre[]> = {};
  filteredOffres.forEach(offre => {
    if (!offresByType[offre.type]) {
      offresByType[offre.type] = [];
    }
    offresByType[offre.type].push(offre);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Offres proposées</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtrer par secteur</span>
                <span className="inline sm:hidden">Filtrer</span>
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
                        id={`selector-secteur-${secteur.id}`}
                        checked={selectedSecteurs.includes(secteur.id)}
                        onCheckedChange={() => handleSecteurChange(secteur.id)}
                      />
                      <div>
                        <label
                          htmlFor={`selector-secteur-${secteur.id}`}
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
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBrowseOffres}
            className="flex items-center gap-1.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Parcourir le catalogue</span>
            <span className="inline sm:hidden">Catalogue</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(offresByType).map(([type, typeOffres]) => (
          <Card key={type} className="overflow-hidden">
            <div className="bg-muted px-4 py-2 font-medium flex justify-between items-center">
              <span>{type}</span>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleBrowseOffres}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <CardContent className="p-4">
              {typeOffres.map((offre) => (
                <div key={offre.id} className="flex items-start space-x-2 py-2">
                  <Checkbox
                    id={`offre-${offre.id}`}
                    checked={selectedOffres.includes(offre.id)}
                    onCheckedChange={() => onOffreChange(offre.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`offre-${offre.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {offre.nom}
                      {hasPermission(['superviseur', 'responsable']) && offre.prix && (
                        <span className="ml-2 text-muted-foreground">
                          ({offre.prix} €)
                        </span>
                      )}
                    </label>
                    {offre.description && (
                      <p className="text-xs text-muted-foreground">
                        {offre.description.substring(0, 100)}
                        {offre.description.length > 100 && "..."}
                      </p>
                    )}
                    {offre.secteurs && offre.secteurs.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {offre.secteurs.slice(0, 2).map(secteur => (
                          <Badge 
                            key={secteur.id} 
                            variant="outline" 
                            className="text-[10px] py-0 h-5"
                          >
                            {secteur.nom}
                          </Badge>
                        ))}
                        {offre.secteurs.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] py-0 h-5"
                          >
                            +{offre.secteurs.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typeOffres.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Aucune offre disponible
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {Object.keys(offresByType).length === 0 && (
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Aucune offre ne correspond aux filtres sélectionnés
              </p>
              {selectedSecteurs.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setSelectedSecteurs([])}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OffresSelector;
