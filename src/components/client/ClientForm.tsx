
import React, { useState, useEffect } from "react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ClientFormProps {
  client?: Client;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
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
    statutJuridique: "",
    activiteDetail: "",
    siteWeb: "",
    besoins: "",
    iban: "",
    bic: "",
    nomBanque: "",
    moyensCommunication: [],
    commentaires: ""
  });

  useEffect(() => {
    if (client) {
      setFormData({
        nom: client.nom || "",
        prenom: client.prenom || "",
        email: client.email || "",
        telephone: client.telephone || "",
        adresse: client.adresse || "",
        ville: client.ville || "",
        codePostal: client.codePostal || "",
        secteurActivite: client.secteurActivite || "",
        typeEntreprise: client.typeEntreprise || "",
        statutJuridique: client.statutJuridique || "",
        activiteDetail: client.activiteDetail || "",
        siteWeb: client.siteWeb || "",
        besoins: client.besoins || "",
        iban: client.iban || "",
        bic: client.bic || "",
        nomBanque: client.nomBanque || "",
        moyensCommunication: client.moyensCommunication || [],
        commentaires: client.commentaires || ""
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
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
            onClick={() => onCancel()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? "En cours..." 
              : client ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;
