import React, { useState, useEffect } from 'react';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Users, 
  FileText, 
  MessageSquare, 
  Clock,
  Download,
  Send,
  User,
  Video
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { RendezVous, Meeting, Agent } from '@/types';
import { fetchRendezVous } from '@/services/rendezVousService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunication } from '@/contexts/CommunicationContext';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createEmail } from '@/services/emailService';

const SuperviseurDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { meetings } = useCommunication();
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [rendezVousList, setRendezVousList] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const rdvs = await fetchRendezVous();
        setRendezVousList(rdvs);
        
        const mockAgents: Agent[] = [
          {
            id: "agent1",
            nom: "Dubois",
            prenom: "Marie",
            email: "marie.dubois@inuma.fr",
            telephone: "0601020304",
            role: "agent_phoner",
            dateCreation: new Date("2023-01-15"),
            stats: {
              appointmentsMade: 42,
              appointmentsCompleted: 35,
              conversionRate: 83,
              averageDuration: 28,
              clientSatisfaction: 4.7
            }
          },
          {
            id: "agent2",
            nom: "Martin",
            prenom: "Thomas",
            email: "thomas.martin@inuma.fr",
            telephone: "0602030405",
            role: "agent_visio",
            dateCreation: new Date("2023-02-10"),
            stats: {
              appointmentsMade: 38,
              appointmentsCompleted: 36,
              conversionRate: 95,
              averageDuration: 32,
              clientSatisfaction: 4.9
            }
          },
          {
            id: "agent3",
            nom: "Petit",
            prenom: "Julie",
            email: "julie.petit@inuma.fr",
            telephone: "0603040506",
            role: "agent_phoner",
            dateCreation: new Date("2023-03-05"),
            stats: {
              appointmentsMade: 29,
              appointmentsCompleted: 24,
              conversionRate: 82,
              averageDuration: 26,
              clientSatisfaction: 4.6
            }
          }
        ];
        
        setAgents(mockAgents);
      } catch (error) {
        console.error("Error loading superviseur dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

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

  const getRendezVousByAgent = (agentId: string) => {
    return rendezVousList.filter(rdv => {
      return (
        (rdv.dossier.agentPhonerId === agentId || rdv.dossier.agentVisioId === agentId)
      );
    });
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getReportTitle = () => {
    const today = new Date();
    
    switch (selectedView) {
      case 'daily':
        return `Rapport quotidien du ${format(today, "d MMMM yyyy", { locale: fr })}`;
      case 'weekly':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start with Monday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() - today.getDay() + 7); // End with Sunday
        return `Rapport hebdomadaire du ${format(startOfWeek, "d MMMM", { locale: fr })} au ${format(endOfWeek, "d MMMM yyyy", { locale: fr })}`;
      case 'monthly':
        return `Rapport mensuel de ${format(today, "MMMM yyyy", { locale: fr })}`;
      default:
        return "Rapport";
    }
  };

  const handleSendReport = async () => {
    if (!user) return;
    
    setIsSendingReport(true);
    
    try {
      const content = `
Cher responsable,

Veuillez trouver ci-joint le ${getReportTitle().toLowerCase()}.

Résumé:
- Rendez-vous totaux: ${rendezVousList.length}
- Rendez-vous honorés: ${rendezVousList.filter(rdv => rdv.honore).length}
- Taux de réussite: ${Math.round((rendezVousList.filter(rdv => rdv.honore).length / rendezVousList.length) * 100)}%

Performance des agents:
${agents.map(agent => `- ${agent.prenom} ${agent.nom}: ${agent.stats?.appointmentsCompleted || 0} RDV complétés sur ${agent.stats?.appointmentsMade || 0} (${agent.stats?.conversionRate || 0}%)`).join('\n')}

Pour plus de détails, veuillez consulter le rapport complet sur la plateforme.

Cordialement,
${user.prenom} ${user.nom}
Superviseur
      `;
      
      const emailData = {
        expediteurId: user.id,
        destinataireIds: ["responsable_id"],
        sujet: getReportTitle(),
        contenu: content,
        dateEnvoi: new Date(),
        lu: false
      };
      
      await createEmail(emailData);
      
      toast({
        title: "Rapport envoyé",
        description: "Le rapport a été envoyé au responsable avec succès."
      });
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error sending report:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le rapport. Veuillez réessayer."
      });
    } finally {
      setIsSendingReport(false);
    }
  };

  return (
    <OnboardingProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-inuma-blue to-inuma-lightBlue bg-clip-text text-transparent">
            Tableau de bord superviseur
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsReportDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Générer un rapport
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Users className="mr-2 h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="meetings">
              <MessageSquare className="mr-2 h-4 w-4" />
              Rendez-vous
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Rendez-vous aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getRendezVousForDate(new Date()).length}
                  </div>
                  <p className="text-muted-foreground">
                    {getRendezVousForDate(new Date()).filter(rdv => rdv.honore).length} honorés
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Taux de succès</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {rendezVousList.length > 0
                      ? Math.round((rendezVousList.filter(rdv => rdv.honore).length / rendezVousList.length) * 100)
                      : 0}%
                  </div>
                  <Progress 
                    value={rendezVousList.length > 0
                      ? (rendezVousList.filter(rdv => rdv.honore).length / rendezVousList.length) * 100
                      : 0} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Agents actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {agents.length}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {agents.filter(a => a.role === "agent_phoner").length} phoners / {agents.filter(a => a.role === "agent_visio").length} visio
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance des agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead className="text-right">RDV effectués</TableHead>
                        <TableHead className="text-right">Taux de conversion</TableHead>
                        <TableHead className="text-right">Satisfaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell className="font-medium">{agent.prenom} {agent.nom}</TableCell>
                          <TableCell>
                            {agent.role === 'agent_phoner' ? 'Phoner' : 
                             agent.role === 'agent_visio' ? 'Visio' : agent.role}
                          </TableCell>
                          <TableCell className="text-right">
                            {agent.stats?.appointmentsCompleted}/{agent.stats?.appointmentsMade}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              (agent.stats?.conversionRate || 0) > 90 ? "bg-green-100 text-green-800" :
                              (agent.stats?.conversionRate || 0) > 80 ? "bg-blue-100 text-blue-800" :
                              (agent.stats?.conversionRate || 0) > 70 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {agent.stats?.conversionRate || 0}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {agent.stats?.clientSatisfaction}/5
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rendez-vous à venir</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[268px]">
                    <div className="space-y-4">
                      {meetings.filter(m => new Date(m.date) > new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 5)
                        .map(meeting => (
                          <div key={meeting.id} className="flex items-center border-b pb-2">
                            <div className="flex-1">
                              <p className="font-medium">{meeting.titre}</p>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {format(new Date(meeting.date), "dd/MM/yyyy HH:mm")}
                              </div>
                            </div>
                            <Badge variant="outline">
                              {meeting.type === 'visio' ? 'Visio' :
                               meeting.type === 'presentiel' ? 'Présentiel' : 'Téléphone'}
                            </Badge>
                          </div>
                        ))
                      }
                      
                      {meetings.filter(m => new Date(m.date) > new Date()).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          Aucun rendez-vous à venir
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{agent.prenom} {agent.nom}</span>
                      <Badge variant="outline">
                        {agent.role === 'agent_phoner' ? 'Phoner' : 
                         agent.role === 'agent_visio' ? 'Visio' : agent.role}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        {agent.email}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm font-medium">
                        <span>RDV Effectués</span>
                        <span>{agent.stats?.appointmentsCompleted}/{agent.stats?.appointmentsMade}</span>
                      </div>
                      <Progress 
                        value={agent.stats ? (agent.stats.appointmentsCompleted / agent.stats.appointmentsMade) * 100 : 0} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm font-medium">
                        <span>Taux de conversion</span>
                        <span>{agent.stats?.conversionRate}%</span>
                      </div>
                      <Progress 
                        value={agent.stats?.conversionRate || 0} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm font-medium">
                        <span>Satisfaction client</span>
                        <span>{agent.stats?.clientSatisfaction}/5</span>
                      </div>
                      <Progress 
                        value={(agent.stats?.clientSatisfaction || 0) * 20} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">Activité récente</p>
                      <ScrollArea className="h-[120px]">
                        {getRendezVousByAgent(agent.id).slice(0, 3).map(rdv => (
                          <div key={rdv.id} className="flex items-center border-b pb-2 mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">RDV {rdv.honore ? "honoré" : "planifié"}</p>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(rdv.date), "dd/MM/yyyy HH:mm")}
                              </div>
                            </div>
                            <Badge variant={rdv.honore ? "default" : "outline"} className="text-xs">
                              {rdv.honore ? "Complété" : "Planifié"}
                            </Badge>
                          </div>
                        ))}
                        
                        {getRendezVousByAgent(agent.id).length === 0 && (
                          <p className="text-center text-sm text-muted-foreground">
                            Aucune activité récente
                          </p>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="meetings" className="space-y-4">
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
                        hasEvent: rendezVousList.map(rdv => new Date(rdv.date))
                      }}
                      modifiersClassNames={{
                        hasEvent: "bg-inuma-red/10 font-bold text-inuma-red"
                      }}
                    />
                    
                    <div className="mt-6 space-y-2">
                      <h3 className="font-medium">Légende:</h3>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 rounded bg-inuma-red/10 mr-2"></div>
                        <span>Rendez-vous planifiés</span>
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
                        <p>Chargement des rendez-vous...</p>
                      </div>
                    ) : selectedDate ? (
                      <>
                        <h3 className="font-medium mb-3">Rendez-vous</h3>
                        {getRendezVousForDate(selectedDate).length === 0 && getMeetingsForDate(selectedDate).length === 0 ? (
                          <div className="text-center p-8 text-muted-foreground">
                            <p>Aucun rendez-vous pour cette date.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getRendezVousForDate(selectedDate).map((rdv) => (
                              <Card key={rdv.id} className="bg-muted/50">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">
                                        {rdv.dossier.client.prenom} {rdv.dossier.client.nom}
                                      </h4>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        {format(new Date(rdv.date), "HH:mm", { locale: fr })}
                                      </div>
                                      <div className="mt-1.5">
                                        <Badge variant={rdv.honore ? "default" : "outline"}>
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
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Agent:</span> {
                                      rdv.dossier.agentPhonerId && agents.find(a => a.id === rdv.dossier.agentPhonerId) ? 
                                      `${agents.find(a => a.id === rdv.dossier.agentPhonerId)?.prenom} ${agents.find(a => a.id === rdv.dossier.agentPhonerId)?.nom} (Phoner)` : 
                                      rdv.dossier.agentVisioId && agents.find(a => a.id === rdv.dossier.agentVisioId) ?
                                      `${agents.find(a => a.id === rdv.dossier.agentVisioId)?.prenom} ${agents.find(a => a.id === rdv.dossier.agentVisioId)?.nom} (Visio)` :
                                      'Non assigné'
                                    }
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
                        <p>Veuillez sélectionner une date pour voir les rendez-vous.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Générer un rapport</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-6">
                <h3 className="font-medium mb-3">Type de rapport</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant={selectedView === 'daily' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedView('daily')}
                  >
                    Quotidien
                  </Button>
                  <Button 
                    variant={selectedView === 'weekly' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedView('weekly')}
                  >
                    Hebdomadaire
                  </Button>
                  <Button 
                    variant={selectedView === 'monthly' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedView('monthly')}
                  >
                    Mensuel
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{getReportTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Résumé</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>Rendez-vous totaux: {rendezVousList.length}</li>
                        <li>Rendez-vous honorés: {rendezVousList.filter(rdv => rdv.honore).length}</li>
                        <li>Taux de réussite: {rendezVousList.length > 0
                          ? Math.round((rendezVousList.filter(rdv => rdv.honore).length / rendezVousList.length) * 100)
                          : 0}%</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Performance des agents</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        {agents.map(agent => (
                          <li key={agent.id}>
                            {agent.prenom} {agent.nom}: {agent.stats?.appointmentsCompleted || 0} RDV complétés sur {agent.stats?.appointmentsMade || 0} ({agent.stats?.conversionRate || 0}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsReportDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                <Button 
                  onClick={handleSendReport}
                  disabled={isSendingReport}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSendingReport ? "Envoi en cours..." : "Envoyer au responsable"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OnboardingProvider>
  );
};

export default SuperviseurDashboardPage;
