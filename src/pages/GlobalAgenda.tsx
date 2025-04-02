
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, endOfWeek, isWithinInterval, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";
import { useDossierContext } from "@/contexts/DossierContext";
import RendezVousFormDialog from "@/components/stats/RendezVousFormDialog";
import DeleteRendezVousDialog from "@/components/stats/DeleteRendezVousDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dossier, RendezVous } from "@/types";
import { rendezVousService } from "@/services/rendezVousService";
import { dossierService } from "@/services/dossierService";

const getDayName = (date: Date) => {
  return format(date, 'EEEE', { locale: fr });
};

const GlobalAgenda = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isNewRendezVous, setIsNewRendezVous] = useState(false);
  const [activeTab, setActiveTab] = useState("semaine");
  const [rendezVousList, setRendezVousList] = useState<RendezVous[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const { toast } = useToast();
  const { theme } = useTheme();

  const fetchData = async () => {
    try {
      const rendezVousData = await rendezVousService.getAllRendezVous();
      const dossiersData = await dossierService.getAllDossiers();
      setRendezVousList(rendezVousData);
      setDossiers(dossiersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    setWeekStart(start);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    setWeekDays(days);
  }, [date]);

  const filteredRendezVous = rendezVousList.filter(rdv => {
    const dossier = dossiers.find(d => d.id === rdv.dossierId);
    if (!dossier) return false;
    
    const searchText = filter.toLowerCase();
    return (
      dossier.titre?.toLowerCase().includes(searchText) ||
      dossier.client?.nom?.toLowerCase().includes(searchText) ||
      dossier.client?.prenom?.toLowerCase().includes(searchText) ||
      rdv.notes?.toLowerCase().includes(searchText)
    );
  });

  const getRendezVousForDay = (day: Date) => {
    return filteredRendezVous.filter(rdv => {
      const rdvDate = parseISO(rdv.date);
      return isSameDay(rdvDate, day);
    });
  };

  const getRendezVousForWeek = () => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return filteredRendezVous.filter(rdv => {
      const rdvDate = parseISO(rdv.date);
      return isWithinInterval(rdvDate, { start: weekStart, end: weekEnd });
    });
  };

  const handleOpenFormDialog = (rdv?: RendezVous) => {
    if (rdv) {
      setSelectedRendezVous(rdv);
      setIsNewRendezVous(false);
    } else {
      setSelectedRendezVous(null);
      setIsNewRendezVous(true);
    }
    setFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setDeleteDialogOpen(true);
  };

  const handleAddRendezVous = async (newRdv: RendezVous) => {
    try {
      await rendezVousService.createRendezVous(newRdv);
      await fetchData();
      
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été ajouté avec succès",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleUpdateRendezVous = async (id: string, updates: Partial<RendezVous>) => {
    try {
      await rendezVousService.updateRendezVous(id, updates);
      await fetchData();
      
      toast({
        title: "Rendez-vous mis à jour",
        description: "Le rendez-vous a été modifié avec succès",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rendez-vous",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteRendezVous = async () => {
    if (!selectedRendezVous) return;
    
    try {
      await rendezVousService.deleteRendezVous(selectedRendezVous.id);
      await fetchData();
      
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès",
        variant: "default",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive",
      });
    }
  };

  const handlePrevWeek = () => {
    setDate(addDays(date, -7));
  };

  const handleNextWeek = () => {
    setDate(addDays(date, 7));
  };

  const renderDayColumn = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const dayRendezVous = getRendezVousForDay(day);
    
    return (
      <div key={day.toISOString()} className="flex flex-col h-full min-w-[180px]">
        <div className={`p-2 text-center font-medium sticky top-0 z-10 ${
          isToday ? 'bg-inuma-red text-white' : 'bg-muted'
        }`}>
          <div className="capitalize">{getDayName(day)}</div>
          <div>{format(day, 'dd/MM/yyyy')}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-1 space-y-2">
          {dayRendezVous.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
              Aucun rendez-vous
            </div>
          ) : (
            dayRendezVous.map(rdv => {
              const dossier = dossiers.find(d => d.id === rdv.dossierId);
              return (
                <Card 
                  key={rdv.id} 
                  className="card-hover cursor-pointer bg-card shadow-sm border border-inuma-blue/10 hover:border-inuma-blue/30"
                  onClick={() => handleOpenFormDialog(rdv)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {format(parseISO(rdv.date), 'HH:mm')}
                        </p>
                        <p className="text-xs mt-1 text-muted-foreground">
                          {dossier?.client?.nom} {dossier?.client?.prenom}
                        </p>
                        <p className="text-xs font-medium mt-1 line-clamp-2">
                          {dossier?.titre}
                        </p>
                      </div>
                      <Badge className={`${
                        rdv.type === 'visio' 
                          ? 'bg-inuma-blue/10 text-inuma-blue' 
                          : 'bg-inuma-red/10 text-inuma-red'
                      }`}>
                        {rdv.type === 'visio' ? 'Visio' : 'Téléphonique'}
                      </Badge>
                    </div>
                    {rdv.notes && (
                      <p className="text-xs mt-2 line-clamp-2 italic text-muted-foreground">
                        {rdv.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container space-y-4 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda global</h2>
          <p className="text-muted-foreground">
            Consultez et gérez tous les rendez-vous de l'équipe
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevWeek}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-8 justify-start text-left font-normal w-[160px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PP", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="ml-2 bg-inuma-red hover:bg-inuma-lightRed"
            onClick={() => handleOpenFormDialog()}
          >
            <Plus className="mr-1 h-4 w-4" /> Nouveau RDV
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Tabs
          defaultValue="semaine"
          value={activeTab}
          onValueChange={setActiveTab}
          className="ml-4"
        >
          <TabsList>
            <TabsTrigger value="semaine">Vue semaine</TabsTrigger>
            <TabsTrigger value="liste">Vue liste</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="overflow-hidden border-inuma-blue/10">
        <CardHeader className="p-4 bg-inuma-blue/5">
          <CardTitle>Calendrier des rendez-vous</CardTitle>
          <CardDescription>
            {format(weekStart, "'Semaine du' dd MMMM yyyy", { locale: fr })}
          </CardDescription>
        </CardHeader>
        <Tabs.Root value={activeTab}>
          <TabsContent value="semaine" className="p-0 m-0">
            <div className="overflow-x-auto">
              <div className="flex h-[calc(100vh-350px)] min-h-[400px]">
                {weekDays.map(day => renderDayColumn(day))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="liste" className="p-4 m-0">
            <div className="space-y-4">
              {getRendezVousForWeek().length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun rendez-vous cette semaine
                </div>
              ) : (
                getRendezVousForWeek()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(rdv => {
                    const dossier = dossiers.find(d => d.id === rdv.dossierId);
                    return (
                      <Card 
                        key={rdv.id} 
                        className="overflow-hidden card-hover cursor-pointer border-inuma-blue/10 hover:border-inuma-blue/30"
                      >
                        <CardContent className="p-0">
                          <div 
                            className="p-4 flex flex-col sm:flex-row justify-between gap-4"
                            onClick={() => handleOpenFormDialog(rdv)}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className={`${
                                  rdv.type === 'visio' 
                                    ? 'bg-inuma-blue/10 text-inuma-blue' 
                                    : 'bg-inuma-red/10 text-inuma-red'
                                }`}>
                                  {rdv.type === 'visio' ? 'Visio' : 'Téléphonique'}
                                </Badge>
                                <p className="font-medium">
                                  {dossier?.titre}
                                </p>
                              </div>
                              <p className="text-sm">
                                Client: {dossier?.client?.nom} {dossier?.client?.prenom}
                              </p>
                              {rdv.notes && (
                                <p className="text-sm text-muted-foreground">
                                  {rdv.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right min-w-28">
                                <p className="font-medium">
                                  {format(parseISO(rdv.date), 'EEEE dd MMMM', { locale: fr })}
                                </p>
                                <p className="text-sm font-bold">
                                  {format(parseISO(rdv.date), 'HH:mm')}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-inuma-red hover:text-inuma-lightRed hover:bg-inuma-red/5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDeleteDialog(rdv);
                                }}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </div>
          </TabsContent>
        </Tabs.Root>
      </Card>

      {formDialogOpen && (
        <RendezVousFormDialog
          isOpen={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          dossiers={dossiers}
          rendezVous={selectedRendezVous || undefined}
          onRendezVousAdded={handleAddRendezVous}
          onRendezVousUpdated={handleUpdateRendezVous}
        />
      )}

      {deleteDialogOpen && (
        <DeleteRendezVousDialog
          isOpen={deleteDialogOpen}
          onOpenChange={() => setDeleteDialogOpen(false)}
          onDelete={handleDeleteRendezVous}
        />
      )}
    </div>
  );
};

export default GlobalAgenda;
