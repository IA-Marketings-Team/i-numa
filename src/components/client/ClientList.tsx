
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@/types";
import { clients } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, FileEdit, Trash2, Search, UserPlus, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [clientsList, setClientsList] = useState([...clients]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callNotes, setCallNotes] = useState("");

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clientsList.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/${clientId}/edit`);
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      // Mock delete: filter the client out of our local state
      setClientsList(prevClients => prevClients.filter(c => c.id !== selectedClient.id));
      toast({
        title: "Client supprimé",
        description: `${selectedClient.prenom} ${selectedClient.nom} a été supprimé avec succès.`
      });
      setIsDeleting(false);
      setSelectedClient(null);
    }
  };

  const handleCallClient = () => {
    if (selectedClient) {
      toast({
        title: "Appel terminé",
        description: `Les notes de l'appel avec ${selectedClient.prenom} ${selectedClient.nom} ont été enregistrées.`
      });
      setIsCalling(false);
      setSelectedClient(null);
      setCallNotes("");
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
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id} className="shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {client.nom} {client.prenom}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">{client.email}</p>
                      <p className="text-gray-600">{client.telephone}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {client.secteurActivite}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {client.typeEntreprise}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClient(client.id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Voir</span>
                    </Button>
                    
                    {hasPermission(['agent_phoner', 'agent_visio']) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsCalling(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">Appeler</span>
                      </Button>
                    )}
                    
                    {hasPermission(['superviseur', 'responsable']) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(client.id)}
                          className="flex items-center gap-1"
                        >
                          <FileEdit className="w-4 h-4" />
                          <span className="hidden sm:inline">Modifier</span>
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client);
                            setIsDeleting(true);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Supprimer</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
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
