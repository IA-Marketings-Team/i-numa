
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clients } from "@/data/mockData";

interface ClientSelectorProps {
  selectedClient: string;
  onClientChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  selectedClient, 
  onClientChange,
  disabled = false,
  error
}) => {
  
  // Log component rendering
  useEffect(() => {
    console.log("[ClientSelector] Component mounted:", { 
      hasSelectedClient: !!selectedClient,
      clientId: selectedClient,
      disabled,
      hasError: !!error
    });
  }, [selectedClient, disabled, error]);

  const handleClientChange = (value: string) => {
    console.log("[ClientSelector] Client selection changed:", { 
      from: selectedClient || "none", 
      to: value 
    });
    onClientChange(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="client" className={error ? "text-destructive" : ""}>Client *</Label>
      <Select
        value={selectedClient || undefined}
        onValueChange={handleClientChange}
        disabled={disabled}
      >
        <SelectTrigger id="client" className={error ? "border-destructive ring-destructive" : ""}>
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default ClientSelector;
