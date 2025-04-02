
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Composant refactorisé
import ClientCard from "./ClientCard";

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { hasPermission, getToken } = useAuth();
  const { toast } = useToast();
  
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Chargement des clients depuis l'API MongoDB
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await fetch('/api/users/clients', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des clients");
        }

        const data = await response.json();
        setClientsList(data);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des clients"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [getToken, toast]);

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clientsList.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.secteurActivite && client.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/${clientId}/edit`);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleting(true);
  };

  const handleCallClick = (client: Client) => {
    setSelectedClient(client);
    setIsCalling(true);
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`/api/users/${selectedClient.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du client");
        }

        // Mettre à jour la liste locale des clients
        setClientsList(prevClients => prevClients.filter(c => c.id !== selectedClient.id));
        
        toast({
          title: "Client supprimé",
          description: `${selectedClient.prenom} ${selectedClient.nom} a été supprimé avec succès.`
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le client"
        });
      } finally {
        setIsLoading(false);
        setIsDeleting(false);
        setSelectedClient(null);
      }
    }
  };

  const handleCallClient = async () => {
    if (selectedClient) {
      try {
        // Enregistrer les notes d'appel
        const token = await getToken();
        const response = await fetch(`/api/users/${selectedClient.id}/call-notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          },
          body: JSON.stringify({ notes: callNotes })
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'enregistrement des notes d'appel");
        }

        toast({
          title: "Appel terminé",
          description: `Les notes de l'appel avec ${selectedClient.prenom} ${selectedClient.nom} ont été enregistrées.`
        });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des notes:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'enregistrer les notes d'appel"
        });
      } finally {
        setIsCalling(false);
        setSelectedClient(null);
        setCallNotes("");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Clients</h1>
        
        {hasPermission(['superviseur', 'responsable']) && (
          <Button 
            onClick={() => navigate("/clients/nouveau")}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Nouveau client
          </Button>
        )}
      </div>
      
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des clients...</span>
          </div>
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id} className="shadow-sm hover:shadow transition-shadow">
              <ClientCard 
                client={client} 
                onView={handleViewClient}
                onEdit={handleEditClient}
                onDelete={handleDeleteClick}
                onCall={handleCallClick}
              />
            </Card>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucun client trouvé</p>
          </div>
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Êtes-vous sûr de vouloir supprimer le client {selectedClient?.prenom} {selectedClient?.nom} ? 
            Cette action est irréversible et supprimera également tous les dossiers associés.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteClient}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour l'appel téléphonique */}
      <Dialog open={isCalling} onOpenChange={setIsCalling}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Appel à {selectedClient?.prenom} {selectedClient?.nom}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-sm">Numéro de téléphone</p>
              <p className="text-lg">{selectedClient?.telephone}</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-sm">Notes d'appel</p>
              <Textarea 
                placeholder="Entrez les détails de votre appel ici..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalling(false)}>Annuler</Button>
            <Button onClick={handleCallClient}>Terminer l'appel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientList;
