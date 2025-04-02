
import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parse, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Filter, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { RendezVous, Dossier } from "@/types";
import RendezVousAgenda from "@/components/stats/RendezVousAgenda";
import RendezVousFormDialog from "@/components/stats/RendezVousFormDialog";
import DeleteRendezVousDialog from "@/components/stats/DeleteRendezVousDialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GlobalAgenda = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(currentDate, { weekStartsOn: 1 }));
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [filteredRdvs, setFilteredRdvs] = useState<RendezVous[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isRdvFormOpen, setIsRdvFormOpen] = useState(false);
  const [editingRdvId, setEditingRdvId] = useState<string | null>(null);
  const [deletingRdvId, setDeletingRdvId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    getAllRendezVous, 
    getAllDossiers, 
    addRendezVous, 
    updateRendezVous, 
    deleteRendezVous 
  } = useDossier();

  // Charger tous les rendez-vous et dossiers
  useEffect(() => {
    const loadData = async () => {
      try {
        const allDossiers = await getAllDossiers();
        setDossiers(allDossiers);
        
        const allRdvs = await getAllRendezVous();
        setRdvs(allRdvs);
        setFilteredRdvs(allRdvs);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les rendez-vous."
        });
      }
    };
    
    loadData();
  }, [getAllRendezVous, getAllDossiers, toast]);

  // Mettre à jour les dates de début et de fin quand currentDate change
  useEffect(() => {
    setStartDate(startOfWeek(currentDate, { weekStartsOn: 1 }));
    setEndDate(endOfWeek(currentDate, { weekStartsOn: 1 }));
  }, [currentDate]);

  // Filtrer les rendez-vous selon le statut sélectionné
  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredRdvs(rdvs);
    } else if (filterStatus === "honored") {
      setFilteredRdvs(rdvs.filter(rdv => rdv.honore));
    } else if (filterStatus === "notHonored") {
      setFilteredRdvs(rdvs.filter(rdv => !rdv.honore));
    }
  }, [rdvs, filterStatus]);

  // Générer les jours de la semaine
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Formater le jour pour l'affichage
  const formatDay = (date: Date) => {
    return format(date, "EEEE d MMMM", { locale: fr });
  };

  // Récupérer les rendez-vous pour un jour spécifique
  const getRdvsForDay = (day: Date) => {
    return filteredRdvs.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return isSameDay(rdvDate, day);
    });
  };

  // Obtenir le dossier correspondant à un rendez-vous
  const getDossierForRdv = (rdv: RendezVous) => {
    return dossiers.find(d => d.id === rdv.dossierId);
  };

  // Gestion des semaines (précédente et suivante)
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  // Gestion des rendez-vous
  const handleAddRdv = async (newRdv: RendezVous) => {
    try {
      await addRendezVous(newRdv);
      const updatedRdvs = await getAllRendezVous();
      setRdvs(updatedRdvs);
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été ajouté avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le rendez-vous."
      });
    }
    setIsRdvFormOpen(false);
  };

  const handleUpdateRdv = async (id: string, updates: Partial<RendezVous>) => {
    try {
      await updateRendezVous(id, updates);
      const updatedRdvs = await getAllRendezVous();
      setRdvs(updatedRdvs);
      toast({
        title: "Rendez-vous mis à jour",
        description: "Le rendez-vous a été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous."
      });
    }
    setEditingRdvId(null);
  };

  const handleDeleteRdv = async (id: string) => {
    try {
      await deleteRendezVous(id);
      const updatedRdvs = await getAllRendezVous();
      setRdvs(updatedRdvs);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous."
      });
    }
    setDeletingRdvId(null);
  };

  const handleAddClick = () => {
    setEditingRdvId(null);
    setIsRdvFormOpen(true);
  };

  const handleEditClick = (rdvId: string) => {
    setEditingRdvId(rdvId);
    setIsRdvFormOpen(true);
  };

  const handleDeleteClick = (rdvId: string) => {
    setDeletingRdvId(rdvId);
  };

  // Récupérer le rendez-vous en cours d'édition
  const getEditingRdv = () => {
    if (!editingRdvId) return null;
    return rdvs.find(rdv => rdv.id === editingRdvId) || null;
  };

  // Prochains rendez-vous
  const getUpcomingRdvs = () => {
    const now = new Date();
    return filteredRdvs
      .filter(rdv => new Date(rdv.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Agenda Global</h1>
          <p className="text-muted-foreground">Gérez vos rendez-vous et consultez votre planning</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-gray-200 dark:border-gray-800"
            onClick={handleAddClick}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Volet de gauche - Filtres et calendrier */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-3">
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-4 w-4 text-indigo-500" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Statut</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="honored">Honorés</SelectItem>
                      <SelectItem value="notHonored">Non honorés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-3">
              <CardTitle className="text-lg flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 text-indigo-500" />
                Calendrier
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={date => date && setCurrentDate(date)}
                className="mx-auto"
              />
            </CardContent>
          </Card>

          <RendezVousAgenda 
            prochainRdvs={getUpcomingRdvs()}
            dossiers={dossiers}
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        {/* Volet principal - Vue de la semaine/mois */}
        <div className="md:col-span-2">
          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Vue du {format(startDate, "d MMMM", { locale: fr })} au {format(endDate, "d MMMM yyyy", { locale: fr })}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousWeek} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextWeek} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "weekly" | "monthly")}>
                    <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <TabsTrigger value="weekly">Semaine</TabsTrigger>
                      <TabsTrigger value="monthly">Mois</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs value={viewMode} className="w-full">
                <TabsContent value="weekly" className="mt-0">
                  <div className="space-y-4">
                    {weekDays.map((day) => {
                      const dayRdvs = getRdvsForDay(day);
                      return (
                        <div key={day.toISOString()} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                          <div className={`py-2 px-4 font-medium ${
                            isSameDay(day, new Date()) 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                              : 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900'
                          }`}>
                            {formatDay(day)}
                          </div>
                          {dayRdvs.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                              {dayRdvs.map((rdv) => {
                                const dossier = getDossierForRdv(rdv);
                                const rdvTime = format(new Date(rdv.date), "HH:mm");
                                return (
                                  <div 
                                    key={rdv.id} 
                                    className={`p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900 dark:hover:to-purple-900 cursor-pointer transition-colors ${
                                      rdv.honore 
                                        ? 'border-l-4 border-green-500' 
                                        : 'border-l-4 border-yellow-500'
                                    }`}
                                    onClick={() => handleEditClick(rdv.id)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{dossier?.client.nom} {dossier?.client.prenom}</p>
                                        <p className="text-sm text-muted-foreground">{dossier?.client.secteurActivite}</p>
                                      </div>
                                      <div className="text-right">
                                        <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 text-xs rounded-full">
                                          {rdvTime}
                                        </span>
                                      </div>
                                    </div>
                                    {rdv.notes && (
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{rdv.notes}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">
                              Aucun rendez-vous
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="monthly" className="mt-0">
                  <div className="text-center p-8">
                    <p>Vue mensuelle disponible prochainement</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      onClick={() => setViewMode("weekly")}
                    >
                      Revenir à la vue hebdomadaire
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogue pour ajouter/modifier un rendez-vous */}
      <RendezVousFormDialog
        open={isRdvFormOpen}
        onOpenChange={setIsRdvFormOpen}
        dossiers={dossiers}
        rendezVous={getEditingRdv()}
        onRendezVousAdded={handleAddRdv}
        onRendezVousUpdated={handleUpdateRdv}
      />

      {/* Dialogue pour supprimer un rendez-vous */}
      <DeleteRendezVousDialog
        open={!!deletingRdvId}
        onOpenChange={() => setDeletingRdvId(null)}
        onDelete={() => deletingRdvId && handleDeleteRdv(deletingRdvId)}
      />
    </div>
  );
};

export default GlobalAgenda;
