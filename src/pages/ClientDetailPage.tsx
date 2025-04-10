
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClientById } from "@/services/clientService";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Mail, Phone, MapPin, Building, FileText, Edit, Trash, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
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
import ClientContactModal from "@/components/client/ClientContactModal";

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactType, setContactType] = useState<"email" | "call" | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadClient = async () => {
      setIsLoading(true);
      try {
        const data = await fetchClientById(id);
        if (data) {
          setClient(data);
        } else {
          toast({
            title: "Client introuvable",
            description: "Le client demandé n'existe pas ou a été supprimé.",
            variant: "destructive",
          });
          navigate("/clients");
        }
      } catch (error) {
        console.error("Error loading client:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du client.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClient();
  }, [id, navigate, toast]);

  const handleDeleteClient = async () => {
    // This will be implemented in the delete modal
    setIsDeleteDialogOpen(false);
    navigate("/clients");
  };

  const canManageClients = ["superviseur", "responsable"].includes(user?.role || "");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500 mb-4">Client introuvable</p>
            <Button onClick={() => navigate("/clients")}>
              Retour à la liste des clients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
        
        {canManageClients && (
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
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        )}
      </div>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-xl mb-2 md:mb-0">
              {client.prenom} {client.nom}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setContactType("email")}
              >
                <Mail className="h-4 w-4" />
                Envoyer un email
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setContactType("call")}
              >
                <Phone className="h-4 w-4" />
                Appeler
              </Button>
              <Button 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate(`/dossiers/nouveau`, { state: { client } })}
              >
                <Plus className="h-4 w-4" />
                Nouveau dossier
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="dossiers">Dossiers</TabsTrigger>
              <TabsTrigger value="historique">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      Coordonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-sm text-muted-foreground">{client.telephone || "Non renseigné"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-sm text-muted-foreground">
                          {client.adresse ? (
                            <>
                              {client.adresse}
                              {client.codePostal && client.ville && (
                                <><br />{client.codePostal} {client.ville}</>
                              )}
                            </>
                          ) : (
                            "Non renseignée"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      Informations professionnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium">Secteur d'activité</p>
                      <p className="text-sm text-muted-foreground">
                        {client.secteurActivite || "Non renseigné"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Type d'entreprise</p>
                      <p className="text-sm text-muted-foreground">
                        {client.typeEntreprise || "Non renseigné"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Besoins</p>
                      <p className="text-sm text-muted-foreground">
                        {client.besoins || "Non renseignés"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {canManageClients && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Informations bancaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-medium">IBAN</p>
                          <p className="text-sm text-muted-foreground">
                            {client.iban || "Non renseigné"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium">BIC</p>
                          <p className="text-sm text-muted-foreground">
                            {client.bic || "Non renseigné"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium">Banque</p>
                          <p className="text-sm text-muted-foreground">
                            {client.nomBanque || "Non renseignée"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="dossiers">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dossiers associés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-10">
                    Les dossiers associés à ce client seront affichés ici.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="historique">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historique des interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-10">
                    L'historique des interactions avec ce client sera affiché ici.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
              Tous les dossiers et données associés à ce client seront également supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClient}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {contactType && (
        <ClientContactModal
          type={contactType}
          client={client}
          isOpen={!!contactType}
          onClose={() => setContactType(null)}
        />
      )}
    </div>
  );
};

export default ClientDetailPage;
