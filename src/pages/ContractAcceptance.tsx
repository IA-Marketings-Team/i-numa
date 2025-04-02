
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, FileText, ArrowLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ContractAcceptance: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculer le total du panier
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Handle both price formats (number and string)
      if (item.prix) {
        return total + item.prix * item.quantity;
      } else if (item.price) {
        // Extract the number from a string like "39€/mois"
        const priceNumber = parseFloat(item.price.replace(/[^\d.,]/g, ''));
        return total + priceNumber * item.quantity;
      }
      return total;
    }, 0);
  };

  // Function to create a new dossier and rendez-vous when a contract is signed
  const createDossierAndRendezVous = async () => {
    if (!user) return;
    
    try {
      // 1. Create a new dossier
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      
      // Get agent phoner (select a random one for now - in a real app, you'd implement a more sophisticated selection)
      const { data: phonerAgents } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'agent_phoner');
      
      let agentPhonerId = null;
      if (phonerAgents && phonerAgents.length > 0) {
        // Randomly select a phoner agent
        const randomIndex = Math.floor(Math.random() * phonerAgents.length);
        agentPhonerId = phonerAgents[randomIndex].id;
      }
      
      // Create the dossier
      const { data: dossier, error: dossierError } = await supabase
        .from('dossiers')
        .insert({
          client_id: user.id,
          agent_phoner_id: agentPhonerId,
          status: 'signe',
          date_creation: now.toISOString(),
          date_mise_a_jour: now.toISOString(),
          date_signature: now.toISOString(),
          montant: getCartTotal()
        })
        .select()
        .single();
      
      if (dossierError) {
        throw dossierError;
      }
      
      // 2. Link the offres to the dossier
      for (const item of cart) {
        if (item.offreId) {
          await supabase
            .from('dossier_offres')
            .insert({
              dossier_id: dossier.id,
              offre_id: item.offreId
            });
        }
      }
      
      // 3. Create a rendez-vous with the phoner
      if (agentPhonerId) {
        const { error: rdvError } = await supabase
          .from('rendez_vous')
          .insert({
            dossier_id: dossier.id,
            date: oneWeekLater.toISOString(),
            honore: false,
            notes: "Rendez-vous automatique suite à la signature du contrat",
            location: "Téléphonique",
            meeting_link: ""
          });
        
        if (rdvError) {
          console.error("Erreur lors de la création du rendez-vous:", rdvError);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la création du dossier et du rendez-vous:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!acceptTerms || !acceptPrivacy) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez accepter les conditions générales de vente et la politique de confidentialité"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le dossier et le rendez-vous
      await createDossierAndRendezVous();
      
      // Effacer le panier
      clearCart();
      
      // Rediriger vers une page de confirmation
      navigate("/tableau-de-bord");
      
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été traitée avec succès. Un rendez-vous avec un agent a été programmé.",
      });
    } catch (error) {
      console.error("Erreur lors de la confirmation de la commande:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Votre panier est vide</CardTitle>
            <CardDescription>
              Ajoutez des produits à votre panier avant de finaliser votre commande
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/marketplace")} className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Retour à la boutique
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Contrat de service
              </CardTitle>
              <CardDescription>
                Veuillez lire attentivement les termes du contrat ci-dessous
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="bg-gray-50 p-4 rounded-md border h-64 overflow-y-auto mb-4">
                <h3>Conditions Générales de Vente</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac 
                  condimentum lectus. Nulla facilisi. Sed eget tellus id nisl 
                  tristique congue. Quisque varius nibh in turpis viverra, id 
                  ultrices ipsum vehicula.
                </p>
                <p>
                  Nullam ut cursus eros, et convallis justo. Ut ac velit vitae 
                  odio commodo feugiat. Aliquam erat volutpat. Suspendisse et 
                  consequat leo, non sagittis enim. Nunc semper lectus ut nisl 
                  eleifend, et convallis orci pellentesque.
                </p>
                <h4>1. Services et Tarifs</h4>
                <p>
                  Praesent eget magna tempor, blandit orci vel, ultricies quam. 
                  Nullam ut cursus eros, et convallis justo. Ut ac velit vitae 
                  odio commodo feugiat. Aliquam erat volutpat.
                </p>
                <h4>2. Durée du Contrat</h4>
                <p>
                  Integer sit amet facilisis nisi. Vestibulum ac sapien sed dui 
                  faucibus tincidunt. Nulla facilisi. Quisque lacinia consectetur 
                  nisl, non dignissim magna elementum vel.
                </p>
                <h4>3. Confidentialité</h4>
                <p>
                  Phasellus id tellus eu nulla molestie cursus. Sed eget tellus 
                  id nisl tristique congue. Quisque varius nibh in turpis viverra, 
                  id ultrices ipsum vehicula.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm leading-relaxed font-normal cursor-pointer"
                  >
                    J'ai lu et j'accepte les conditions générales de vente et le contrat de service
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="privacy" 
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                  />
                  <Label 
                    htmlFor="privacy"
                    className="text-sm leading-relaxed font-normal cursor-pointer"
                  >
                    J'ai lu et j'accepte la politique de confidentialité et de protection des données
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between pb-2">
                  <div>
                    <p className="font-medium">{item.title || item.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {item.price || (item.prix && `${item.prix} €`)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {item.prix 
                      ? `${item.prix * item.quantity} €` 
                      : item.price 
                        ? `${parseFloat(item.price.replace(/[^\d.,]/g, '')) * item.quantity} €`
                        : '0 €'
                    }
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{getCartTotal()} €</span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                <p className="mb-1">✓ Un rendez-vous sera automatiquement planifié avec un agent phoner suite à votre commande.</p>
                <p>✓ Vous recevrez une confirmation par email avec les détails de votre commande.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || !acceptTerms || !acceptPrivacy}
              >
                {isSubmitting ? (
                  "Traitement en cours..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmer et payer
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractAcceptance;
