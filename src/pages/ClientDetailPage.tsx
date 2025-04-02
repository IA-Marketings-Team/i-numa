
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, Edit, Trash2, PhoneCall, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchClientById, deleteClient } from "@/services/clientService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les données du client
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
            title: "Client introuvable",
            description: "Le client demandé n'existe pas ou a été supprimé."
          });
          navigate("/clients");
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du client."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClient();
  }, [id, navigate, toast]);

  const handleDeleteClient = async () => {
    if (!client || !id) return;
    
    try {
      await deleteClient(id);
      
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès."
      });
      
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du client."
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chargement...</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-600 mb-4">Client introuvable</p>
          <Button variant="outline" onClick={() => navigate("/clients")} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Détail du client</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informations personnelles</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/clients/${id}/modifier`)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nom complet</p>
                  <p className="text-lg">{client.prenom} {client.nom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg">{client.email}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => window.open(`mailto:${client.email}`)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléphone</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg">{client.telephone || "Non renseigné"}</p>
                    {client.telephone && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => window.open(`tel:${client.telephone}`)}
                      >
                        <PhoneCall className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de création</p>
                  <p className="text-lg">
                    {format(new Date(client.dateCreation), "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <p className="text-lg">
                  {client.adresse ? (
                    <>
                      {client.adresse}
                      {(client.codePostal || client.ville) && (
                        <>, {client.codePostal} {client.ville}</>
                      )}
                    </>
                  ) : (
                    "Non renseignée"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Secteur d'activité</p>
                  <p className="text-lg">{client.secteurActivite || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type d'entreprise</p>
                  <p className="text-lg">
                    {client.typeEntreprise ? (
                      <Badge variant="outline">{client.typeEntreprise}</Badge>
                    ) : (
                      "Non renseigné"
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Besoins</p>
                <p className="whitespace-pre-wrap">
                  {client.besoins || "Aucun besoin spécifié"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informations bancaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">IBAN</p>
                  <p className="text-lg font-mono">{client.iban || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">BIC</p>
                  <p className="text-lg font-mono">{client.bic || "Non renseigné"}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Banque</p>
                <p className="text-lg">{client.nomBanque || "Non renseignée"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full flex items-center justify-start gap-2" 
                variant="outline"
                onClick={() => navigate(`/clients/${id}/modifier`)}
              >
                <Edit className="w-4 h-4" />
                Modifier le client
              </Button>
              
              <Button 
                className="w-full flex items-center justify-start gap-2" 
                variant="outline"
                onClick={() => navigate(`/dossiers/nouveau?client=${id}`)}
              >
                <Edit className="w-4 h-4" />
                Créer un dossier
              </Button>
              
              {client.telephone && (
                <Button 
                  className="w-full flex items-center justify-start gap-2" 
                  variant="outline"
                  onClick={() => window.open(`tel:${client.telephone}`)}
                >
                  <PhoneCall className="w-4 h-4" />
                  Appeler
                </Button>
              )}
              
              <Button 
                className="w-full flex items-center justify-start gap-2 text-red-600 hover:text-red-700" 
                variant="outline"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer le client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Êtes-vous sûr de vouloir supprimer le client {client.prenom} {client.nom} ? 
            Cette action est irréversible et supprimera également tous les dossiers associés.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteClient}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetailPage;
