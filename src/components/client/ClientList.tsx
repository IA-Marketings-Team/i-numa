
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@/types";
import { clients } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, FileEdit, Trash2, Search, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(
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

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      // Dans une application réelle, cette action serait gérée par un contexte ou un appel API
      console.log(`Suppression du client ${clientId}`);
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
                          onClick={() => handleDeleteClient(client.id)}
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
    </div>
  );
};

export default ClientList;
