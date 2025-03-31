
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clients } from "@/data/mockData";

interface ClientSelectorProps {
  selectedClient: string;
  onClientChange: (value: string) => void;
  disabled?: boolean;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  selectedClient, 
  onClientChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="client">Client</Label>
      <Select
        value={selectedClient}
        onValueChange={onClientChange}
        disabled={disabled}
      >
        <SelectTrigger id="client">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.nom} {client.prenom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
