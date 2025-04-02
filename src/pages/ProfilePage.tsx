
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Clock, Building, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UserProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    dossiers: 0,
    rendezvous: 0,
    appels: 0
  });

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Récupérer le nombre de dossiers associés à l'utilisateur
        const { count: dossiersCount, error: dossiersError } = await supabase
          .from('dossiers')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', user.id);
          
        if (dossiersError) throw dossiersError;
        
        // Récupérer le nombre de rendez-vous associés aux dossiers de l'utilisateur
        const { data: dossiers, error: dossiersListError } = await supabase
          .from('dossiers')
          .select('id')
          .eq('client_id', user.id);
          
        if (dossiersListError) throw dossiersListError;
        
        const dossierIds = dossiers.map(d => d.id);
        
        let rendezVousCount = 0;
        if (dossierIds.length > 0) {
          const { count, error: rdvError } = await supabase
            .from('rendez_vous')
            .select('id', { count: 'exact', head: true })
            .in('dossier_id', dossierIds);
            
          if (rdvError) throw rdvError;
          rendezVousCount = count || 0;
        }
        
        // Récupérer le nombre d'appels associés à l'utilisateur
        const { count: appelsCount, error: appelsError } = await supabase
          .from('appels')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', user.id);
          
        if (appelsError) throw appelsError;
        
        setUserStats({
          dossiers: dossiersCount || 0,
          rendezvous: rendezVousCount,
          appels: appelsCount || 0
        });
        
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos statistiques. Veuillez réessayer plus tard.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStatistics();
  }, [user, toast]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mon profil</CardTitle>
              <CardDescription>Informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage alt={`${user.prenom} ${user.nom}`} />
                <AvatarFallback className="text-xl">
                  {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{user.prenom} {user.nom}</h2>
              
              <Badge variant="outline" className="mb-4">
                {user.role === 'client' ? 'Client' : 
                 user.role === 'agent_phoner' ? 'Agent Phoner' : 
                 user.role === 'agent_visio' ? 'Agent Visio' : 
                 user.role === 'superviseur' ? 'Superviseur' : 
                 user.role === 'responsable' ? 'Responsable' : 'Utilisateur'}
              </Badge>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                {user.telephone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{user.telephone}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Membre depuis {new Date(user.dateCreation).toLocaleDateString()}</span>
                </div>
                
                {user.adresse && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {user.adresse}<br />
                      {user.codePostal} {user.ville}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité</CardTitle>
                <CardDescription>Statistiques de votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/40 rounded-lg p-4">
                    <h3 className="text-lg font-medium">Dossiers</h3>
                    <p className="text-3xl font-bold">{isLoading ? '...' : userStats.dossiers}</p>
                  </div>
                  
                  <div className="bg-muted/40 rounded-lg p-4">
                    <h3 className="text-lg font-medium">Rendez-vous</h3>
                    <p className="text-3xl font-bold">{isLoading ? '...' : userStats.rendezvous}</p>
                  </div>
                  
                  <div className="bg-muted/40 rounded-lg p-4">
                    <h3 className="text-lg font-medium">Appels</h3>
                    <p className="text-3xl font-bold">{isLoading ? '...' : userStats.appels}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>Modifier vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" value={user.prenom || ''} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" value={user.nom || ''} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email || ''} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input id="telephone" value={user.telephone || ''} readOnly />
                    </div>
                  </div>
                  
                  <Button className="mt-2" disabled>Mettre à jour</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contactez un administrateur pour modifier vos informations personnelles.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
