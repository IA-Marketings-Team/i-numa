import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getDossiers } from '@/services/dossierService';
import { fetchRendezVous } from '@/services/rendezVousService';
import { RendezVous, Dossier } from '@/types';

const GlobalAgenda: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch dossiers
        const dossiersData = await getDossiers();
        setDossiers(dossiersData);

        // Fetch rendez-vous
        const rendezVousData = await fetchRendezVous();
        setRendezVous(rendezVousData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'agenda global."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleAddRendezVous = () => {
    navigate("/rendezvous/nouveau");
  };

  // Filter rendez-vous based on user role
  const filteredRendezVous = rendezVous.filter(rdv => {
    if (!user) return false;

    switch (user.role) {
      case 'agent_phoner':
        return dossiers.find(d => d.id === rdv.dossierId)?.agentPhonerId === user.id;
      case 'agent_visio':
        return dossiers.find(d => d.id === rdv.dossierId)?.agentVisioId === user.id;
      case 'superviseur':
      case 'responsable':
        return true;
      default:
        return false;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Agenda Global</h1>
        <Button onClick={handleAddRendezVous}>
          <Plus className="mr-2 h-4 w-4" />
          Planifier un RDV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prochains Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Chargement des rendez-vous...</p>
          ) : filteredRendezVous.length > 0 ? (
            <div className="grid gap-4">
              {filteredRendezVous.map((rdv) => {
                const dossier = dossiers.find(d => d.id === rdv.dossierId);
                return (
                  <div key={rdv.id} className="border rounded-md p-4">
                    <p className="font-semibold">
                      {dossier?.client.nom} {dossier?.client.prenom}
                    </p>
                    <p>Date: {new Date(rdv.date).toLocaleDateString()}</p>
                    <p>Heure: {rdv.heure}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Aucun rendez-vous à venir.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalAgenda;
