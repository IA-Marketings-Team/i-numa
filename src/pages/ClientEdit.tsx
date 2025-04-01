
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { clients } from "@/data/mock/clients";
import { Client } from "@/types";

// Définition du schéma de validation
const clientSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide" }).max(15),
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  secteurActivite: z.string().min(1, { message: "Veuillez sélectionner un secteur d'activité" }),
  typeEntreprise: z.string().min(1, { message: "Veuillez sélectionner un type d'entreprise" }),
  besoins: z.string().optional(),
  iban: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const ClientEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  // Récupérer les données du client
  useEffect(() => {
    const foundClient = clients.find(c => c.id === id);
    if (foundClient) {
      setClient(foundClient);
    } else {
      toast({
        title: "Client introuvable",
        description: "Le client que vous essayez de modifier n'existe pas.",
        variant: "destructive"
      });
      navigate("/clients");
    }
  }, [id, navigate, toast]);

  // Initialiser le formulaire avec les données du client
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: client?.nom || "",
      prenom: client?.prenom || "",
      email: client?.email || "",
      telephone: client?.telephone || "",
      adresse: client?.adresse || "",
      secteurActivite: client?.secteurActivite || "",
      typeEntreprise: client?.typeEntreprise || "",
      besoins: client?.besoins || "",
      iban: client?.iban || "",
    },
    values: client ? {
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      secteurActivite: client.secteurActivite,
      typeEntreprise: client.typeEntreprise,
      besoins: client.besoins,
      iban: client.iban || "",
    } : undefined
  });

  // Mettre à jour les valeurs du formulaire lorsque le client change
  useEffect(() => {
    if (client) {
      form.reset({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        secteurActivite: client.secteurActivite,
        typeEntreprise: client.typeEntreprise,
        besoins: client.besoins,
        iban: client.iban || "",
      });
    }
  }, [client, form]);

  const onSubmit = (data: ClientFormValues) => {
    if (!client) return;
    
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      // Mettre à jour le client dans notre liste mockée
      const index = clients.findIndex(c => c.id === id);
      if (index !== -1) {
        const updatedClient: Client = {
          ...client,
          ...data,
          besoins: data.besoins || "",
        };
        
        clients[index] = updatedClient;
        
        toast({
          title: "Client mis à jour",
          description: `Les modifications pour ${data.prenom} ${data.nom} ont été enregistrées.`
        });
        
        setIsSubmitting(false);
        navigate(`/clients/${id}`);
      }
    }, 1000);
  };

  const handleDeleteClient = () => {
    if (!client) return;
    
    // Simuler un appel API
    setTimeout(() => {
      // Supprimer le client de notre liste mockée
      const index = clients.findIndex(c => c.id === id);
      if (index !== -1) {
        clients.splice(index, 1);
        
        toast({
          title: "Client supprimé",
          description: `${client.prenom} ${client.nom} a été supprimé avec succès.`
        });
        
        setIsDeleting(false);
        navigate("/clients");
      }
    }, 1000);
  };

  if (!client) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/clients/${id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Modifier le client</h1>
        <Button 
          variant="destructive"
          size="icon"
          onClick={() => setIsDeleting(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="jean.dupont@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Adresse *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Rue de Paris, 75001 Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secteurActivite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur d'activité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un secteur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Restauration">Restauration</SelectItem>
                          <SelectItem value="Immobilier">Immobilier</SelectItem>
                          <SelectItem value="Santé">Santé</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Education">Éducation</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeEntreprise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'entreprise *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TPE">TPE</SelectItem>
                          <SelectItem value="PME">PME</SelectItem>
                          <SelectItem value="ETI">ETI</SelectItem>
                          <SelectItem value="Grand groupe">Grand groupe</SelectItem>
                          <SelectItem value="Indépendant">Indépendant</SelectItem>
                          <SelectItem value="Profession libérale">Profession libérale</SelectItem>
                          <SelectItem value="Association">Association</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <Input placeholder="FR7630001007941234567890185" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="besoins"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Besoins client</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez les besoins du client..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate(`/clients/${id}`)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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

export default ClientEdit;
