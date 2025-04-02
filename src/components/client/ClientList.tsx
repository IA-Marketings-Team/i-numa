
import React, { useState, useEffect } from 'react';
import ClientCard from './ClientCard';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUser } from '@/lib/realm';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [isLoading, setIsLoading] = useState(true);
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
        
        const clientsData = result.map((client: any) => ({
          id: client._id.toString(),
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone || '',
          secteurActivite: client.secteurActivite || '',
          typeEntreprise: client.typeEntreprise || '',
          besoins: client.besoins || '',
          dateCreation: new Date(client.dateCreation)
        }));
        
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [getToken]);

  useEffect(() => {
    // Filtrer et trier les clients lorsque les critères changent
    if (clients.length > 0) {
      let result = [...clients];
      
      // Filtrer par terme de recherche
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(client => 
          client.nom.toLowerCase().includes(term) || 
          client.prenom.toLowerCase().includes(term) || 
          client.email.toLowerCase().includes(term) ||
          (client.telephone && client.telephone.toLowerCase().includes(term))
        );
      }
      
      // Trier les résultats
      result.sort((a, b) => {
        switch (sortBy) {
          case 'nom':
            return a.nom.localeCompare(b.nom);
          case 'prenom':
            return a.prenom.localeCompare(b.prenom);
          case 'date':
            return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
          default:
            return 0;
        }
      });
      
      setFilteredClients(result);
    }
  }, [clients, searchTerm, sortBy]);

  if (isLoading) {
    return <div className="flex justify-center my-8">Chargement des clients...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:flex-1"
        />
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nom">Nom</SelectItem>
              <SelectItem value="prenom">Prénom</SelectItem>
              <SelectItem value="date">Date d'ajout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;
