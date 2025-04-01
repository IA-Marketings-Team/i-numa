
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, FileText, HelpCircle, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  const [activeTab, setActiveTab] = useState("faq");
  const { toast } = useToast();
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Notre équipe vous répondra dans les plus brefs délais.",
    });
    setContactSubject("");
    setContactMessage("");
    setActiveTab("faq");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Centre d'aide
          </DialogTitle>
          <DialogDescription>
            Trouvez des réponses à vos questions ou contactez notre équipe de support.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contacter le support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-4">
            <div className="grid gap-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guides" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {guides.map((guide, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      {guide.icon}
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 flex-grow">
                    <CardDescription>{guide.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Consulter le guide
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contacter notre support</CardTitle>
                <CardDescription>
                  Notre équipe de support est à votre disposition du lundi au vendredi de 9h à 18h.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Sujet
                    </label>
                    <input
                      id="subject"
                      className="w-full p-2 border rounded-md"
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="w-full p-2 border rounded-md min-h-[120px]"
                      placeholder="Décrivez votre problème en détail..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Envoyer
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-2">Autres moyens de nous contacter:</p>
                <div className="flex items-center gap-6">
                  <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Mail className="h-4 w-4" />
                    support@i-numa.fr
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <MessageSquare className="h-4 w-4" />
                    Chat en ligne
                  </a>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Données FAQ
const faqItems = [
  {
    question: "Comment créer un nouveau dossier client ?",
    answer: "Rendez-vous dans l'onglet Dossiers, puis cliquez sur le bouton 'Créer' en haut à droite. Remplissez ensuite le formulaire avec les informations du client et validez."
  },
  {
    question: "Comment planifier un rendez-vous avec un client ?",
    answer: "Depuis la page d'un dossier client, cliquez sur l'onglet 'Rendez-vous' puis sur 'Planifier un rendez-vous'. Sélectionnez la date, l'heure et le type de rendez-vous avant de confirmer."
  },
  {
    question: "Comment modifier mes informations personnelles ?",
    answer: "Accédez à la page Paramètres depuis le menu latéral, puis modifiez vos informations dans l'onglet 'Profil'."
  },
  {
    question: "Que faire si j'oublie mon mot de passe ?",
    answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié' et suivez les instructions pour réinitialiser votre mot de passe."
  },
  {
    question: "Comment puis-je consulter les statistiques de mes ventes ?",
    answer: "Accédez à l'onglet 'Statistiques' depuis le menu latéral pour visualiser vos performances commerciales."
  }
];

// Données guides
const guides = [
  {
    title: "Guide de démarrage",
    description: "Apprenez les bases de l'application i-numa et découvrez comment naviguer efficacement.",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />
  },
  {
    title: "Gestion des dossiers",
    description: "Suivez pas à pas la création et le suivi des dossiers clients.",
    icon: <FileText className="h-4 w-4 text-blue-500" />
  },
  {
    title: "Planification des rendez-vous",
    description: "Optimisez votre agenda en apprenant à planifier et gérer vos rendez-vous.",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />
  },
  {
    title: "Analyse des statistiques",
    description: "Interprétez vos données de performance et prenez des décisions éclairées.",
    icon: <FileText className="h-4 w-4 text-blue-500" />
  }
];

export default HelpDialog;
