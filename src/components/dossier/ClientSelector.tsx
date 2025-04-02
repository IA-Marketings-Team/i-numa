
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUser } from '@/lib/realm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ value, onChange }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Pas de token d'authentification disponible");
        }

        const realmUser = getCurrentUser();
        if (!realmUser) {
          throw new Error("Utilisateur Realm non connecté");
        }

        const clientsCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
        const result = await clientsCollection.find({ role: 'client' });
        
        setClients(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [getToken]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un client" />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Chargement des clients...
          </SelectItem>
        ) : (
          clients.map((client) => (
            <SelectItem key={client._id.toString()} value={client._id.toString()}>
              {client.prenom} {client.nom}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default ClientSelector;
