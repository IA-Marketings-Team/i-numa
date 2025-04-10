
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClientById, updateClient } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Client } from "@/types";

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    nomBanque: "",
    statutJuridique: "",
    activiteDetail: "",
    siteWeb: "",
    moyensCommunication: [] as string[],
    commentaires: ""
  });

  useEffect(() => {
    if (!id) return;
    
    const loadClient = async () => {
      setInitialLoading(true);
      try {
        const clientData = await fetchClientById(id);
        if (clientData) {
          setClient(clientData);
          // Initialize form with client data
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
            nomBanque: clientData.nomBanque || "",
            statutJuridique: clientData.statutJuridique || "",
            activiteDetail: clientData.activiteDetail || "",
            siteWeb: clientData.siteWeb || "",
            moyensCommunication: clientData.moyensCommunication || [],
            commentaires: clientData.commentaires || ""
          });
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
          description: "Impossible de charger les données du client.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
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

  const validateForm = () => {
    // Validation simple
    if (!formData.nom || !formData.prenom || !formData.email) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return false;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez fournir une adresse email valide.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // Prepare client data for update
      const updatedData: Partial<Omit<Client, 'id' | 'dateCreation' | 'role'>> = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        codePostal: formData.codePostal,
        secteurActivite: formData.secteurActivite,
        typeEntreprise: formData.typeEntreprise,
        besoins: formData.besoins,
        iban: formData.iban,
        bic: formData.bic,
        nomBanque: formData.nomBanque,
        statutJuridique: formData.statutJuridique,
        activiteDetail: formData.activiteDetail,
        siteWeb: formData.siteWeb,
        moyensCommunication: formData.moyensCommunication,
        commentaires: formData.commentaires
      };
      
      const success = await updateClient(id, updatedData);
      
      if (success) {
        toast({
          title: "Client mis à jour",
          description: "Les informations du client ont été mises à jour avec succès."
        });
        
        navigate(`/clients/${id}`);
      } else {
        throw new Error("Erreur lors de la mise à jour du client");
      }
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

  // Vérifier si l'utilisateur a le droit de modifier des clients
  const canEditClient = ["superviseur", "responsable"].includes(user?.role || "");
  
  if (!canEditClient) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vous n'avez pas les permissions nécessaires pour modifier un client.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/clients")}>
              Retour à la liste des clients
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Modification du client</h1>
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Client introuvable</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Le client demandé n'existe pas ou a été supprimé.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/clients")}>
              Retour à la liste des clients
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier le client</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/clients/${id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux détails
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
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
                <Label htmlFor="email">Email *</Label>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input
                  id="codePostal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statutJuridique">Statut juridique</Label>
                <Select 
                  value={formData.statutJuridique} 
                  onValueChange={(value) => handleSelectChange("statutJuridique", value)}
                >
                  <SelectTrigger id="statutJuridique">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SARL">SARL</SelectItem>
                    <SelectItem value="SAS">SAS</SelectItem>
                    <SelectItem value="SASU">SASU</SelectItem>
                    <SelectItem value="EURL">EURL</SelectItem>
                    <SelectItem value="EI">Entreprise Individuelle</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="SCI">SCI</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteWeb">Site web</Label>
                <Input
                  id="siteWeb"
                  name="siteWeb"
                  value={formData.siteWeb}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activiteDetail">Détails de l'activité</Label>
              <Textarea
                id="activiteDetail"
                name="activiteDetail"
                value={formData.activiteDetail}
                onChange={handleChange}
                placeholder="Description détaillée de l'activité..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="besoins">Besoins</Label>
              <Textarea
                id="besoins"
                name="besoins"
                value={formData.besoins}
                onChange={handleChange}
                placeholder="Besoins spécifiques du client..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
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
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="commentaires">Commentaires internes</Label>
              <Textarea
                id="commentaires"
                name="commentaires"
                value={formData.commentaires}
                onChange={handleChange}
                className="min-h-[150px]"
                placeholder="Notes et commentaires internes sur le client..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/clients/${id}`)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "Mise à jour..." : (
                <>
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ClientEditPage;
