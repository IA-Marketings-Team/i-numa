
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { offres as mockOffres } from "@/data/mockData";

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
  return (
    <div className="space-y-2">
      <Label>Offres</Label>
      <div className="border rounded-md p-4 space-y-2">
        {mockOffres.map((offre) => (
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
        ))}
      </div>
    </div>
  );
};

export default OffresSelector;
