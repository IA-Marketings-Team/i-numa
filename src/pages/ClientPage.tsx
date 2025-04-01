
import { useParams, useNavigate } from "react-router-dom";
import { clients } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Mail, Phone, MapPin, Building, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // État pour les dialogues
  const [isCallingOpen, setIsCallingOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  
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

  const handleSendEmail = () => {
    // Simulation d'envoi d'email
    if (!emailSubject || !emailBody) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs du formulaire.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email envoyé",
      description: `Un email a été envoyé à ${client.prenom} ${client.nom}.`,
    });
    
    // Réinitialiser et fermer
    setEmailSubject("");
    setEmailBody("");
    setIsEmailOpen(false);
  };

  const handleCallClient = () => {
    // Simulation d'appel client
    toast({
      title: "Appel terminé",
      description: `Les notes de l'appel avec ${client.prenom} ${client.nom} ont été enregistrées.`,
    });
    
    // Réinitialiser et fermer
    setCallNotes("");
    setIsCallingOpen(false);
  };

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
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsEmailOpen(true)}
            >
              <Mail className="w-4 h-4" />
              Envoyer un email
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsCallingOpen(true)}
            >
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

      {/* Dialog pour l'email */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer un email à {client.prenom} {client.nom}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Destinataire</Label>
              <Input 
                id="email" 
                value={client.email} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input 
                id="subject" 
                placeholder="Sujet de l'email" 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Votre message..." 
                className="min-h-[150px]"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailOpen(false)}>Annuler</Button>
            <Button onClick={handleSendEmail}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour l'appel */}
      <Dialog open={isCallingOpen} onOpenChange={setIsCallingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appel à {client.prenom} {client.nom}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-sm">Numéro de téléphone</p>
              <p className="text-lg">{client.telephone}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes d'appel</Label>
              <Textarea 
                id="notes"
                placeholder="Entrez les détails de votre appel ici..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCallingOpen(false)}>Annuler</Button>
            <Button onClick={handleCallClient}>Terminer l'appel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPage;
