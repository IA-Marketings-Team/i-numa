
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient, updateClient } from "@/services/client/clientService";

interface ClientFormProps {
  initialData?: Client;
  isEditing?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  initialData,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>(initialData || {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    iban: "",
    bic: "",
    nomBanque: "",
    secteurActivite: "",
    typeEntreprise: "",
    besoins: "",
    statutJuridique: "",
    activiteDetail: "",
    siteWeb: "",
    moyensCommunication: [],
    commentaires: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.nom || !formData.prenom || !formData.email) {
        toast({
          variant: "destructive",
          title: "Champs obligatoires",
          description: "Veuillez remplir tous les champs obligatoires.",
        });
        setIsSubmitting(false);
        return;
      }

      if (isEditing && initialData) {
        // Update existing client
        const success = await updateClient(initialData.id, formData);
        if (success) {
          toast({
            title: "Client mis à jour",
            description: "Les informations du client ont été mises à jour avec succès.",
          });
          navigate(`/clients/${initialData.id}`);
        } else {
          throw new Error("La mise à jour a échoué");
        }
      } else {
        // Create new client
        const newClient = await createClient(formData as Omit<Client, 'id' | 'dateCreation' | 'role'>);
        if (newClient) {
          toast({
            title: "Client créé",
            description: "Le client a été créé avec succès.",
          });
          navigate(`/clients/${newClient.id}`);
        } else {
          throw new Error("La création a échoué");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: isEditing 
          ? "Impossible de mettre à jour le client." 
          : "Impossible de créer le client.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                value={formData.adresse || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code postal</Label>
                <Input
                  id="codePostal"
                  name="codePostal"
                  value={formData.codePostal || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                  value={formData.secteurActivite || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeEntreprise">Type d'entreprise</Label>
                <Input
                  id="typeEntreprise"
                  name="typeEntreprise"
                  value={formData.typeEntreprise || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statutJuridique">Statut juridique</Label>
                <Input
                  id="statutJuridique"
                  name="statutJuridique"
                  value={formData.statutJuridique || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteWeb">Site web</Label>
                <Input
                  id="siteWeb"
                  name="siteWeb"
                  value={formData.siteWeb || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activiteDetail">Détail de l'activité</Label>
              <Textarea
                id="activiteDetail"
                name="activiteDetail"
                value={formData.activiteDetail || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="besoins">Besoins</Label>
              <Textarea
                id="besoins"
                name="besoins"
                value={formData.besoins || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations bancaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  name="iban"
                  value={formData.iban || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bic">BIC</Label>
                <Input
                  id="bic"
                  name="bic"
                  value={formData.bic || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomBanque">Nom de la banque</Label>
                <Input
                  id="nomBanque"
                  name="nomBanque"
                  value={formData.nomBanque || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes internes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="commentaires">Commentaires</Label>
              <Textarea
                id="commentaires"
                name="commentaires"
                value={formData.commentaires || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isEditing && initialData ? `/clients/${initialData.id}` : "/clients")}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (isEditing ? "Mise à jour..." : "Création...") 
              : (isEditing ? "Mettre à jour" : "Créer")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;
