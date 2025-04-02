
import React, { useState } from 'react';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Presentation, Video, Plus, Globe, Phone } from 'lucide-react';
import { formatDistance, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MeetingForm } from './MeetingForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const MeetingList = () => {
  const { user } = useAuth();
  const { meetings, fetchingMeetings } = useCommunication();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);

  if (!user) return null;

  const userMeetings = meetings.filter(
    meeting => meeting.participants.includes(user.id)
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visio': return <Video className="h-4 w-4" />;
      case 'presentiel': return <Presentation className="h-4 w-4" />;
      case 'telephonique': return <Phone className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'planifie':
        return <Badge variant="outline" className="bg-blue-50">Planifiée</Badge>;
      case 'en_cours':
        return <Badge variant="outline" className="bg-yellow-50">En cours</Badge>;
      case 'termine':
        return <Badge variant="outline" className="bg-green-50">Terminée</Badge>;
      case 'annule':
        return <Badge variant="outline" className="bg-red-50">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (fetchingMeetings) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Réunions</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle réunion
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
        <h2 className="text-2xl font-bold">Réunions</h2>
        <Button onClick={() => {
          setSelectedMeeting(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle réunion
        </Button>
      </div>

      {userMeetings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucune réunion à afficher
          </CardContent>
        </Card>
      ) : (
        userMeetings.map((meeting) => (
          <Card key={meeting.id} className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedMeeting(meeting.id);
              setIsFormOpen(true);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base font-semibold flex items-center">
                  {getTypeIcon(meeting.type)}
                  <span className="ml-2">{meeting.titre}</span>
                </CardTitle>
                {getStatusBadge(meeting.statut)}
              </div>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {format(new Date(meeting.date), 'PPP à HH:mm', { locale: fr })}
                <span>•</span>
                <span>{meeting.duree} min</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {meeting.description ? (
                <p className="text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune description</p>
              )}
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {meeting.participants.length} participant{meeting.participants.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMeeting ? "Modifier la réunion" : "Nouvelle réunion"}
            </DialogTitle>
          </DialogHeader>
          <MeetingForm 
            meetingId={selectedMeeting} 
            onSuccess={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
