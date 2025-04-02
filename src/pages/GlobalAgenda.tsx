
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Meeting, RendezVous } from '@/types';
import { fetchMeetings } from '@/services/meetingService';
import { fetchRendezVous } from '@/services/rendezVousService';
import { addDays, format, getDay, getWeek, isSameDay, isSameWeek, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, Video } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type AppointmentType = 'meeting' | 'rdv';
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime?: string;
  type: AppointmentType;
  details: Meeting | RendezVous;
};

const GlobalAgenda: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'meetings' | 'rdv'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'day' | 'week'>(isMobile ? 'day' : 'week');
  
  // Generate days of the week from current week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  
  // Time slots for the week view
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [meetingsData, rdvData] = await Promise.all([
          fetchMeetings(),
          fetchRendezVous()
        ]);
        
        setMeetings(meetingsData);
        setRendezVous(rdvData);
        
        // Process events
        const allEvents: CalendarEvent[] = [
          ...meetingsData.map((meeting): CalendarEvent => {
            const meetingDate = new Date(meeting.date);
            const endTime = new Date(meetingDate);
            endTime.setMinutes(endTime.getMinutes() + meeting.duree);
            
            return {
              id: meeting.id,
              title: meeting.titre,
              date: meetingDate,
              startTime: format(meetingDate, 'HH:mm'),
              endTime: format(endTime, 'HH:mm'),
              type: 'meeting',
              details: meeting
            };
          }),
          ...rdvData.map((rdv): CalendarEvent => {
            const rdvDate = new Date(rdv.date);
            // Assuming rendez-vous are 1 hour by default
            const endTime = new Date(rdvDate);
            endTime.setHours(endTime.getHours() + 1);
            
            return {
              id: rdv.id,
              title: `RDV: ${rdv.dossier.client.nom} ${rdv.dossier.client.prenom}`,
              date: rdvDate,
              startTime: format(rdvDate, 'HH:mm'),
              endTime: format(endTime, 'HH:mm'),
              type: 'rdv',
              details: rdv
            };
          })
        ];
        
        setEvents(allEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les rendez-vous.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Set view based on screen size when component mounts or screen size changes
  useEffect(() => {
    setActiveView(isMobile ? 'day' : 'week');
  }, [isMobile]);
  
  // Filter events based on selected filter type
  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    return event.type === (filterType === 'meetings' ? 'meeting' : 'rdv');
  });
  
  // Events for selected date (for the calendar view)
  const eventsForSelectedDate = filteredEvents.filter(event => 
    isSameDay(event.date, selectedDate)
  ).sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });
  
  // Events for current week (for the week view)
  const eventsForCurrentWeek = filteredEvents.filter(event => 
    isSameWeek(event.date, currentWeek, { weekStartsOn: 1 })
  );
  
  // Function to find events for a specific day and time slot
  const getEventsForTimeSlot = (day: Date, timeSlot: string) => {
    const [hour] = timeSlot.split(':').map(Number);
    
    return eventsForCurrentWeek.filter(event => {
      const eventDate = new Date(event.date);
      const eventHour = eventDate.getHours();
      return isSameDay(eventDate, day) && eventHour === hour;
    });
  };
  
  // Navigation functions for the week view
  const goToNextWeek = () => {
    const nextWeek = addDays(currentWeek, 7);
    setCurrentWeek(nextWeek);
  };
  
  const goToPreviousWeek = () => {
    const previousWeek = addDays(currentWeek, -7);
    setCurrentWeek(previousWeek);
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };
  
  const dateHasEvent = (date: Date) => {
    return filteredEvents.some(event => isSameDay(event.date, date));
  };
  
  const getEventTypeColor = (type: AppointmentType) => {
    return type === 'meeting' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Agenda global</h1>
      
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
        <div className="flex gap-2 items-center flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousWeek}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToCurrentWeek}
            className="h-8 px-2"
          >
            Aujourd'hui
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextWeek}
            className="h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium ml-1">
            {format(currentWeek, 'dd MMM', { locale: fr })} - {format(addDays(currentWeek, 6), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          {!isMobile && (
            <div className="flex gap-2">
              <Button 
                variant={activeView === 'day' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveView('day')}
                className="h-8"
              >
                Jour
              </Button>
              <Button 
                variant={activeView === 'week' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveView('week')}
                className="h-8"
              >
                Semaine
              </Button>
            </div>
          )}
          
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as 'all' | 'meetings' | 'rdv')}
            >
              <SelectTrigger className="w-[130px] md:w-[180px] h-8">
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="meetings">Réunions</SelectItem>
                <SelectItem value="rdv">Rendez-vous clients</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center py-12">
              <p>Chargement de l'agenda...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {/* Calendar and Day View */}
          <div className={`grid grid-cols-1 ${activeView === 'day' || isMobile ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-4 md:gap-6`}>
            <Card className={activeView === 'day' || isMobile ? 'md:col-span-1' : 'hidden md:block'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-5 w-5" />
                  Calendrier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border mx-auto"
                  modifiers={{
                    event: (date) => dateHasEvent(date),
                  }}
                  modifiersStyles={{
                    event: { fontWeight: 'bold', backgroundColor: 'rgba(99, 102, 241, 0.1)' }
                  }}
                  locale={fr}
                />
                
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium">Événements du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}</h3>
                  {eventsForSelectedDate.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {eventsForSelectedDate.map((event) => (
                        <div 
                          key={`${event.type}-${event.id}`} 
                          className={`p-3 rounded-lg border ${getEventTypeColor(event.type)} cursor-pointer hover:shadow-sm transition-shadow`}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs">
                                {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                              </p>
                            </div>
                            <Info className="h-4 w-4 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Pas d'événements pour cette date.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Day View Events */}
            {(activeView === 'day' || isMobile) && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: fr })}
                  </CardTitle>
                  <CardDescription>
                    {eventsForSelectedDate.length} événement{eventsForSelectedDate.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDate.length > 0 ? (
                    <div className="space-y-3">
                      {eventsForSelectedDate.map((event) => (
                        <div 
                          key={`day-${event.type}-${event.id}`} 
                          className={`p-4 rounded-lg border ${getEventTypeColor(event.type)} cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {format(event.date, 'EEEE dd MMMM', { locale: fr })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                                </p>
                              </div>
                              {event.type === 'meeting' && (
                                <p className="text-sm mt-2">{(event.details as Meeting).description}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {event.type === 'meeting' ? 'Réunion' : 'Rendez-vous'}
                              </span>
                              {event.type === 'meeting' && (event.details as Meeting).lien && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-2 h-8 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open((event.details as Meeting).lien, '_blank');
                                  }}
                                >
                                  <Video className="h-3 w-3 mr-1" />
                                  Rejoindre
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Pas d'événements pour cette date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Week View */}
          {(activeView === 'week' && !isMobile) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vue hebdomadaire</CardTitle>
                <CardDescription>
                  Semaine {getWeek(currentWeek)} - {format(currentWeek, 'MMMM yyyy', { locale: fr })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    {/* Days header */}
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      <div className="col-span-1"></div>
                      {daysOfWeek.map((day, index) => (
                        <div 
                          key={index} 
                          className={`col-span-1 text-center font-medium p-2 rounded-t-md ${
                            isSameDay(day, new Date()) ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div className="text-sm">{format(day, 'EEE', { locale: fr })}</div>
                          <div className={`text-lg ${
                            isSameDay(day, new Date()) ? 'text-primary' : ''
                          }`}>
                            {format(day, 'dd')}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Time slots */}
                    {timeSlots.map((timeSlot) => (
                      <div 
                        key={timeSlot} 
                        className="grid grid-cols-8 gap-1 border-t py-1"
                      >
                        <div className="col-span-1 text-right pr-2 text-sm text-muted-foreground pt-1">
                          {timeSlot}
                        </div>
                        
                        {daysOfWeek.map((day, dayIndex) => {
                          const eventsForSlot = getEventsForTimeSlot(day, timeSlot);
                          return (
                            <div 
                              key={dayIndex} 
                              className={`col-span-1 h-16 border border-dashed rounded-sm ${
                                isSameDay(day, new Date()) ? 'bg-primary/5' : ''
                              }`}
                            >
                              {eventsForSlot.length > 0 ? (
                                <div className="p-1 h-full overflow-y-auto">
                                  {eventsForSlot.map((event) => (
                                    <div
                                      key={`${event.type}-${event.id}`}
                                      className={`p-1 text-xs rounded mb-1 cursor-pointer ${getEventTypeColor(event.type)}`}
                                      onClick={() => handleEventClick(event)}
                                    >
                                      <div className="font-medium truncate">{event.title}</div>
                                      <div>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Event details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'événement</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{selectedEvent.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(selectedEvent.date, 'EEEE dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-sm">
                  Horaire: {selectedEvent.startTime}{selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ''}
                </p>
              </div>
              
              {selectedEvent.type === 'meeting' && (
                <div className="space-y-2">
                  <p className="text-sm">{(selectedEvent.details as Meeting).description}</p>
                  <p className="text-sm">Durée: {(selectedEvent.details as Meeting).duree} minutes</p>
                  <p className="text-sm">Type: {(selectedEvent.details as Meeting).type === 'visio' ? 'Visioconférence' : 'Présentiel'}</p>
                  <p className="text-sm">Statut: {
                    (selectedEvent.details as Meeting).statut === 'planifie' ? 'Planifié' :
                    (selectedEvent.details as Meeting).statut === 'en_cours' ? 'En cours' :
                    (selectedEvent.details as Meeting).statut === 'termine' ? 'Terminé' : 'Annulé'
                  }</p>
                  
                  {(selectedEvent.details as Meeting).lien && (
                    <Button
                      onClick={() => window.open((selectedEvent.details as Meeting).lien, '_blank')}
                      className="w-full mt-2 flex items-center justify-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      <span>Rejoindre la réunion</span>
                    </Button>
                  )}
                </div>
              )}
              
              {selectedEvent.type === 'rdv' && (
                <div className="space-y-2">
                  <p className="text-sm">Client: {(selectedEvent.details as RendezVous).dossier.client.nom} {(selectedEvent.details as RendezVous).dossier.client.prenom}</p>
                  <p className="text-sm">Lieu: {(selectedEvent.details as RendezVous).location || 'Non spécifié'}</p>
                  <p className="text-sm">Statut: {(selectedEvent.details as RendezVous).honore ? 'Honoré' : 'Non honoré'}</p>
                  {(selectedEvent.details as RendezVous).notes && (
                    <div>
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm">{(selectedEvent.details as RendezVous).notes}</p>
                    </div>
                  )}
                  
                  {(selectedEvent.details as RendezVous).meetingLink && (
                    <Button
                      onClick={() => window.open((selectedEvent.details as RendezVous).meetingLink, '_blank')}
                      className="w-full mt-2 flex items-center justify-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      <span>Rejoindre le rendez-vous</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalAgenda;
