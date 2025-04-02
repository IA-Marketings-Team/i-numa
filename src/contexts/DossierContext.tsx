
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dossier, RendezVous } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/realm';

interface DossierContextType {
  dossiers: Dossier[];
  rendezVous: RendezVous[];
  isLoading: boolean;
  fetchDossiers: () => Promise<Dossier[]>;
  fetchDossierById: (id: string) => Promise<Dossier | null>;
  fetchRendezVousByDossierId: (dossierId: string) => Promise<RendezVous[]>;
}

const DossierContext = createContext<DossierContextType>({
  dossiers: [],
  rendezVous: [],
  isLoading: false,
  fetchDossiers: async () => [],
  fetchDossierById: async () => null,
  fetchRendezVousByDossierId: async () => [],
});

export const DossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Chargement initial des dossiers
    fetchDossiers();
  }, []);

  const fetchDossiers = async (): Promise<Dossier[]> => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Pas de token d'authentification disponible");
      }

      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }

      const dossiersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("dossiers");
      const result = await dossiersCollection.find({});
      
      const dossiersData = result.map((doc: any) => ({
        id: doc._id.toString(),
        clientId: doc.clientId,
        agentPhonerId: doc.agentPhonerId,
        agentVisioId: doc.agentVisioId || null,
        statut: doc.statut,
        dateCreation: new Date(doc.dateCreation),
        dateModification: new Date(doc.dateModification),
        notes: doc.notes || '',
        montant: doc.montant || 0,
        offres: doc.offres || []
      }));
      
      setDossiers(dossiersData);
      return dossiersData;
    } catch (error) {
      console.error("Erreur lors de la récupération des dossiers:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les dossiers",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDossierById = async (id: string): Promise<Dossier | null> => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Pas de token d'authentification disponible");
      }

      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }

      const dossiersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("dossiers");
      const dossier = await dossiersCollection.findOne({ _id: id });
      
      if (!dossier) {
        return null;
      }
      
      return {
        id: dossier._id.toString(),
        clientId: dossier.clientId,
        agentPhonerId: dossier.agentPhonerId,
        agentVisioId: dossier.agentVisioId || null,
        statut: dossier.statut,
        dateCreation: new Date(dossier.dateCreation),
        dateModification: new Date(dossier.dateModification),
        notes: dossier.notes || '',
        montant: dossier.montant || 0,
        offres: dossier.offres || []
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du dossier ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger le dossier",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRendezVousByDossierId = async (dossierId: string): Promise<RendezVous[]> => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Pas de token d'authentification disponible");
      }

      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }

      const rendezVousCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("rendezVous");
      const result = await rendezVousCollection.find({ dossierId });
      
      const rendezVousData = result.map((doc: any) => ({
        id: doc._id.toString(),
        dossierId: doc.dossierId,
        date: new Date(doc.date),
        duree: doc.duree,
        statut: doc.statut,
        notes: doc.notes || '',
        type: doc.type
      }));
      
      setRendezVous(prevRDV => {
        // Filtrer les anciens rendez-vous du même dossier
        const filteredRDV = prevRDV.filter(rdv => rdv.dossierId !== dossierId);
        // Ajouter les nouveaux rendez-vous
        return [...filteredRDV, ...rendezVousData];
      });
      
      return rendezVousData;
    } catch (error) {
      console.error(`Erreur lors de la récupération des rendez-vous pour le dossier ${dossierId}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DossierContext.Provider
      value={{
        dossiers,
        rendezVous,
        isLoading,
        fetchDossiers,
        fetchDossierById,
        fetchRendezVousByDossierId,
      }}
    >
      {children}
    </DossierContext.Provider>
  );
};

export const useDossier = () => useContext(DossierContext);
