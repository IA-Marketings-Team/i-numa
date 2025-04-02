
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientSelectorProps {
  selectedClient: string;
  onClientChange: (clientId: string) => void;
  disabled?: boolean;
  error?: string;
}

interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClient,
  onClientChange,
  disabled = false,
  error
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nom, prenom, email')
          .eq('role', 'client');
        
        if (error) {
          throw error;
        }
        
        setClients(data || []);
        
        // Si aucun client n'est sélectionné et qu'il y a des clients disponibles, sélectionner le premier
        if (!selectedClient && data && data.length > 0) {
          onClientChange(data[0].id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
        setFetchError('Impossible de charger les clients. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [selectedClient, onClientChange]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Client</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="client" className={error ? "text-destructive" : ""}>
        Client <span className="text-destructive">*</span>
      </Label>
      
      {fetchError && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Select 
        disabled={disabled || isLoading} 
        value={selectedClient} 
        onValueChange={onClientChange}
      >
        <SelectTrigger id="client" className={error ? "border-destructive" : ""}>
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {clients.length === 0 ? (
            <SelectItem value="none" disabled>
              Aucun client disponible
            </SelectItem>
          ) : (
            clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.prenom} {client.nom} ({client.email})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
