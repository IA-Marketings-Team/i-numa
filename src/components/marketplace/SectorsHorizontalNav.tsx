
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  ShoppingBag, 
  Home, 
  Utensils, 
  Car, 
  Briefcase, 
  Users,
  Bed,
  Heart,
  Sparkles,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Sector {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SectorsHorizontalNavProps {
  selectedSector: string;
  onSelectSector: (sector: string) => void;
}

// Default fallback sectors in case of API failure
const defaultSectors: Sector[] = [
  { id: "all", name: "Tous les secteurs", icon: <Sparkles className="h-4 w-4" /> },
  { id: "restaurant", name: "Restaurants", icon: <Utensils className="h-4 w-4" /> },
  { id: "retail", name: "Commerce", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "real_estate", name: "Immobilier", icon: <Home className="h-4 w-4" /> },
  { id: "automotive", name: "Automobile", icon: <Car className="h-4 w-4" /> },
  { id: "business", name: "Services professionnels", icon: <Briefcase className="h-4 w-4" /> },
  { id: "health", name: "Santé", icon: <Heart className="h-4 w-4" /> },
  { id: "hospitality", name: "Hôtellerie", icon: <Bed className="h-4 w-4" /> },
  { id: "education", name: "Éducation", icon: <Users className="h-4 w-4" /> },
  { id: "other", name: "Autres", icon: <Building className="h-4 w-4" /> },
];

// Map to assign an icon to each sector based on its id
const getIconForSector = (sectorId: string): React.ReactNode => {
  switch(sectorId) {
    case "restaurant":
      return <Utensils className="h-4 w-4" />;
    case "retail":
    case "commerce":
      return <ShoppingBag className="h-4 w-4" />;
    case "real_estate":
    case "immobilier":
      return <Home className="h-4 w-4" />;
    case "automotive":
    case "automobile":
      return <Car className="h-4 w-4" />;
    case "business":
    case "services_professionnels":
      return <Briefcase className="h-4 w-4" />;
    case "health":
    case "sante":
      return <Heart className="h-4 w-4" />;
    case "hospitality":
    case "hotellerie":
      return <Bed className="h-4 w-4" />;
    case "education":
      return <Users className="h-4 w-4" />;
    case "all":
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Building className="h-4 w-4" />;
  }
};

const SectorsHorizontalNav: React.FC<SectorsHorizontalNavProps> = ({ 
  selectedSector,
  onSelectSector 
}) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoading(true);
        
        // Fetch sectors from Supabase
        const { data, error } = await supabase
          .from('secteurs_activite')
          .select('id, nom, description')
          .order('nom');
        
        if (error) {
          console.error("Error fetching sectors:", error);
          setSectors(defaultSectors);
          return;
        }
        
        // Add the "All sectors" option at the beginning
        const allSectorsOption: Sector = {
          id: "all",
          name: "Tous les secteurs",
          icon: <Sparkles className="h-4 w-4" />
        };
        
        // Map the data from Supabase to our Sector format
        const sectorsFromDb = data.map(sector => ({
          id: sector.id,
          name: sector.nom,
          icon: getIconForSector(sector.nom.toLowerCase())
        }));
        
        setSectors([allSectorsOption, ...sectorsFromDb]);
      } catch (error) {
        console.error("Failed to fetch sectors:", error);
        setSectors(defaultSectors);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSectors();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 py-3 px-4 mb-6">
        <div className="container mx-auto">
          <div className="flex justify-center py-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Chargement des secteurs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 py-3 px-4 mb-6">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2">
          {sectors.map((sector) => (
            <Button
              key={sector.id}
              variant={selectedSector === sector.id ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap flex-shrink-0 ${
                selectedSector === sector.id 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                  : ""
              }`}
              onClick={() => onSelectSector(sector.id)}
            >
              {sector.icon}
              <span className="ml-1.5">{sector.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorsHorizontalNav;

// Ajouter le CSS pour no-scrollbar si nécessaire
// Vous pouvez ajouter ceci dans votre CSS global
/*
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
