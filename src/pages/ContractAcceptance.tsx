
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle2, FileText, LockIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ContractAcceptance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, clearCart } = useCart();
  const [accepted, setAccepted] = useState(false);
  
  const handleAcceptContract = () => {
    if (!accepted) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions du contrat pour continuer.",
        variant: "destructive",
      });
      return;
    }
    
    // Stocker les informations du contrat localement
    const contractDate = new Date().toISOString();
    const contract = {
      items: cartItems,
      date: contractDate,
      id: `CONTRACT-${Date.now()}`,
    };
    
    // Stocker le contrat dans le localStorage
    const existingContracts = JSON.parse(localStorage.getItem("contracts") || "[]");
    localStorage.setItem("contracts", JSON.stringify([...existingContracts, contract]));
    
    // Notification de succès
    toast({
      title: "Contrat validé",
      description: "Votre contrat a été enregistré avec succès.",
    });
    
    // Vider le panier et rediriger vers la page des paramètres
    clearCart();
    navigate("/parametres?tab=contrat");
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-3 mb-4">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Aucun article dans le panier</h1>
        <p className="text-muted-foreground mb-6">Vous devez ajouter des articles au panier avant de valider un contrat.</p>
        <Button onClick={() => navigate("/mes-offres")}>Parcourir les offres</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Acceptation du contrat</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LockIcon className="h-4 w-4" />
          <span>Transaction sécurisée</span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif de votre commande</CardTitle>
          <CardDescription>
            Vérifiez les détails de votre commande avant de valider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.price}</p>
                  {item.setupFee && (
                    <p className="text-xs text-muted-foreground">{item.setupFee}</p>
                  )}
                  <p className="text-sm">Quantité: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-primary/20">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Conditions générales du contrat</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="max-h-80 overflow-y-auto prose prose-sm">
            <h3>CONTRAT DE PRESTATION DE SERVICES</h3>
            
            <p>
              <strong>ENTRE LES SOUSSIGNÉS :</strong>
            </p>
            
            <p>
              La société [Nom de la société], société [forme juridique] au capital de [montant] euros, dont le siège social est situé à [adresse], immatriculée au Registre du Commerce et des Sociétés de [ville] sous le numéro [numéro RCS], représentée par [prénom et nom], agissant en qualité de [fonction],
            </p>
            
            <p>
              Ci-après dénommée « le Prestataire »,
            </p>
            
            <p>
              <strong>ET</strong>
            </p>
            
            <p>
              [Prénom et nom du client], [profession], demeurant à [adresse],
            </p>
            
            <p>
              Ci-après dénommé « le Client »,
            </p>
            
            <h4>ARTICLE 1 - OBJET DU CONTRAT</h4>
            
            <p>
              Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire s'engage à réaliser pour le Client les prestations de services définies ci-après.
            </p>
            
            <h4>ARTICLE 2 - NATURE DES PRESTATIONS</h4>
            
            <p>
              Le Prestataire s'engage à fournir au Client les services suivants :
            </p>
            
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>{item.title} - {item.category}</li>
              ))}
            </ul>
            
            <h4>ARTICLE 3 - DURÉE</h4>
            
            <p>
              Le présent contrat est conclu pour une durée de 12 mois à compter de sa date de signature. Il se renouvellera ensuite par tacite reconduction, par périodes successives de 12 mois, sauf dénonciation par l'une des parties adressée à l'autre par lettre recommandée avec accusé de réception, 3 mois au moins avant l'expiration de la période contractuelle en cours.
            </p>
            
            <h4>ARTICLE 4 - PRIX</h4>
            
            <p>
              En contrepartie des prestations de services définies à l'article 2 ci-dessus, le Client s'engage à payer au Prestataire la somme forfaitaire de [montant en chiffres] euros hors taxes ([montant en lettres] euros hors taxes).
            </p>
            
            <h4>ARTICLE 5 - MODALITÉS DE PAIEMENT</h4>
            
            <p>
              Le paiement s'effectuera selon les modalités suivantes : [préciser les modalités].
            </p>
            
            <h4>ARTICLE 6 - CONFIDENTIALITÉ</h4>
            
            <p>
              Le Prestataire s'engage à considérer comme confidentielles et à ne pas divulguer les informations qui lui seraient communiquées par le Client ou dont il aurait connaissance à l'occasion de l'exécution du présent contrat.
            </p>
            
            <h4>ARTICLE 7 - RESPONSABILITÉ</h4>
            
            <p>
              Le Prestataire s'engage à exécuter les prestations avec tout le soin en usage dans sa profession et conformément aux règles de l'art. Il ne pourra être tenu responsable que des dommages directs résultant d'une mauvaise exécution de ses prestations.
            </p>
            
            <h4>ARTICLE 8 - RÉSILIATION</h4>
            
            <p>
              En cas d'inexécution par l'une des parties de l'une quelconque de ses obligations, l'autre partie pourra, si bon lui semble, résilier le présent contrat de plein droit, 30 jours après l'envoi d'une mise en demeure adressée par lettre recommandée avec accusé de réception, restée sans effet.
            </p>
            
            <h4>ARTICLE 9 - DROIT APPLICABLE ET JURIDICTION COMPÉTENTE</h4>
            
            <p>
              Le présent contrat est soumis au droit français. Tout litige relatif à son interprétation ou à son exécution sera soumis, à défaut d'accord amiable, aux tribunaux compétents du ressort de [ville].
            </p>
            
            <p>
              Fait à [ville], le [date], en deux exemplaires originaux.
            </p>
            
            <p>
              <strong>Pour le Prestataire</strong><br />
              [Prénom et nom]<br />
              [Fonction]
            </p>
            
            <p>
              <strong>Pour le Client</strong><br />
              [Prénom et nom]
            </p>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-start gap-4 pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={accepted} 
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              J'ai lu et j'accepte les conditions générales du contrat
            </label>
          </div>
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              Retour au panier
            </Button>
            <Button className="flex-1" onClick={handleAcceptContract}>
              Valider le contrat
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContractAcceptance;
