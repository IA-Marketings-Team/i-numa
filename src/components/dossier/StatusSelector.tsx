
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DossierStatus } from "@/types";

interface StatusSelectorProps {
  status: DossierStatus;
  onStatusChange: (value: DossierStatus) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ status, onStatusChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Statut</Label>
      <Select value={status} onValueChange={(value) => onStatusChange(value as DossierStatus)}>
        <SelectTrigger id="status">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="prospect">Prospect</SelectItem>
          <SelectItem value="rdv_en_cours">RDV En Cours</SelectItem>
          <SelectItem value="valide">Validé</SelectItem>
          <SelectItem value="signe">Signé</SelectItem>
          <SelectItem value="archive">Archivé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
