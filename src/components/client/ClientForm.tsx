
import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Client } from "@/types";
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming you have a MultiSelect component

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      nom: client?.nom || '',
      prenom: client?.prenom || '',
      email: client?.email || '',
      telephone: client?.telephone || '',
      adresse: client?.adresse || '',
      ville: client?.ville || '',
      codePostal: client?.codePostal || '',
      secteurActivite: client?.secteurActivite || '',
      typeEntreprise: client?.typeEntreprise || '',
      besoins: client?.besoins || '',
      statutJuridique: client?.statutJuridique || '',
      activiteDetail: client?.activiteDetail || '',
      siteWeb: client?.siteWeb || '',
      moyensCommunication: client?.moyensCommunication || [],
      commentaires: client?.commentaires || ''
    }
  });

  const communicationOptions = [
    { value: 'GMB', label: 'Google My Business' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Site web', label: 'Site web' },
    { value: 'Flyers', label: 'Flyers' },
    { value: 'Email', label: 'Email' },
    { value: 'SMS', label: 'SMS' }
  ];

  const selectedCommunications = watch('moyensCommunication') || [];

  const handleCommunicationChange = (selected: string[]) => {
    setValue('moyensCommunication', selected);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom / Nom de l'entreprise</Label>
          <Input id="nom" {...register('nom')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom / Nom du gérant</Label>
          <Input id="prenom" {...register('prenom')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" {...register('telephone')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="adresse">Adresse</Label>
          <Input id="adresse" {...register('adresse')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="codePostal">Code postal</Label>
          <Input id="codePostal" {...register('codePostal')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="ville">Ville</Label>
          <Input id="ville" {...register('ville')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="secteurActivite">Secteur d'activité</Label>
          <Input id="secteurActivite" {...register('secteurActivite')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="activiteDetail">Description de l'activité</Label>
          <Input id="activiteDetail" {...register('activiteDetail')} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="statutJuridique">Statut juridique</Label>
          <Select 
            defaultValue={client?.statutJuridique || ''}
            onValueChange={(value) => setValue('statutJuridique', value)} 
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le statut juridique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SAS">SAS</SelectItem>
              <SelectItem value="SASU">SASU</SelectItem>
              <SelectItem value="SARL">SARL</SelectItem>
              <SelectItem value="EURL">EURL</SelectItem>
              <SelectItem value="Micro-entrepreneur">Micro-entrepreneur</SelectItem>
              <SelectItem value="EI">Entreprise Individuelle</SelectItem>
              <SelectItem value="SCI">SCI</SelectItem>
              <SelectItem value="Association">Association</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="typeEntreprise">Type d'entreprise</Label>
          <Select 
            defaultValue={client?.typeEntreprise || ''}
            onValueChange={(value) => setValue('typeEntreprise', value)} 
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PME">PME</SelectItem>
              <SelectItem value="TPE">TPE</SelectItem>
              <SelectItem value="ETI">ETI</SelectItem>
              <SelectItem value="Indépendant">Indépendant</SelectItem>
              <SelectItem value="Profession libérale">Profession libérale</SelectItem>
              <SelectItem value="Commerçant">Commerçant</SelectItem>
              <SelectItem value="Artisan">Artisan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="siteWeb">Site web</Label>
          <Input id="siteWeb" {...register('siteWeb')} disabled={isLoading} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="moyensCommunication">Moyens de communication actuels</Label>
          <MultiSelect 
            options={communicationOptions}
            selected={selectedCommunications}
            onChange={handleCommunicationChange}
            placeholder="Sélectionnez les moyens de communication"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="besoins">Besoins</Label>
          <Textarea id="besoins" {...register('besoins')} rows={3} disabled={isLoading} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="commentaires">Commentaires</Label>
          <Textarea id="commentaires" {...register('commentaires')} rows={4} disabled={isLoading} />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
          {client ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
