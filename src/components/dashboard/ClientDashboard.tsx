
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientDashboardProps {
  recentDossiers: any[];
}

const ClientDashboard: React.FC<ClientDashboardProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientDossiers, setClientDossiers] = useState<any[]>([]);
  const [clientOffres, setClientOffres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchClientData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching dossiers for client ID:", user.id);
        
        // Fetch dossiers for current client
        const { data: dossierData, error: dossierError } = await supabase
          .from('dossiers')
          .select(`
            *,
            client:client_id (
              nom,
              prenom,
              email,
              telephone,
              secteur_activite
            )
          `)
          .eq('client_id', user.id);
          
        if (dossierError) {
          console.error("Error fetching client dossiers:", dossierError);
          throw dossierError;
        }
        
        if (dossierData) {
          console.log("Found dossiers for client:", dossierData.length);
          
          // Transform the data to match our Dossier type
          const formattedDossiers = dossierData.map(dossier => ({
            ...dossier,
            id: dossier.id,
            clientId: dossier.client_id,
            client: dossier.client || {},
            status: dossier.status || 'prospect',
            dateCreation: new Date(dossier.date_creation),
            offres: [] // We'll fetch this separately if needed
          }));
          
          setClientDossiers(formattedDossiers);
        } else {
          setClientDossiers([]);
        }
        
        // Fetch client purchased offers
        const { data: offresData, error: offresError } = await supabase
          .from('dossier_offres')
          .select(`
            *,
            offres:offre_id (*)
          `)
          .in('dossier_id', dossierData?.map(d => d.id) || []);
          
        if (offresError) {
          console.error("Error fetching client offres:", offresError);
        } else if (offresData) {
          const uniqueOffres = [...new Set(offresData.map(o => o.offre_id))].length;
          setClientOffres(Array(uniqueOffres).fill(null));
        } else {
          setClientOffres([]);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos dossiers.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [user, toast]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Mes offres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">{clientOffres.length}</p>
              <p className="text-white/70">Offres actives</p>
              <Button 
                className="mt-4 bg-white text-blue-600 hover:bg-white/90"
                onClick={() => navigate("/marketplace")}
              >
                <Package className="mr-2 h-4 w-4" />
                Voir mes offres
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Mes dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-3xl font-bold">{isLoading ? "..." : clientDossiers.length}</p>
              <p className="text-muted-foreground">Dossiers en cours</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/dossiers")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Consulter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Mon agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col">
              <p className="text-muted-foreground mb-4">
                Consultez et gérez vos rendez-vous
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/agenda")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Voir mon agenda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes derniers dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Chargement des dossiers...</p>
          ) : clientDossiers.length === 0 ? (
            <p className="text-muted-foreground">Aucun dossier récent</p>
          ) : (
            <div className="space-y-4">
              {clientDossiers.map((dossier) => (
                <div 
                  key={dossier.id} 
                  className="flex items-center justify-between border-b pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => navigate(`/dossiers/${dossier.id}`)}
                >
                  <div>
                    <p className="font-medium">Dossier #{dossier.id.substring(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      dossier.status === 'valide' 
                        ? 'bg-green-100 text-green-800' 
                        : dossier.status === 'rdv_en_cours' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : dossier.status === 'signe'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dossier.status === 'valide' ? 'Validé' : 
                       dossier.status === 'rdv_en_cours' ? 'RDV en cours' : 
                       dossier.status === 'signe' ? 'Signé' :
                       dossier.status === 'prospect' ? 'Prospect' :
                       dossier.status || 'Non défini'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
