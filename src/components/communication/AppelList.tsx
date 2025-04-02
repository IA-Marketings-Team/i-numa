
import React, { useState } from 'react';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Phone, PhoneCall, PhoneOff, Plus } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AppelForm } from './AppelForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const AppelList = () => {
  const { user } = useAuth();
  const { appels, fetchingAppels, addAppel, editAppel, removeAppel } = useCommunication();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppel, setSelectedAppel] = useState<string | null>(null);

  if (!user) return null;

  const userAppels = appels.filter(
    appel => appel.clientId === user.id || appel.agentId === user.id
  );

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'planifie': return <CalendarIcon className="h-4 w-4" />;
      case 'effectue': return <PhoneCall className="h-4 w-4" />;
      case 'manque': return <PhoneOff className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'planifie':
        return <Badge variant="outline" className="bg-blue-50">Planifié</Badge>;
      case 'effectue':
        return <Badge variant="outline" className="bg-green-50">Effectué</Badge>;
      case 'manque':
        return <Badge variant="outline" className="bg-red-50">Manqué</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (fetchingAppels) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Appels</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Nouvel appel
          </Button>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appels</h2>
        <Button onClick={() => {
          setSelectedAppel(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel appel
        </Button>
      </div>

      {userAppels.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucun appel à afficher
          </CardContent>
        </Card>
      ) : (
        userAppels.map((appel) => (
          <Card key={appel.id} className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedAppel(appel.id);
              setIsFormOpen(true);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base font-semibold flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Appel de {appel.duree} minutes
                </CardTitle>
                {getStatusBadge(appel.statut)}
              </div>
              <CardDescription>
                {formatDistance(new Date(appel.date), new Date(), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appel.notes ? (
                <p className="text-sm text-muted-foreground line-clamp-2">{appel.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune note</p>
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAppel ? "Modifier l'appel" : "Nouvel appel"}
            </DialogTitle>
          </DialogHeader>
          <AppelForm 
            appelId={selectedAppel} 
            onSuccess={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
