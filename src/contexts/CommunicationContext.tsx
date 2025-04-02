
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  fetchAppels, 
  fetchAppelById, 
  createAppel, 
  updateAppel, 
  deleteAppel 
} from '@/services/appelService';
import { 
  fetchMeetings, 
  fetchMeetingById, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting, 
  addParticipantToMeeting, 
  removeParticipantFromMeeting 
} from '@/services/meetingService';
import { 
  fetchEmails, 
  fetchEmailById, 
  createEmail, 
  updateEmail, 
  deleteEmail, 
  markEmailAsRead, 
  markEmailAsUnread 
} from '@/services/emailService';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Appel, Meeting, Email } from '@/types';

interface CommunicationContextType {
  // Appels
  appels: Appel[];
  fetchingAppels: boolean;
  getAppelById: (id: string) => Promise<Appel | null>;
  addAppel: (appel: Omit<Appel, "id">) => Promise<void>;
  editAppel: (id: string, appel: Partial<Appel>) => Promise<void>;
  removeAppel: (id: string) => Promise<void>;
  // Meetings
  meetings: Meeting[];
  fetchingMeetings: boolean;
  getMeetingById: (id: string) => Promise<Meeting | null>;
  addMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
  editMeeting: (id: string, meeting: Partial<Meeting>) => Promise<void>;
  removeMeeting: (id: string) => Promise<void>;
  addParticipant: (meetingId: string, participantId: string) => Promise<void>;
  removeParticipant: (meetingId: string, participantId: string) => Promise<void>;
  // Emails
  emails: Email[];
  fetchingEmails: boolean;
  getEmailById: (id: string) => Promise<Email | null>;
  addEmail: (email: Omit<Email, "id">) => Promise<void>;
  editEmail: (id: string, email: Partial<Email>) => Promise<void>;
  removeEmail: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  // Filtres
  userAppels: (userId: string) => Appel[];
  userMeetings: (userId: string) => Meeting[];
  userEmails: (userId: string) => Email[];
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [appels, setAppels] = useState<Appel[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  
  const [fetchingAppels, setFetchingAppels] = useState<boolean>(true);
  const [fetchingMeetings, setFetchingMeetings] = useState<boolean>(true);
  const [fetchingEmails, setFetchingEmails] = useState<boolean>(true);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setFetchingAppels(true);
        const appelsData = await fetchAppels();
        setAppels(appelsData);
      } catch (error) {
        console.error("Erreur lors du chargement des appels:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les appels",
          variant: "destructive"
        });
      } finally {
        setFetchingAppels(false);
      }

      try {
        setFetchingMeetings(true);
        const meetingsData = await fetchMeetings();
        setMeetings(meetingsData);
      } catch (error) {
        console.error("Erreur lors du chargement des réunions:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les réunions",
          variant: "destructive"
        });
      } finally {
        setFetchingMeetings(false);
      }

      try {
        setFetchingEmails(true);
        const emailsData = await fetchEmails();
        setEmails(emailsData);
      } catch (error) {
        console.error("Erreur lors du chargement des emails:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les emails",
          variant: "destructive"
        });
      } finally {
        setFetchingEmails(false);
      }
    };

    loadData();
  }, [toast]);

  // Méthodes pour les appels
  const getAppelById = async (id: string): Promise<Appel | null> => {
    try {
      return await fetchAppelById(id);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'appel ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de l'appel",
        variant: "destructive"
      });
      return null;
    }
  };

  const addAppel = async (appel: Omit<Appel, "id">): Promise<void> => {
    try {
      const newAppel = await createAppel(appel);
      if (newAppel) {
        setAppels(prev => [...prev, newAppel]);
        toast({
          title: "Succès",
          description: "Appel créé avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'appel:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'appel",
        variant: "destructive"
      });
    }
  };

  const editAppel = async (id: string, appelUpdates: Partial<Appel>): Promise<void> => {
    try {
      const success = await updateAppel(id, appelUpdates);
      if (success) {
        setAppels(prev => prev.map(appel => 
          appel.id === id ? { ...appel, ...appelUpdates } : appel
        ));
        toast({
          title: "Succès",
          description: "Appel mis à jour avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'appel ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'appel",
        variant: "destructive"
      });
    }
  };

  const removeAppel = async (id: string): Promise<void> => {
    try {
      const success = await deleteAppel(id);
      if (success) {
        setAppels(prev => prev.filter(appel => appel.id !== id));
        toast({
          title: "Succès",
          description: "Appel supprimé avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'appel ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'appel",
        variant: "destructive"
      });
    }
  };

  // Méthodes pour les réunions
  const getMeetingById = async (id: string): Promise<Meeting | null> => {
    try {
      return await fetchMeetingById(id);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la réunion ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la réunion",
        variant: "destructive"
      });
      return null;
    }
  };

  const addMeeting = async (meeting: Omit<Meeting, "id">): Promise<void> => {
    try {
      const newMeeting = await createMeeting(meeting);
      if (newMeeting) {
        setMeetings(prev => [...prev, newMeeting]);
        toast({
          title: "Succès",
          description: "Réunion créée avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réunion:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réunion",
        variant: "destructive"
      });
    }
  };

  const editMeeting = async (id: string, meetingUpdates: Partial<Meeting>): Promise<void> => {
    try {
      const success = await updateMeeting(id, meetingUpdates);
      if (success) {
        setMeetings(prev => prev.map(meeting => 
          meeting.id === id ? { ...meeting, ...meetingUpdates } : meeting
        ));
        toast({
          title: "Succès",
          description: "Réunion mise à jour avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la réunion ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réunion",
        variant: "destructive"
      });
    }
  };

  const removeMeeting = async (id: string): Promise<void> => {
    try {
      const success = await deleteMeeting(id);
      if (success) {
        setMeetings(prev => prev.filter(meeting => meeting.id !== id));
        toast({
          title: "Succès",
          description: "Réunion supprimée avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la réunion ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réunion",
        variant: "destructive"
      });
    }
  };

  const addParticipant = async (meetingId: string, participantId: string): Promise<void> => {
    try {
      const success = await addParticipantToMeeting(meetingId, participantId);
      if (success) {
        setMeetings(prev => prev.map(meeting => {
          if (meeting.id === meetingId) {
            return {
              ...meeting,
              participants: [...meeting.participants, participantId]
            };
          }
          return meeting;
        }));
        toast({
          title: "Succès",
          description: "Participant ajouté avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de l'ajout du participant à la réunion ${meetingId}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le participant",
        variant: "destructive"
      });
    }
  };

  const removeParticipant = async (meetingId: string, participantId: string): Promise<void> => {
    try {
      const success = await removeParticipantFromMeeting(meetingId, participantId);
      if (success) {
        setMeetings(prev => prev.map(meeting => {
          if (meeting.id === meetingId) {
            return {
              ...meeting,
              participants: meeting.participants.filter(id => id !== participantId)
            };
          }
          return meeting;
        }));
        toast({
          title: "Succès",
          description: "Participant retiré avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors du retrait du participant de la réunion ${meetingId}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le participant",
        variant: "destructive"
      });
    }
  };

  // Méthodes pour les emails
  const getEmailById = async (id: string): Promise<Email | null> => {
    try {
      return await fetchEmailById(id);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'email ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de l'email",
        variant: "destructive"
      });
      return null;
    }
  };

  const addEmail = async (email: Omit<Email, "id">): Promise<void> => {
    try {
      const newEmail = await createEmail(email);
      if (newEmail) {
        setEmails(prev => [...prev, newEmail]);
        toast({
          title: "Succès",
          description: "Email envoyé avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email",
        variant: "destructive"
      });
    }
  };

  const editEmail = async (id: string, emailUpdates: Partial<Email>): Promise<void> => {
    try {
      const success = await updateEmail(id, emailUpdates);
      if (success) {
        setEmails(prev => prev.map(email => 
          email.id === id ? { ...email, ...emailUpdates } : email
        ));
        toast({
          title: "Succès",
          description: "Email mis à jour avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'email ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'email",
        variant: "destructive"
      });
    }
  };

  const removeEmail = async (id: string): Promise<void> => {
    try {
      const success = await deleteEmail(id);
      if (success) {
        setEmails(prev => prev.filter(email => email.id !== id));
        toast({
          title: "Succès",
          description: "Email supprimé avec succès",
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'email ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'email",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const success = await markEmailAsRead(id);
      if (success) {
        setEmails(prev => prev.map(email => 
          email.id === id ? { ...email, lu: true } : email
        ));
      }
    } catch (error) {
      console.error(`Erreur lors du marquage de l'email ${id} comme lu:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer l'email comme lu",
        variant: "destructive"
      });
    }
  };

  const markAsUnread = async (id: string): Promise<void> => {
    try {
      const success = await markEmailAsUnread(id);
      if (success) {
        setEmails(prev => prev.map(email => 
          email.id === id ? { ...email, lu: false } : email
        ));
      }
    } catch (error) {
      console.error(`Erreur lors du marquage de l'email ${id} comme non lu:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer l'email comme non lu",
        variant: "destructive"
      });
    }
  };

  // Méthodes de filtrage
  const userAppels = (userId: string): Appel[] => {
    return appels.filter(
      appel => appel.clientId === userId || appel.agentId === userId
    );
  };

  const userMeetings = (userId: string): Meeting[] => {
    return meetings.filter(
      meeting => meeting.participants.includes(userId)
    );
  };

  const userEmails = (userId: string): Email[] => {
    return emails.filter(
      email => 
        email.expediteurId === userId || 
        email.destinataireIds.includes(userId) ||
        (email.destinatairesCc && email.destinatairesCc.includes(userId)) ||
        (email.destinatairesBcc && email.destinatairesBcc.includes(userId))
    );
  };

  const value = {
    // Appels
    appels,
    fetchingAppels,
    getAppelById,
    addAppel,
    editAppel,
    removeAppel,
    // Meetings
    meetings,
    fetchingMeetings,
    getMeetingById,
    addMeeting,
    editMeeting,
    removeMeeting,
    addParticipant,
    removeParticipant,
    // Emails
    emails,
    fetchingEmails,
    getEmailById,
    addEmail,
    editEmail,
    removeEmail,
    markAsRead,
    markAsUnread,
    // Filtres
    userAppels,
    userMeetings,
    userEmails
  };

  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication doit être utilisé à l'intérieur d'un CommunicationProvider');
  }
  return context;
};
