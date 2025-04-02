
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Meeting } from '@/types';
import { fetchMeetingsByParticipant } from '@/services/meetingService';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarCheck, Video, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientAgenda: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const loadMeetings = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const data = await fetchMeetingsByParticipant(user.id);
        setMeetings(data);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos rendez-vous.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMeetings();
  }, [user]);

  const meetingsForSelectedDate = meetings.filter(meeting => 
    isSameDay(new Date(meeting.date), selectedDate)
  );

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.date) >= new Date() && meeting.statut !== 'annule'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastMeetings = meetings.filter(meeting => 
    new Date(meeting.date) < new Date() || meeting.statut === 'annule'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const dateHasMeeting = (date: Date) => {
    return meetings.some(meeting => isSameDay(new Date(meeting.date), date));
  };

  const openMeetingLink = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "Lien non disponible",
        description: "Le lien de la réunion n'est pas encore disponible.",
      });
    }
  };

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case 'planifie':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Planifié</span>;
      case 'en_cours':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">En cours</span>;
      case 'termine':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Terminé</span>;
      case 'annule':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Annulé</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Mes rendez-vous</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                meeting: (date) => dateHasMeeting(date),
              }}
              modifiersStyles={{
                meeting: { fontWeight: 'bold', backgroundColor: 'rgba(99, 102, 241, 0.1)' }
              }}
              locale={fr}
              disabled={(date) => {
                // Disable dates more than 6 months in the past or future
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                
                const sixMonthsFromNow = new Date();
                sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
                
                return date < sixMonthsAgo || date > sixMonthsFromNow;
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-indigo-200"></div>
                <span>Jour avec rendez-vous</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Rendez-vous pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement des rendez-vous...</div>
            ) : meetingsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {meetingsForSelectedDate.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="p-4 rounded-lg border border-gray-200 hover:shadow transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{meeting.titre}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(meeting.date), 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                        <p className="text-sm mt-2">{meeting.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{meeting.duree} minutes</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getMeetingStatusBadge(meeting.statut)}
                        {meeting.lien && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-2 mt-2"
                            onClick={() => openMeetingLink(meeting.lien)}
                          >
                            <Video className="h-4 w-4" />
                            <span>Rejoindre</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Pas de rendez-vous programmés pour cette date.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Tous mes rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="upcoming" 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as 'upcoming' | 'past')}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="past">Passés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="p-4 rounded-lg border border-gray-200 hover:shadow transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{meeting.titre}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(meeting.date), 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}
                          </p>
                          <p className="text-sm mt-2">{meeting.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{meeting.duree} minutes</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getMeetingStatusBadge(meeting.statut)}
                          {meeting.lien && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-2 mt-2"
                              onClick={() => openMeetingLink(meeting.lien)}
                            >
                              <Video className="h-4 w-4" />
                              <span>Rejoindre</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Vous n'avez aucun rendez-vous à venir.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastMeetings.length > 0 ? (
                <div className="space-y-4">
                  {pastMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="p-4 rounded-lg border border-gray-200 opacity-80"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{meeting.titre}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(meeting.date), 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}
                          </p>
                          <p className="text-sm mt-2">{meeting.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{meeting.duree} minutes</span>
                          </div>
                        </div>
                        <div>
                          {getMeetingStatusBadge(meeting.statut)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Vous n'avez aucun rendez-vous passé.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAgenda;
