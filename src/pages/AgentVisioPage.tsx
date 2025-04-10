
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Dossier, RendezVous } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getDossiers } from '@/services/dossierService';
import { fetchUpcomingRendezVous } from '@/services/rendezVousService';

const AgentVisioPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingRdvs, setUpcomingRdvs] = useState<RendezVous[]>([]);
  const [myDossiers, setMyDossiers] = useState<Dossier[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load upcoming appointments
        const rdvs = await fetchUpcomingRendezVous(14); // Next 2 weeks
        const myRdvs = rdvs.filter(rdv => 
          rdv.dossier.agentVisioId === user.id
        );
        setUpcomingRdvs(myRdvs);
        
        // Load my dossiers
        const allDossiers = await getDossiers();
        const filteredDossiers = allDossiers.filter(
          dossier => dossier.agentVisioId === user.id
        );
        setMyDossiers(filteredDossiers);
      } catch (error) {
        console.error("Error loading agent visio data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord Agent Visio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes rendez-vous à venir</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Chargement...</p>
            ) : upcomingRdvs.length === 0 ? (
              <p>Aucun rendez-vous prévu</p>
            ) : (
              <ul className="space-y-4">
                {upcomingRdvs.map(rdv => (
                  <li key={rdv.id} className="border-b pb-3">
                    <p className="font-medium">
                      {rdv.dossier.client.prenom} {rdv.dossier.client.nom}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(rdv.date).toLocaleDateString()} à {rdv.heure || ''}
                    </p>
                    {rdv.meetingLink && (
                      <a 
                        href={rdv.meetingLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-blue-500 underline"
                      >
                        Lien de visioconférence
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Chargement...</p>
            ) : myDossiers.length === 0 ? (
              <p>Aucun dossier assigné</p>
            ) : (
              <ul className="space-y-4">
                {myDossiers.map(dossier => (
                  <li key={dossier.id} className="border-b pb-3">
                    <p className="font-medium">
                      {dossier.client.prenom} {dossier.client.nom}
                    </p>
                    <p className="text-sm text-gray-500">
                      Statut: {dossier.status}
                    </p>
                    <a 
                      href={`/dossiers/${dossier.id}`}
                      className="text-sm text-blue-500 underline"
                    >
                      Voir le dossier
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentVisioPage;
