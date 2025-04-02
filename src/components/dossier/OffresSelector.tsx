
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Offre {
  id: string;
  nom: string;
  description: string;
  type: string;
  prix?: number;
}

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('offres')
          .select('*')
          .order('nom');
        
        if (error) throw error;
        setOffres(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffres();
  }, []);

  const handleBrowseOffres = () => {
    navigate('/marketplace');
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

  // Regrouper les offres par type
  const offresByType: Record<string, Offre[]> = {};
  offres.forEach(offre => {
    if (!offresByType[offre.type]) {
      offresByType[offre.type] = [];
    }
    offresByType[offre.type].push(offre);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Offres proposées</Label>
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
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OffresSelector;
