
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchRendezVous } from "@/services/rendezVousService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const AgendaPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [rendezVous, setRendezVous] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState("semaine");

  useEffect(() => {
    loadRendezVous();
  }, []);

  const loadRendezVous = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRendezVous();
      setRendezVous(data);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos rendez-vous.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes rendez-vous</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nouveau rendez-vous
        </Button>
      </div>

      <Tabs defaultValue={viewMode} onValueChange={setViewMode}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
            <TabsTrigger value="liste">Liste</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jour" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda du jour</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-10">Chargement de l'agenda...</p>
              ) : (
                <p className="text-center py-10">
                  Fonctionnalité en cours de développement
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semaine" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda de la semaine</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-10">Chargement de l'agenda...</p>
              ) : (
                <p className="text-center py-10">
                  Fonctionnalité en cours de développement
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mois" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda du mois</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-10">Chargement de l'agenda...</p>
              ) : (
                <p className="text-center py-10">
                  Fonctionnalité en cours de développement
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liste" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-10">Chargement des rendez-vous...</p>
              ) : rendezVous.length > 0 ? (
                <div className="space-y-4">
                  {rendezVous.map((rdv) => (
                    <div
                      key={rdv.id}
                      className="p-4 border rounded-lg flex items-start gap-4 hover:bg-gray-50"
                    >
                      <div className="bg-primary/10 rounded-full p-3">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {rdv.dossier
                            ? `Dossier #${rdv.dossier.id.slice(0, 8)}`
                            : "Rendez-vous"}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(rdv.date), "PPP à HH:mm", {
                            locale: fr,
                          })}
                        </div>
                        {rdv.notes && (
                          <p className="text-sm mt-2">{rdv.notes}</p>
                        )}
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10">
                  Vous n'avez aucun rendez-vous planifié.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgendaPage;
