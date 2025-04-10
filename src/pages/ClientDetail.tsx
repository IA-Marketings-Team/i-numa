
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchClientById } from "@/services/client/clientService";
import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Edit, 
  Trash,
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  FileText,
  Globe,
  MessageSquare
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteClient } from "@/services/client/clientService";

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const clientData = await fetchClientById(id);
        if (clientData) {
          setClient(clientData);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Client introuvable",
          });
          navigate("/clients");
        }
      } catch (error) {
        console.error("Error loading client:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations du client.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id, navigate, toast]);

  const handleDeleteClient = async () => {
    if (!client) return;
    
    try {
      await deleteClient(client.id);
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le client.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Chargement des informations client...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Client introuvable</p>
        <Button onClick={() => navigate("/clients")} className="mt-4">
          Retour à la liste des clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/clients")} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/clients/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{client.prenom} {client.nom}</CardTitle>
          <CardDescription>Client depuis le {client.dateCreation.toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations de contact</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{client.telephone || "Non renseigné"}</p>
                  <p className="text-sm text-gray-500">Téléphone</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{client.email}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>
              
              {client.adresse && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {client.adresse}
                      {client.codePostal || client.ville ? (
                        <>
                          <br />
                          {client.codePostal} {client.ville}
                        </>
                      ) : null}
                    </p>
                    <p className="text-sm text-gray-500">Adresse</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations professionnelles</h3>
            <div className="space-y-2">
              {client.secteurActivite && (
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{client.secteurActivite}</p>
                    <p className="text-sm text-gray-500">Secteur d'activité</p>
                  </div>
                </div>
              )}
              
              {client.typeEntreprise && (
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{client.typeEntreprise}</p>
                    <p className="text-sm text-gray-500">Type d'entreprise</p>
                  </div>
                </div>
              )}
              
              {client.siteWeb && (
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      <a 
                        href={client.siteWeb.startsWith("http") ? client.siteWeb : `https://${client.siteWeb}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {client.siteWeb}
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">Site web</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            {client.besoins && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Besoins
                </h3>
                <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                  {client.besoins}
                </p>
              </div>
            )}
            
            {client.commentaires && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  Commentaires internes
                </h3>
                <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                  {client.commentaires}
                </p>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations bancaires</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">IBAN</p>
            <p className="font-mono">{client.iban || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">BIC</p>
            <p className="font-mono">{client.bic || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Banque</p>
            <p>{client.nomBanque || "Non renseignée"}</p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le client sera définitivement supprimé 
              de notre base de données. Toutes les données associées à ce client pourraient 
              également être supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientDetail;
