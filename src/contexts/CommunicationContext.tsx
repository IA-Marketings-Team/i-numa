
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createAppel, 
  deleteAppel, 
  fetchAppels, 
  fetchAppelById, 
  updateAppel 
} from '@/services/appelService';
import { 
  createEmail, 
  deleteEmail, 
  fetchEmails, 
  fetchEmailById, 
  updateEmail 
} from '@/services/emailService';
import { 
  createMeeting, 
  deleteMeeting, 
  fetchMeetings, 
  fetchMeetingById, 
  updateMeeting 
} from '@/services/meetingService';
import { Appel, Meeting, Email } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunicationContextType {
  appels: Appel[];
  meetings: Meeting[];
  emails: Email[];
  loading: boolean;
  fetchingEmails: boolean;
  fetchingMeetings: boolean;
  fetchAppels: () => Promise<void>;
  getAppelById: (id: string) => Promise<Appel | null>;
  addAppel: (appel: Omit<Appel, "id">) => Promise<Appel | null>;
  editAppel: (id: string, updates: Partial<Appel>) => Promise<boolean>;
  removeAppel: (id: string) => Promise<boolean>;
  fetchMeetings: () => Promise<void>;
  getMeetingById: (id: string) => Promise<Meeting | null>;
  addMeeting: (meeting: Omit<Meeting, "id">) => Promise<Meeting | null>;
  editMeeting: (id: string, updates: Partial<Meeting>) => Promise<boolean>;
  removeMeeting: (id: string) => Promise<boolean>;
  fetchEmails: () => Promise<void>;
  getEmailById: (id: string) => Promise<Email | null>;
  addEmail: (email: Omit<Email, "id">) => Promise<Email | null>;
  editEmail: (id: string, updates: Partial<Email>) => Promise<boolean>;
  removeEmail: (id: string) => Promise<boolean>;
  markAsRead: (id: string) => Promise<boolean>;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appels, setAppels] = useState<Appel[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingEmails, setFetchingEmails] = useState(false);
  const [fetchingMeetings, setFetchingMeetings] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAndSetAppels(),
          fetchAndSetMeetings(),
          fetchAndSetEmails()
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données de communication:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données de communication."
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const fetchAndSetAppels = async () => {
    try {
      const data = await fetchAppels();
      setAppels(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des appels:", error);
      throw error;
    }
  };

  const fetchAndSetMeetings = async () => {
    try {
      setFetchingMeetings(true);
      const data = await fetchMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réunions:", error);
      throw error;
    } finally {
      setFetchingMeetings(false);
    }
  };

  const fetchAndSetEmails = async () => {
    try {
      setFetchingEmails(true);
      const data = await fetchEmails();
      setEmails(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des emails:", error);
      throw error;
    } finally {
      setFetchingEmails(false);
    }
  };

  // Méthodes pour les appels
  const getAppelById = async (id: string) => {
    return await fetchAppelById(id);
  };

  const addAppel = async (appel: Omit<Appel, "id">) => {
    const newAppel = await createAppel(appel);
    if (newAppel) {
      setAppels([...appels, newAppel]);
    }
    return newAppel;
  };

  const editAppel = async (id: string, updates: Partial<Appel>) => {
    const success = await updateAppel(id, updates);
    if (success) {
      setAppels(appels.map(a => a.id === id ? { ...a, ...updates } : a));
    }
    return success;
  };

  const removeAppel = async (id: string) => {
    const success = await deleteAppel(id);
    if (success) {
      setAppels(appels.filter(a => a.id !== id));
    }
    return success;
  };

  // Méthodes pour les réunions
  const getMeetingById = async (id: string) => {
    return await fetchMeetingById(id);
  };

  const addMeeting = async (meeting: Omit<Meeting, "id">) => {
    const newMeeting = await createMeeting(meeting);
    if (newMeeting) {
      setMeetings([...meetings, newMeeting]);
    }
    return newMeeting;
  };

  const editMeeting = async (id: string, updates: Partial<Meeting>) => {
    const success = await updateMeeting(id, updates);
    if (success) {
      setMeetings(meetings.map(m => m.id === id ? { ...m, ...updates } : m));
    }
    return success;
  };

  const removeMeeting = async (id: string) => {
    const success = await deleteMeeting(id);
    if (success) {
      setMeetings(meetings.filter(m => m.id !== id));
    }
    return success;
  };

  // Méthodes pour les emails
  const getEmailById = async (id: string) => {
    return await fetchEmailById(id);
  };

  const addEmail = async (email: Omit<Email, "id">) => {
    const newEmail = await createEmail(email);
    if (newEmail) {
      setEmails([...emails, newEmail]);
    }
    return newEmail;
  };

  const editEmail = async (id: string, updates: Partial<Email>) => {
    const success = await updateEmail(id, updates);
    if (success) {
      setEmails(emails.map(e => e.id === id ? { ...e, ...updates } : e));
    }
    return success;
  };

  const removeEmail = async (id: string) => {
    const success = await deleteEmail(id);
    if (success) {
      setEmails(emails.filter(e => e.id !== id));
    }
    return success;
  };

  const markAsRead = async (id: string) => {
    const success = await updateEmail(id, { lu: true });
    if (success) {
      setEmails(emails.map(e => e.id === id ? { ...e, lu: true } : e));
    }
    return success;
  };

  // Now we need to modify our context value to match the CommunicationContextType
  const value: CommunicationContextType = {
    appels,
    meetings,
    emails,
    loading,
    fetchingEmails,
    fetchingMeetings,
    fetchAppels: async () => { await fetchAndSetAppels(); },
    getAppelById,
    addAppel,
    editAppel,
    removeAppel,
    fetchMeetings: async () => { await fetchAndSetMeetings(); },
    getMeetingById,
    addMeeting,
    editMeeting,
    removeMeeting,
    fetchEmails: async () => { await fetchAndSetEmails(); },
    getEmailById,
    addEmail,
    editEmail,
    removeEmail,
    markAsRead
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
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};
