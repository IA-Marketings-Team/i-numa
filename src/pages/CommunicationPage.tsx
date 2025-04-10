
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunication } from "@/contexts/CommunicationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Appel, Meeting, DossierConsultation } from "@/types";
import { fetchDossierConsultations } from "@/services/consultationService";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BadgeCheck, 
  BadgeX, 
  Calendar, 
  History, 
  Monitor, 
  Phone, 
  User 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CommunicationPage: React.FC = () => {
  const { user } = useAuth();
  const { appels, meetings, fetchAppels, fetchMeetings } = useCommunication();
  const [activeTab, setActiveTab] = useState("meetings");
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAppels(), fetchMeetings()]);
      try {
        const consultationsData = await fetchDossierConsultations();
        setConsultations(consultationsData);
      } catch (error) {
        console.error("Erreur lors du chargement des consultations:", error);
      }
      setLoading(false);
    };
    
    loadData();
  }, [fetchAppels, fetchMeetings]);

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Communications</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="meetings">
            <Calendar className="h-4 w-4 mr-2" />
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger value="appels">
            <Phone className="h-4 w-4 mr-2" />
            Appels
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Consultations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="meetings" className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <p>Chargement des rendez-vous...</p>
            </div>
          ) : meetings.length === 0 ? (
            <Alert>
              <AlertTitle>Aucun rendez-vous</AlertTitle>
              <AlertDescription>
                Vous n'avez pas de rendez-vous planifiés.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardHeader className={`pb-2 ${
                    meeting.statut === 'planifie' ? 'bg-blue-50' : 
                    meeting.statut === 'effectue' ? 'bg-green-50' : 
                    meeting.statut === 'manque' ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{meeting.titre}</CardTitle>
                      <Badge className={`${
                        meeting.statut === 'planifie' ? 'bg-blue-100 text-blue-800' : 
                        meeting.statut === 'effectue' ? 'bg-green-100 text-green-800' : 
                        meeting.statut === 'manque' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {meeting.statut === 'planifie' ? 'Planifié' : 
                         meeting.statut === 'effectue' ? 'Effectué' : 
                         meeting.statut === 'manque' ? 'Manqué' : meeting.statut}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <time>{formatDate(meeting.date)}</time>
                      </div>
                      <div className="flex items-center text-sm">
                        <Monitor className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{meeting.type === 'visio' ? 'Visio-conférence' : 'Présentiel'}</span>
                        {meeting.type === 'visio' && meeting.lien && (
                          <a href={meeting.lien} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                            Rejoindre
                          </a>
                        )}
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{meeting.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="appels" className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <p>Chargement des appels...</p>
            </div>
          ) : appels.length === 0 ? (
            <Alert>
              <AlertTitle>Aucun appel</AlertTitle>
              <AlertDescription>
                Vous n'avez pas d'appels enregistrés.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appels.map((appel) => (
                <Card key={appel.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{appel.entreprise || 'Client'}</CardTitle>
                      <Badge className={`${
                        appel.statut === 'RDV' ? 'bg-green-100 text-green-800' :
                        appel.statut === 'Vente' ? 'bg-blue-100 text-blue-800' :
                        appel.statut === 'Répondeur' || appel.statut === 'Rappel' ? 'bg-yellow-100 text-yellow-800' :
                        appel.statut === 'Refus argumentaire' || appel.statut === 'Refus intro' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appel.statut}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{appel.contact || appel.gerant || 'Contact inconnu'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <time>{formatDate(appel.date)}</time>
                        <span className="mx-2">•</span>
                        <span>{appel.duree} min</span>
                      </div>
                      {appel.notes && (
                        <p className="text-sm text-gray-600 line-clamp-2">{appel.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <p>Chargement de l'historique...</p>
            </div>
          ) : consultations.length === 0 ? (
            <Alert>
              <AlertTitle>Aucune consultation</AlertTitle>
              <AlertDescription>
                Aucun dossier n'a été consulté récemment.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {consultations.map((consultation) => (
                <Card key={consultation.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-50">
                          <History className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {consultation.userName} ({consultation.userRole})
                          </p>
                          <p className="text-xs text-gray-500">
                            a consulté le dossier {consultation.dossierId.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                      <time className="text-xs text-gray-500">
                        {formatDate(consultation.timestamp)}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationPage;
