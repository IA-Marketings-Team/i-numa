
import React, { createContext, useContext, useState, useEffect } from "react";
import { Dossier, DossierStatus, Offre, RendezVous } from "@/types";
import { dossiers as mockDossiers, rendezVous as mockRendezVous } from "@/data/mockData";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DossierContextType {
  dossiers: Dossier[];
  rendezVous: RendezVous[];
  filteredDossiers: Dossier[];
  currentDossier: Dossier | null;
  statusFilter: DossierStatus | 'all';
  addDossier: (dossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour">) => void;
  updateDossier: (id: string, updates: Partial<Dossier>) => void;
  deleteDossier: (id: string) => void;
  getDossierById: (id: string) => Dossier | undefined;
  setStatusFilter: (status: DossierStatus | 'all') => void;
  setCurrentDossier: (dossier: Dossier | null) => void;
  getRendezVousByDossierId: (dossierId: string) => RendezVous[];
  addRendezVous: (rendezVous: Omit<RendezVous, "id">) => void;
  updateRendezVous: (id: string, updates: Partial<RendezVous>) => void;
  deleteRendezVous: (id: string) => void;
  updateDossierStatus: (dossierId: string, newStatus: DossierStatus) => void;
}

const DossierContext = createContext<DossierContextType | undefined>(undefined);

export const DossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>(mockDossiers);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>(mockRendezVous);
  const [statusFilter, setStatusFilter] = useState<DossierStatus | 'all'>('all');
  const [currentDossier, setCurrentDossier] = useState<Dossier | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const addDossier = (newDossier: Omit<Dossier, "id" | "dateCreation" | "dateMiseAJour">) => {
    const dossier: Dossier = {
      ...newDossier,
      id: `dossier${dossiers.length + 1}`,
      dateCreation: new Date(),
      dateMiseAJour: new Date(),
    };
    
    setDossiers(prev => [...prev, dossier]);
    toast({
      title: "Dossier créé",
      description: `Le dossier a été créé avec succès`,
    });
  };

  const updateDossier = (id: string, updates: Partial<Dossier>) => {
    setDossiers(prev => 
      prev.map(dossier => 
        dossier.id === id 
          ? { ...dossier, ...updates, dateMiseAJour: new Date() } 
          : dossier
      )
    );
    toast({
      title: "Dossier mis à jour",
      description: `Le dossier a été mis à jour avec succès`,
    });
  };

  const deleteDossier = (id: string) => {
    setDossiers(prev => prev.filter(dossier => dossier.id !== id));
    setRendezVous(prev => prev.filter(rdv => rdv.dossierId !== id));
    toast({
      title: "Dossier supprimé",
      description: `Le dossier a été supprimé avec succès`,
    });
  };

  const getDossierById = (id: string) => {
    return dossiers.find(dossier => dossier.id === id);
  };

  const getRendezVousByDossierId = (dossierId: string) => {
    return rendezVous.filter(rdv => rdv.dossierId === dossierId);
  };

  const addRendezVous = (newRendezVous: Omit<RendezVous, "id">) => {
    const rdv: RendezVous = {
      ...newRendezVous,
      id: `rdv${rendezVous.length + 1}`,
    };
    
    setRendezVous(prev => [...prev, rdv]);
    toast({
      title: "Rendez-vous créé",
      description: `Le rendez-vous a été créé avec succès`,
    });
  };

  const updateRendezVous = (id: string, updates: Partial<RendezVous>) => {
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
  };

  const deleteRendezVous = (id: string) => {
    setRendezVous(prev => prev.filter(rdv => rdv.id !== id));
    toast({
      title: "Rendez-vous supprimé",
      description: `Le rendez-vous a été supprimé avec succès`,
    });
  };

  const updateDossierStatus = (dossierId: string, newStatus: DossierStatus) => {
    const dossier = getDossierById(dossierId);
    if (!dossier) return;
    
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
    
    updateDossier(dossierId, updates);
    toast({
      title: "Statut mis à jour",
      description: `Le statut du dossier a été mis à jour en "${newStatus}"`,
    });
  };

  return (
    <DossierContext.Provider value={{
      dossiers,
      rendezVous,
      filteredDossiers,
      currentDossier,
      statusFilter,
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
