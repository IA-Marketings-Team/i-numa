
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchOffres } from "@/services/offreService";
import { Offre } from "@/types";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOffres = async () => {
      try {
        setLoading(true);
        const data = await fetchOffres();
        setOffres(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des offres:", err);
        setError("Impossible de charger les offres. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    loadOffres();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Offres</Label>
        <div className="border rounded-md p-4 flex items-center justify-center h-32 bg-white shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Chargement des offres...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Offres</Label>
        <div className="border rounded-md p-4 text-destructive bg-white shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Offres</Label>
      <div className="border rounded-md p-4 space-y-2 bg-white shadow-sm">
        {offres.length === 0 ? (
          <p className="text-muted-foreground">Aucune offre disponible</p>
        ) : (
          offres.map((offre) => (
            <div key={offre.id} className="flex items-center space-x-2">
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
                  {offre.nom} - {offre.type}
                  {hasPermission(['superviseur', 'responsable']) && offre.prix !== undefined && (
                    <span className="ml-2 text-gray-600">({offre.prix} €)</span>
                  )}
                </label>
                <p className="text-sm text-muted-foreground">
                  {offre.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OffresSelector;
