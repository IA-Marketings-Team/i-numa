
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useDossier } from "@/contexts/DossierContext";
import { Dossier, RendezVous } from "@/types";
import RendezVousFormDialog from "@/components/stats/RendezVousFormDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchRendezVous, 
  fetchUpcomingRendezVous 
} from "@/services/rendezVousService";
import { 
  fetchDossiers 
} from "@/services/dossierService";
import { DossierProvider } from "@/contexts/DossierContext";

// Create a separate content component that will use the DossierContext
const GlobalAgendaContent: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [isNewRdvDialogOpen, setIsNewRdvDialogOpen] = useState(false);
  const [rendezVousList, setRendezVousList] = useState<RendezVous[]>([]);
  const [dossiersList, setDossiersList] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const { addRendezVous, updateRendezVous } = useDossier();

  // Fetch rendez-vous and dossiers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rdvs, dossiers] = await Promise.all([
          fetchUpcomingRendezVous(30), // Get 30 days of upcoming RDVs
          fetchDossiers()
        ]);
        
        setRendezVousList(rdvs);
        setDossiersList(dossiers);
      } catch (error) {
        console.error("Error loading agenda data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données de l'agenda"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Handle adding a new rendez-vous
  const handleRendezVousAdded = async (newRdv: Omit<RendezVous, "id">) => {
    try {
      const addedRdv = await addRendezVous(newRdv);
      if (addedRdv) {
        setRendezVousList(prev => [...prev, addedRdv]);
        toast({
          title: "Rendez-vous ajouté",
          description: "Le rendez-vous a été ajouté avec succès"
        });
        setIsNewRdvDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le rendez-vous"
      });
    }
  };

  // Handle updating a rendez-vous
  const handleRendezVousUpdated = async (id: string, updates: Partial<RendezVous>) => {
    try {
      const success = await updateRendezVous(id, updates);
      if (success) {
        setRendezVousList(prev =>
          prev.map(rdv => rdv.id === id ? { ...rdv, ...updates } : rdv)
        );
        toast({
          title: "Rendez-vous mis à jour",
          description: "Le rendez-vous a été mis à jour avec succès"
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous"
      });
      return false;
    }
  };

  // Get events for the current day
  const getDailyEvents = () => {
    return rendezVousList.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return (
        rdvDate.getDate() === date.getDate() &&
        rdvDate.getMonth() === date.getMonth() &&
        rdvDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get events for the current week
  const getWeeklyEvents = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Monday as first day
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday as last day
    
    return rendezVousList.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return rdvDate >= startOfWeek && rdvDate <= endOfWeek;
    });
  };

  // Get events for the current month
  const getMonthlyEvents = () => {
    return rendezVousList.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return (
        rdvDate.getMonth() === date.getMonth() &&
        rdvDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get events based on current view
  const getCurrentEvents = () => {
    switch (view) {
      case "day":
        return getDailyEvents();
      case "week":
        return getWeeklyEvents();
      case "month":
        return getMonthlyEvents();
      default:
        return [];
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: fr });
  };

  // Render the day view
  const renderDayView = () => {
    const events = getDailyEvents();
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">{formatDate(date)}</h2>
        
        {events.length === 0 ? (
          <p className="text-muted-foreground">Aucun rendez-vous pour cette journée</p>
        ) : (
          <div className="space-y-3">
            {events.map(rdv => (
              <Card key={rdv.id} className="overflow-hidden card-hover">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {rdv.dossier.client.nom} {rdv.dossier.client.prenom}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(new Date(rdv.date))}
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="mr-2">
                          {rdv.dossier.status}
                        </Badge>
                        <Badge variant="outline">
                          {rdv.location || "Emplacement non défini"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {/* Handle view/edit */}}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the week view
  const renderWeekView = () => {
    const events = getWeeklyEvents();
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Monday as first day
    
    // Generate the 7 days of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    // Group events by day
    const eventsByDay = days.map(day => {
      const dayEvents = events.filter(rdv => {
        const rdvDate = new Date(rdv.date);
        return (
          rdvDate.getDate() === day.getDate() &&
          rdvDate.getMonth() === day.getMonth() &&
          rdvDate.getFullYear() === day.getFullYear()
        );
      });
      
      return {
        day,
        events: dayEvents
      };
    });
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">
          Semaine du {format(startOfWeek, "d MMMM", { locale: fr })} au {
            format(
              (() => {
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return endOfWeek;
              })(), 
              "d MMMM yyyy", 
              { locale: fr }
            )
          }
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {eventsByDay.map(({ day, events }) => (
            <div key={day.toString()} className="border rounded-lg p-2">
              <h3 className="font-medium text-center bg-muted py-1 px-2 rounded mb-2">
                {format(day, "EEEE d", { locale: fr })}
              </h3>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center">Aucun RDV</p>
                ) : (
                  events.map(rdv => (
                    <Card key={rdv.id} className="overflow-hidden card-hover shadow-sm">
                      <CardContent className="p-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium">
                              {formatTime(new Date(rdv.date))}
                            </p>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {rdv.honore ? "Honoré" : "À venir"}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium">
                            {rdv.dossier.client.nom} {rdv.dossier.client.prenom}
                          </h4>
                          <p className="text-[10px] text-muted-foreground">
                            {rdv.location || "Lieu non défini"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the month view
  const renderMonthView = () => {
    const events = getMonthlyEvents();
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">
          {format(date, "MMMM yyyy", { locale: fr })}
        </h2>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
            disabled={{ before: new Date(2020, 0, 1) }}
            modifiers={{
              hasEvent: events.map(rdv => new Date(rdv.date))
            }}
            modifiersClassNames={{
              hasEvent: "bg-inuma-red/10 font-bold text-inuma-red"
            }}
          />
        </div>
        
        <div className="mt-6 space-y-2">
          <h3 className="font-medium">Rendez-vous du mois ({events.length})</h3>
          
          {events.length === 0 ? (
            <p className="text-muted-foreground">Aucun rendez-vous pour ce mois</p>
          ) : (
            <div className="space-y-2">
              {events.map(rdv => (
                <Card key={rdv.id} className="overflow-hidden card-hover">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {rdv.dossier.client.nom} {rdv.dossier.client.prenom}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(rdv.date))} à {formatTime(new Date(rdv.date))}
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="mr-2">
                            {rdv.dossier.status}
                          </Badge>
                          <Badge variant="outline">
                            {rdv.location || "Emplacement non défini"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {/* Handle view/edit */}}
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-inuma-blue to-inuma-lightBlue bg-clip-text text-transparent">
            Agenda Global
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des rendez-vous planifiés
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-inuma-blue to-inuma-lightBlue hover:from-inuma-blue/90 hover:to-inuma-lightBlue/90"
            onClick={() => setIsNewRdvDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Calendrier des rendez-vous</CardTitle>
            
            <div className="flex flex-row items-center">
              <Tabs defaultValue="week" value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList>
                  <TabsTrigger value="day">Jour</TabsTrigger>
                  <TabsTrigger value="week">Semaine</TabsTrigger>
                  <TabsTrigger value="month">Mois</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <p>Chargement des données...</p>
            </div>
          ) : (
            <>
              {view === "day" && renderDayView()}
              {view === "week" && renderWeekView()}
              {view === "month" && renderMonthView()}
            </>
          )}
        </CardContent>
      </Card>

      {isNewRdvDialogOpen && (
        <RendezVousFormDialog
          isOpen={isNewRdvDialogOpen}
          onOpenChange={setIsNewRdvDialogOpen}
          dossiers={dossiersList}
          onRendezVousAdded={handleRendezVousAdded}
          onRendezVousUpdated={handleRendezVousUpdated}
        />
      )}
    </div>
  );
};

// Wrapper component with DossierProvider
const GlobalAgenda: React.FC = () => {
  return (
    <DossierProvider>
      <GlobalAgendaContent />
    </DossierProvider>
  );
};

export default GlobalAgenda;
