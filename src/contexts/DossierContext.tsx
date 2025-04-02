
import React, { createContext, useContext, useState, useEffect } from "react";
import { Dossier, DossierStatus, Offre, RendezVous } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchDossiers, 
  fetchDossierById, 
  createDossier, 
  updateDossier as updateDossierService, 
  deleteDossier as deleteDossierService 
} from "@/services/dossierService";
import { 
  fetchRendezVousByDossier, 
  createRendezVous as createRendezVousService, 
  updateRendezVous as updateRendezVousService, 
  deleteRendezVous as deleteRendezVousService 
} from "@/services/rendezVousService";

interface DossierContextType {
  dossiers: Dossier[];
  rendezVous: RendezVous[];
  filteredDossiers: Dossier[];
  currentDossier: Dossier | null;
  statusFilter: DossierStatus | 'all';
  isLoading: boolean;
  error: Error | null;
  addDossier: (dossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour">) => Promise<Dossier | null>;
  updateDossier: (id: string, updates: Partial<Dossier>) => Promise<boolean>;
  deleteDossier: (id: string) => Promise<boolean>;
  getDossierById: (id: string) => Promise<Dossier | null>;
  setStatusFilter: (status: DossierStatus | 'all') => void;
  setCurrentDossier: (dossier: Dossier | null) => void;
  getRendezVousByDossierId: (dossierId: string) => Promise<RendezVous[]>;
  addRendezVous: (rendezVous: Omit<RendezVous, "id">) => Promise<RendezVous | null>;
  updateRendezVous: (id: string, updates: Partial<RendezVous>) => Promise<boolean>;
  deleteRendezVous: (id: string) => Promise<boolean>;
  updateDossierStatus: (dossierId: string, newStatus: DossierStatus) => Promise<boolean>;
  refreshDossiers: () => Promise<void>;
}

const DossierContext = createContext<DossierContextType | undefined>(undefined);

export const DossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [statusFilter, setStatusFilter] = useState<DossierStatus | 'all'>('all');
  const [currentDossier, setCurrentDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initial data loading
  useEffect(() => {
    loadDossiers();
  }, [user]);

  const loadDossiers = async () => {
    if (!user) {
      setDossiers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchDossiers();
      setDossiers(data);
      setError(null);
    } catch (err) {
      console.error("Error loading dossiers:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: "Erreur",
        description: "Impossible de charger les dossiers. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDossiers = async () => {
    await loadDossiers();
  };

  const filteredDossiers = React.useMemo(() => {
    let filtered = [...dossiers];
    
    // Filtrer par statut si un filtre est appliqué
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    
    // Filtrer selon le rôle de l'utilisateur
    if (user) {
      switch (user.role) {
        case 'agent_phoner':
          // Les agents phoner voient les dossiers qui leur sont assignés
          filtered = filtered.filter(d => 
            d.agentPhonerId === user.id && 
            d.status !== 'archive' // Les dossiers archivés ne sont pas visibles pour les agents
          );
          break;
          
        case 'agent_visio':
          // Les agents visio voient les dossiers qui leur sont assignés
          filtered = filtered.filter(d => 
            d.agentVisioId === user.id && 
            d.status !== 'archive' // Les dossiers archivés ne sont pas visibles pour les agents
          );
          break;
          
        case 'superviseur':
          // Les superviseurs voient tous les dossiers sauf les montants
          // Pas de filtrage spécifique ici
          break;
          
        case 'responsable':
          // Les responsables voient tout
          // Pas de filtrage
          break;
          
        case 'client':
          // Les clients ne voient que leurs propres dossiers
          filtered = filtered.filter(d => d.clientId === user.id);
          break;
      }
    }
    
    return filtered;
  }, [dossiers, statusFilter, user]);

  const addDossier = async (newDossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour">) => {
    try {
      const dossier = await createDossier(newDossier);
      
      if (dossier) {
        setDossiers(prev => [...prev, dossier]);
        toast({
          title: "Dossier créé",
          description: `Le dossier a été créé avec succès`,
        });
        return dossier;
      }
      
      throw new Error("Erreur lors de la création du dossier");
    } catch (error) {
      console.error("Error creating dossier:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le dossier. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDossier = async (id: string, updates: Partial<Dossier>) => {
    try {
      const success = await updateDossierService(id, updates);
      
      if (success) {
        // Update local state
        setDossiers(prev => 
          prev.map(dossier => 
            dossier.id === id 
              ? { ...dossier, ...updates } 
              : dossier
          )
        );
        
        // Update current dossier if it's the one being updated
        if (currentDossier && currentDossier.id === id) {
          setCurrentDossier({ ...currentDossier, ...updates });
        }
        
        toast({
          title: "Dossier mis à jour",
          description: `Le dossier a été mis à jour avec succès`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error updating dossier ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le dossier. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDossier = async (id: string) => {
    try {
      const success = await deleteDossierService(id);
      
      if (success) {
        setDossiers(prev => prev.filter(dossier => dossier.id !== id));
        setRendezVous(prev => prev.filter(rdv => rdv.dossierId !== id));
        
        toast({
          title: "Dossier supprimé",
          description: `Le dossier a été supprimé avec succès`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting dossier ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le dossier. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getDossierById = async (id: string) => {
    try {
      // First, check local cache
      let dossier = dossiers.find(d => d.id === id);
      
      if (!dossier) {
        // If not in cache, fetch from server
        dossier = await fetchDossierById(id);
        
        if (dossier) {
          // Update local cache
          setDossiers(prev => {
            const exists = prev.some(d => d.id === dossier?.id);
            return exists 
              ? prev.map(d => d.id === dossier?.id ? dossier! : d) 
              : [...prev, dossier!];
          });
        }
      }
      
      return dossier;
    } catch (error) {
      console.error(`Error fetching dossier ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du dossier. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    }
  };

  const getRendezVousByDossierId = async (dossierId: string) => {
    try {
      const rdvs = await fetchRendezVousByDossier(dossierId);
      setRendezVous(prev => {
        // Remove existing RDVs for this dossier
        const filtered = prev.filter(r => r.dossierId !== dossierId);
        // Add the fetched ones
        return [...filtered, ...rdvs];
      });
      return rdvs;
    } catch (error) {
      console.error(`Error fetching rendez-vous for dossier ${dossierId}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
      return [];
    }
  };

  const addRendezVous = async (newRendezVous: Omit<RendezVous, "id">) => {
    try {
      const rdv = await createRendezVousService(newRendezVous);
      
      if (rdv) {
        setRendezVous(prev => [...prev, rdv]);
        
        // Update the dossier status if needed
        if (newRendezVous.dossier.status !== 'rdv_en_cours') {
          await updateDossierStatus(newRendezVous.dossierId, 'rdv_en_cours');
        }
        
        toast({
          title: "Rendez-vous créé",
          description: `Le rendez-vous a été créé avec succès`,
        });
        
        return rdv;
      }
      
      throw new Error("Erreur lors de la création du rendez-vous");
    } catch (error) {
      console.error("Error creating rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateRendezVous = async (id: string, updates: Partial<RendezVous>) => {
    try {
      const success = await updateRendezVousService(id, updates);
      
      if (success) {
        setRendezVous(prev => 
          prev.map(rdv => 
            rdv.id === id 
              ? { ...rdv, ...updates } 
              : rdv
          )
        );
        
        toast({
          title: "Rendez-vous mis à jour",
          description: `Le rendez-vous a été mis à jour avec succès`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error updating rendez-vous ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteRendezVous = async (id: string) => {
    try {
      const success = await deleteRendezVousService(id);
      
      if (success) {
        setRendezVous(prev => prev.filter(rdv => rdv.id !== id));
        
        toast({
          title: "Rendez-vous supprimé",
          description: `Le rendez-vous a été supprimé avec succès`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting rendez-vous ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDossierStatus = async (dossierId: string, newStatus: DossierStatus) => {
    try {
      const dossier = dossiers.find(d => d.id === dossierId);
      if (!dossier) return false;
      
      const updates: Partial<Dossier> = { status: newStatus };
      
      // Mettre à jour les dates en fonction du nouveau statut
      const now = new Date();
      
      switch (newStatus) {
        case 'rdv_en_cours':
          updates.dateRdv = now;
          break;
        case 'valide':
          updates.dateValidation = now;
          break;
        case 'signe':
          updates.dateSignature = now;
          break;
        case 'archive':
          updates.dateArchivage = now;
          break;
      }
      
      const success = await updateDossier(dossierId, updates);
      
      if (success) {
        toast({
          title: "Statut mis à jour",
          description: `Le statut du dossier a été mis à jour en "${newStatus}"`,
        });
      }
      
      return success;
    } catch (error) {
      console.error(`Error updating dossier status ${dossierId}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du dossier. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <DossierContext.Provider value={{
      dossiers,
      rendezVous,
      filteredDossiers,
      currentDossier,
      statusFilter,
      isLoading,
      error,
      addDossier,
      updateDossier,
      deleteDossier,
      getDossierById,
      setStatusFilter,
      setCurrentDossier,
      getRendezVousByDossierId,
      addRendezVous,
      updateRendezVous,
      deleteRendezVous,
      updateDossierStatus,
      refreshDossiers
    }}>
      {children}
    </DossierContext.Provider>
  );
};

export const useDossier = () => {
  const context = useContext(DossierContext);
  if (context === undefined) {
    throw new Error("useDossier must be used within a DossierProvider");
  }
  return context;
};
