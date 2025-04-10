
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DossierStatus } from "@/types";

interface StatusSelectorProps {
  status: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  status,
  onStatusChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Statut du dossier</Label>
      <Select 
        value={status} 
        onValueChange={onStatusChange}
        disabled={disabled}
      >
        <SelectTrigger id="status" className="w-full">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="prospect_chaud">Prospect à chaud</SelectItem>
          <SelectItem value="prospect_froid">Prospect à froid</SelectItem>
          <SelectItem value="rdv_honore">RDV honoré</SelectItem>
          <SelectItem value="rdv_non_honore">RDV non honoré</SelectItem>
          <SelectItem value="valide">Validé</SelectItem>
          <SelectItem value="signe">Signé</SelectItem>
          <SelectItem value="archive">Archivé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
