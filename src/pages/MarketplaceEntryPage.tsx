
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '@/services/clientService';
import { meetingService } from '@/services/meetingService';
import { Calendar, CheckCircle, CalendarClock, ArrowRight } from 'lucide-react';

const MarketplaceEntryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formTab, setFormTab] = useState<'rendezVous' | 'inscription'>('rendezVous');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    secteurActivite: '',
    typeEntreprise: '',
    besoins: '',
    dateRdv: '',
    heureRdv: '',
    messageSupplementaire: '',
    planifierRdv: false
  });

  // Déterminer la source d'entrée (site web ou email)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const source = searchParams.get('source');
    
    if (source === 'email') {
      setFormTab('inscription');
    } else {
      setFormTab('rendezVous');
    }
  }, [location]);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/marketplace');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const validateStep1 = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      toast({
        variant: "destructive",
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.secteurActivite || !formData.typeEntreprise || !formData.besoins) {
      toast({
        variant: "destructive",
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return false;
    }
    return true;
  };

  const validateRendezVousForm = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      toast({
        variant: "destructive",
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return false;
    }
    
    if (!formData.dateRdv || !formData.heureRdv) {
      toast({
        variant: "destructive",
        title: "Date de rendez-vous manquante",
        description: "Veuillez sélectionner une date et une heure pour le rendez-vous."
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitInscription = async () => {
    if (step === 3) {
      setLoading(true);
      try {
        // Créer le client
        const newClient = await clientService.createClient({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          secteurActivite: formData.secteurActivite,
          typeEntreprise: formData.typeEntreprise,
          besoins: formData.besoins,
          adresse: '',
          commentaires: formData.messageSupplementaire
        });

        if (!newClient) {
          throw new Error("Échec de la création du client");
        }

        // Si l'option de rendez-vous est sélectionnée
        if (formData.planifierRdv && formData.dateRdv && formData.heureRdv) {
          await meetingService.createMeeting({
            titre: `Rendez-vous d'inscription - ${formData.prenom} ${formData.nom}`,
            description: `Inscription et étude de cas pour ${formData.prenom} ${formData.nom} - ${formData.secteurActivite}`,
            date: new Date(formData.dateRdv),
            heure: formData.heureRdv,
            type: 'visio',
            participants: [newClient.id],
            lien: '',
            statut: 'planifie'
          });
        }

        toast({
          title: "Inscription réussie",
          description: "Votre demande a été envoyée avec succès. Nous vous contacterons prochainement."
        });

        // Rediriger vers une page de confirmation
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de votre inscription. Veuillez réessayer."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitRendezVous = async () => {
    if (validateRendezVousForm()) {
      setLoading(true);
      try {
        // Créer le client
        const newClient = await clientService.createClient({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          secteurActivite: '',
          typeEntreprise: '',
          besoins: formData.messageSupplementaire || '',
          adresse: '',
          commentaires: "Client créé depuis la page d'entrée du marketplace"
        });

        if (!newClient) {
          throw new Error("Échec de la création du client");
        }

        // Créer le rendez-vous
        await meetingService.createMeeting({
          titre: `Rendez-vous d'étude de cas - ${formData.prenom} ${formData.nom}`,
          description: formData.messageSupplementaire || `Étude de cas pour ${formData.prenom} ${formData.nom}`,
          date: new Date(formData.dateRdv),
          heure: formData.heureRdv,
          type: 'visio',
          participants: [newClient.id],
          lien: '',
          statut: 'planifie'
        });

        toast({
          title: "Rendez-vous planifié",
          description: "Votre rendez-vous a été planifié avec succès. Vous recevrez bientôt un email de confirmation."
        });

        // Rediriger vers une page de confirmation
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de la planification du rendez-vous:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la planification du rendez-vous. Veuillez réessayer."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Bienvenue sur la Marketplace INUMA
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Découvrez nos solutions innovantes pour développer votre entreprise
        </p>
      </div>

      {/* Video Banner */}
      <div className="bg-blue-600 text-white py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-6 lg:mb-0 lg:pr-8">
              <h3 className="text-2xl font-bold mb-3">Découvrez i-mailX</h3>
              <p className="mb-4">Notre solution révolutionnaire de cold-mailing pour optimiser vos campagnes marketing et augmenter vos conversions.</p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="lg:w-1/2 rounded-lg overflow-hidden shadow-xl">
              <div className="aspect-w-16 aspect-h-9 bg-gray-800 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-lg font-medium">Vidéo promotionnelle</p>
                  <p className="text-sm opacity-70">Une vidéo de présentation sera affichée ici</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs defaultValue={formTab} value={formTab} onValueChange={(value) => setFormTab(value as 'rendezVous' | 'inscription')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="rendezVous" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Prendre RDV
              </TabsTrigger>
              <TabsTrigger value="inscription" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                S'inscrire
              </TabsTrigger>
            </TabsList>

            {/* Contenu pour le formulaire de RDV */}
            <TabsContent value="rendezVous">
              <Card>
                <CardHeader>
                  <CardTitle>Planifiez un rendez-vous d'étude de cas</CardTitle>
                  <CardDescription>Obtenez une consultation personnalisée en visioconférence avec nos experts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input 
                        id="prenom" 
                        name="prenom" 
                        value={formData.prenom} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input 
                        id="nom" 
                        name="nom" 
                        value={formData.nom} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input 
                      id="telephone" 
                      name="telephone" 
                      type="tel" 
                      value={formData.telephone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateRdv">Date du rendez-vous *</Label>
                      <Input 
                        id="dateRdv" 
                        name="dateRdv" 
                        type="date" 
                        value={formData.dateRdv} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heureRdv">Heure du rendez-vous *</Label>
                      <Input 
                        id="heureRdv" 
                        name="heureRdv" 
                        type="time" 
                        value={formData.heureRdv} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="messageSupplementaire">Message supplémentaire (facultatif)</Label>
                    <Textarea 
                      id="messageSupplementaire" 
                      name="messageSupplementaire" 
                      value={formData.messageSupplementaire} 
                      onChange={handleInputChange} 
                      rows={3} 
                    />
                  </div>
                  
                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleSubmitRendezVous}
                    disabled={loading}
                  >
                    <CalendarClock className="h-5 w-5" />
                    {loading ? "Planification en cours..." : "Planifier le rendez-vous"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contenu pour le formulaire d'inscription */}
            <TabsContent value="inscription">
              <Card>
                <CardHeader>
                  <CardTitle>Créez votre compte INUMA</CardTitle>
                  <CardDescription>
                    {step === 1 && "Étape 1/3 : Vos informations personnelles"}
                    {step === 2 && "Étape 2/3 : Votre entreprise"}
                    {step === 3 && "Étape 3/3 : Confirmation"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Étape 1 */}
                  {step === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prenom-inscription">Prénom *</Label>
                          <Input 
                            id="prenom-inscription" 
                            name="prenom" 
                            value={formData.prenom} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nom-inscription">Nom *</Label>
                          <Input 
                            id="nom-inscription" 
                            name="nom" 
                            value={formData.nom} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-inscription">Email *</Label>
                        <Input 
                          id="email-inscription" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telephone-inscription">Téléphone *</Label>
                        <Input 
                          id="telephone-inscription" 
                          name="telephone" 
                          type="tel" 
                          value={formData.telephone} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Étape 2 */}
                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="secteurActivite">Secteur d'activité *</Label>
                        <Input 
                          id="secteurActivite" 
                          name="secteurActivite" 
                          value={formData.secteurActivite} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="typeEntreprise">Type d'entreprise *</Label>
                        <Input 
                          id="typeEntreprise" 
                          name="typeEntreprise" 
                          value={formData.typeEntreprise} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="besoins">Décrivez vos besoins *</Label>
                        <Textarea 
                          id="besoins" 
                          name="besoins" 
                          value={formData.besoins} 
                          onChange={handleInputChange} 
                          rows={3} 
                          required 
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Étape 3 */}
                  {step === 3 && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <h4 className="font-medium">Récapitulatif de vos informations</h4>
                        <p><strong>Nom complet:</strong> {formData.prenom} {formData.nom}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Téléphone:</strong> {formData.telephone}</p>
                        <p><strong>Secteur d'activité:</strong> {formData.secteurActivite}</p>
                        <p><strong>Type d'entreprise:</strong> {formData.typeEntreprise}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="messageSupplementaire-inscription">Message supplémentaire (facultatif)</Label>
                        <Textarea 
                          id="messageSupplementaire-inscription" 
                          name="messageSupplementaire" 
                          value={formData.messageSupplementaire} 
                          onChange={handleInputChange} 
                          rows={3} 
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="planifierRdv" 
                          name="planifierRdv" 
                          checked={formData.planifierRdv} 
                          onChange={handleCheckboxChange} 
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                        <Label htmlFor="planifierRdv" className="text-sm">
                          Je souhaite planifier un rendez-vous en visioconférence
                        </Label>
                      </div>
                      
                      {formData.planifierRdv && (
                        <div className="grid grid-cols-2 gap-4 border p-3 rounded-md">
                          <div className="space-y-2">
                            <Label htmlFor="dateRdv-inscription">Date du rendez-vous</Label>
                            <Input 
                              id="dateRdv-inscription" 
                              name="dateRdv" 
                              type="date" 
                              value={formData.dateRdv} 
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heureRdv-inscription">Heure du rendez-vous</Label>
                            <Input 
                              id="heureRdv-inscription" 
                              name="heureRdv" 
                              type="time" 
                              value={formData.heureRdv} 
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    {step > 1 ? (
                      <Button variant="outline" onClick={handlePrevStep}>
                        Précédent
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    {step < 3 ? (
                      <Button onClick={handleNextStep}>
                        Suivant
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmitInscription}
                        disabled={loading}
                      >
                        {loading ? "Inscription en cours..." : "Finaliser l'inscription"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceEntryPage;
