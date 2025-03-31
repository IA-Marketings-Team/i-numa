
import { useParams, useNavigate } from "react-router-dom";
import { clients } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Mail, Phone, MapPin, Building, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  // Rechercher le client avec l'ID spécifié
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Client non trouvé</p>
        <Button variant="outline" onClick={() => navigate("/clients")} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Button>
        
        {hasPermission(['superviseur', 'responsable']) && (
          <Button onClick={() => navigate(`/clients/${client.id}/edit`)}>
            Modifier
          </Button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {client.nom} {client.prenom}
            </h1>
            <p className="text-gray-600">Client depuis le {new Date(client.dateCreation).toLocaleDateString("fr-FR")}</p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Envoyer un email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Appeler
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-gray-600">{client.telephone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-gray-600">{client.adresse}</p>
              </div>
            </div>
            
            {hasPermission(['responsable']) && client.iban && (
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">IBAN</p>
                  <p className="text-gray-600 font-mono">{client.iban}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              Informations professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Secteur d'activité</p>
              <p className="text-gray-600">{client.secteurActivite}</p>
            </div>
            
            <div>
              <p className="font-medium">Type d'entreprise</p>
              <p className="text-gray-600">{client.typeEntreprise}</p>
            </div>
            
            <div>
              <p className="font-medium">Besoins</p>
              <p className="text-gray-600">{client.besoins}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPage;
