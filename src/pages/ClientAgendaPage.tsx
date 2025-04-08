import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useDossier } from '@/contexts/DossierContext';
import { useCommunication } from '@/contexts/CommunicationContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { Video, FileText, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { fetchRendezVousByClient } from '@/services/rendezVousService';
import { RendezVous, Meeting, Dossier } from '@/types';
import MeetingRequestForm from '@/components/rendezVous/MeetingRequestForm';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ClientAgendaPage: React.FC = () => {
  const { user } = useAuth();
  const { dossiers } = useDossier();
  const { meetings, fetchMeetings } = useCommunication();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [rendezVousList, setRendezVousList] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientMeetings, setClientMeetings] = useState<Meeting[]>([]);
  const [clientDossiers, setClientDossiers] = useState<Dossier[]>([]);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);
  const [meetingReasonType, setMeetingReasonType] = useState('contract');

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const rdvs = await fetchRendezVousByClient(user.id);
        setRendezVousList(rdvs);
        
        await fetchMeetings();
        
        if (dossiers) {
          const clientDocs = dossiers.filter(d => d.clientId === user.id);
          setClientDossiers(clientDocs);
        }
        
      } catch (error) {
        console.error("Error loading client agenda data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos rendez-vous."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, dossiers, toast, fetchMeetings]);
  
  useEffect(() => {
    if (user && meetings) {
      const clientMtgs = meetings.filter(m => m.participants.includes(user.id));
      setClientMeetings(clientMtgs);
    }
  }, [meetings, user]);
  
  const getRendezVousForDate = (date: Date) => {
    return rendezVousList.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return (
        rdvDate.getDate() === date.getDate() &&
        rdvDate.getMonth() === date.getMonth() &&
        rdvDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const getMeetingsForDate = (date: Date) => {
    return clientMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const getHighlightedDates = () => {
    const dates: Date[] = [];
    
    rendezVousList.forEach(rdv => {
      dates.push(new Date(rdv.date));
    });
    
    clientMeetings.forEach(meeting => {
      dates.push(new Date(meeting.date));
    });
    
    return dates;
  };
  
  const handleMeetingComplete = () => {
    setIsMeetingFormOpen(false);
    toast({
      title: "Demande envoyée",
      description: "Votre demande de rendez-vous a été envoyée, vous serez notifié de la confirmation."
    });
  };
  
  return (
    <OnboardingProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-inuma-blue to-inuma-lightBlue bg-clip-text text-transparent">
            Mon Agenda
          </h1>
          <Button 
            onClick={() => setIsMeetingFormOpen(true)}
            className="bg-gradient-to-r from-inuma-blue to-inuma-lightBlue hover:from-inuma-blue/90 hover:to-inuma-lightBlue/90"
          >
            <Video className="mr-2 h-4 w-4" />
            Demander un rendez-vous
          </Button>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="contracts">
              <FileText className="mr-2 h-4 w-4" />
              Mes contrats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="p-0"
                      modifiers={{
                        hasEvent: getHighlightedDates()
                      }}
                      modifiersClassNames={{
                        hasEvent: "bg-inuma-red/10 font-bold text-inuma-red"
                      }}
                    />
                    
                    <div className="mt-6 space-y-2">
                      <h3 className="font-medium">Légende:</h3>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 rounded bg-inuma-red/10 mr-2"></div>
                        <span>Rendez-vous ou réunion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center p-8">
                        <p>Chargement de vos rendez-vous...</p>
                      </div>
                    ) : selectedDate ? (
                      <>
                        <h3 className="font-medium mb-3">Rendez-vous</h3>
                        {getRendezVousForDate(selectedDate).length === 0 && getMeetingsForDate(selectedDate).length === 0 ? (
                          <div className="text-center p-8 text-muted-foreground">
                            <p>Aucun rendez-vous pour cette date.</p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => setIsMeetingFormOpen(true)}
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Demander un rendez-vous
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getRendezVousForDate(selectedDate).map((rdv) => (
                              <Card key={rdv.id} className="bg-muted/50">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">Rendez-vous dossier</h4>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        {format(new Date(rdv.date), "HH:mm", { locale: fr })}
                                      </div>
                                      <div className="mt-1.5">
                                        <Badge variant="default">
                                          {rdv.honore ? "Honoré" : "À venir"}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      {rdv.meetingLink && (
                                        <Button size="sm" variant="outline" className="text-inuma-blue" asChild>
                                          <a href={rdv.meetingLink} target="_blank" rel="noopener noreferrer">
                                            <Video className="h-3.5 w-3.5 mr-1" /> Rejoindre
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  {rdv.notes && (
                                    <p className="mt-2 text-sm text-muted-foreground">{rdv.notes}</p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                            
                            {getMeetingsForDate(selectedDate).map((meeting) => (
                              <Card key={meeting.id} className="bg-blue-50 dark:bg-blue-950/20">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">{meeting.titre}</h4>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        {format(new Date(meeting.date), "HH:mm", { locale: fr })}
                                        <span className="mx-1">•</span>
                                        {meeting.duree} min
                                      </div>
                                      <div className="mt-1.5">
                                        <Badge variant="outline" className={
                                          meeting.statut === 'planifie' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                          meeting.statut === 'en_cours' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                          meeting.statut === 'termine' ? 'bg-green-50 text-green-700 border-green-200' :
                                          'bg-red-50 text-red-700 border-red-200'
                                        }>
                                          {meeting.statut === 'planifie' ? 'Planifiée' :
                                           meeting.statut === 'en_cours' ? 'En cours' :
                                           meeting.statut === 'termine' ? 'Terminée' : 'Annulée'}
                                        </Badge>
                                        <Badge variant="outline" className="ml-2">
                                          {meeting.type === 'visio' ? 'Visio' :
                                           meeting.type === 'presentiel' ? 'Présentiel' : 'Téléphonique'}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      {meeting.lien && meeting.statut !== 'termine' && meeting.statut !== 'annule' && (
                                        <Button size="sm" variant="outline" className="text-inuma-blue" asChild>
                                          <a href={meeting.lien} target="_blank" rel="noopener noreferrer">
                                            <Video className="h-3.5 w-3.5 mr-1" /> Rejoindre
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  {meeting.description && (
                                    <p className="mt-2 text-sm text-muted-foreground">{meeting.description}</p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        <p>Veuillez sélectionner une date pour voir vos rendez-vous.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Contrats</CardTitle>
                <CardDescription>Consultez les détails de vos contrats en cours</CardDescription>
              </CardHeader>
              <CardContent>
                {clientDossiers && clientDossiers.length > 0 ? (
                  <div className="space-y-6">
                    {clientDossiers.map((dossier) => (
                      <Card key={dossier.id} className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                              Dossier #{dossier.id.substring(0, 8)}
                            </CardTitle>
                            <Badge className={
                              dossier.status === 'signe' ? 'bg-green-100 text-green-800' :
                              dossier.status === 'valide' ? 'bg-blue-100 text-blue-800' :
                              dossier.status === 'rdv_en_cours' ? 'bg-yellow-100 text-yellow-800' :
                              dossier.status === 'prospect' ? 'bg-gray-100 text-gray-800' :
                              'bg-purple-100 text-purple-800'
                            }>
                              {dossier.status === 'signe' ? 'Signé' :
                               dossier.status === 'valide' ? 'Validé' :
                               dossier.status === 'rdv_en_cours' ? 'RDV en cours' :
                               dossier.status === 'prospect' ? 'Prospect' : 'Archivé'}
                            </Badge>
                          </div>
                          <CardDescription>
                            Créé le {dossier.dateCreation instanceof Date 
                              ? format(dossier.dateCreation, 'dd/MM/yyyy', { locale: fr })
                              : format(new Date(dossier.dateCreation), 'dd/MM/yyyy', { locale: fr })
                            }
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Progression</p>
                              <Progress 
                                value={
                                  dossier.status === 'prospect' ? 20 :
                                  dossier.status === 'rdv_en_cours' ? 40 :
                                  dossier.status === 'valide' ? 80 :
                                  dossier.status === 'signe' ? 100 : 0
                                } 
                                className="h-2"
                              />
                            </div>
                            
                            {dossier.offres && dossier.offres.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">Offres souscrites</p>
                                <div className="space-y-2">
                                  {dossier.offres.map((offre, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-background rounded-md">
                                      <span>{offre.nom}</span>
                                      <span className="font-medium">{offre.prix} €</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {dossier.montant && (
                              <div className="flex justify-between items-center p-3 bg-inuma-blue/5 rounded-md">
                                <span className="font-medium">Montant total</span>
                                <span className="text-lg font-bold">{dossier.montant} €</span>
                              </div>
                            )}
                            
                            {dossier.notes && (
                              <div className="mt-4">
                                <p className="text-sm font-medium mb-1">Notes</p>
                                <p className="text-sm text-muted-foreground">{dossier.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Vous n'avez pas encore de contrats actifs.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isMeetingFormOpen} onOpenChange={setIsMeetingFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Demande de rendez-vous</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-6">
                <h3 className="font-medium mb-3">Type de rendez-vous</h3>
                <RadioGroup defaultValue={meetingReasonType} onValueChange={setMeetingReasonType} className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="contract" id="contract" />
                    <Label htmlFor="contract" className="flex-1 cursor-pointer">
                      <div className="font-medium">Consultation de contrat</div>
                      <div className="text-sm text-muted-foreground">Discutez des détails de votre contrat avec un conseiller</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="support" id="support" />
                    <Label htmlFor="support" className="flex-1 cursor-pointer">
                      <div className="font-medium">Support technique</div>
                      <div className="text-sm text-muted-foreground">Obtenez de l'aide sur les aspects techniques de nos services</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex-1 cursor-pointer">
                      <div className="font-medium">Autre demande</div>
                      <div className="text-sm text-muted-foreground">Pour toute autre raison qui n'est pas listée</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <MeetingRequestForm onComplete={handleMeetingComplete} meetingType={meetingReasonType} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OnboardingProvider>
  );
};

export default ClientAgendaPage;
