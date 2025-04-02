
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchClientById, updateClient } from "@/services/clientService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    secteurActivite: "",
    typeEntreprise: "",
    besoins: "",
    iban: "",
    bic: "",
    nomBanque: ""
  });

  // Charger les données du client
  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const clientData = await fetchClientById(id);
        if (clientData) {
          setClient(clientData);
          setFormData({
            nom: clientData.nom || "",
            prenom: clientData.prenom || "",
            email: clientData.email || "",
            telephone: clientData.telephone || "",
            adresse: clientData.adresse || "",
            ville: clientData.ville || "",
            codePostal: clientData.codePostal || "",
            secteurActivite: clientData.secteurActivite || "",
            typeEntreprise: clientData.typeEntreprise || "",
            besoins: clientData.besoins || "",
            iban: clientData.iban || "",
            bic: clientData.bic || "",
            nomBanque: clientData.nomBanque || ""
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client || !id) return;
    
    try {
      setIsLoading(true);
      await updateClient(id, formData);
      
      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès."
      });
      
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client."
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier le client</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input
                  id="codePostal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secteurActivite">Secteur d'activité</Label>
                <Input
                  id="secteurActivite"
                  name="secteurActivite"
                  value={formData.secteurActivite}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeEntreprise">Type d'entreprise</Label>
                <Select 
                  value={formData.typeEntreprise} 
                  onValueChange={(value) => handleSelectChange("typeEntreprise", value)}
                >
                  <SelectTrigger id="typeEntreprise">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TPE">TPE</SelectItem>
                    <SelectItem value="PME">PME</SelectItem>
                    <SelectItem value="ETI">ETI</SelectItem>
                    <SelectItem value="GE">Grande Entreprise</SelectItem>
                    <SelectItem value="Indépendant">Indépendant</SelectItem>
                    <SelectItem value="Association">Association</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="besoins">Besoins</Label>
              <Textarea
                id="besoins"
                name="besoins"
                value={formData.besoins}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations bancaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  name="iban"
                  value={formData.iban}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bic">BIC</Label>
                <Input
                  id="bic"
                  name="bic"
                  value={formData.bic}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nomBanque">Banque</Label>
              <Input
                id="nomBanque"
                name="nomBanque"
                value={formData.nomBanque}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate(`/clients/${id}`)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ClientEditPage;
