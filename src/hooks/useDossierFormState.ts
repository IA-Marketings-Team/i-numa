
import { useState, useEffect } from 'react';
import { Dossier, Offre } from '@/types';
import { getCurrentUser } from '@/lib/realm';

// État initial pour un nouveau dossier
const initialState: Omit<Dossier, 'id'> = {
  clientId: '',
  agentPhonerId: '',
  agentVisioId: null,
  statut: 'nouveau',
  dateCreation: new Date(),
  dateModification: new Date(),
  notes: '',
  montant: 0,
  offres: []
};

export const useDossierFormState = (dossier?: Dossier) => {
  const [formState, setFormState] = useState<Omit<Dossier, 'id'>>(
    dossier ? {
      clientId: dossier.clientId,
      agentPhonerId: dossier.agentPhonerId,
      agentVisioId: dossier.agentVisioId,
      statut: dossier.statut,
      dateCreation: dossier.dateCreation,
      dateModification: new Date(), // Toujours mettre à jour la date de modification
      notes: dossier.notes,
      montant: dossier.montant,
      offres: dossier.offres
    } : initialState
  );

  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const realmUser = getCurrentUser();
        if (!realmUser) {
          console.error("Utilisateur Realm non connecté");
          return;
        }
        
        const agentsCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("users");
        const result = await agentsCollection.find({
          role: { $in: ['agent_phoner', 'agent_visio'] }
        });
        
        setAgents(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  const updateField = <K extends keyof Omit<Dossier, 'id'>>(
    field: K,
    value: Omit<Dossier, 'id'>[K]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      dateModification: new Date() // Mettre à jour la date de modification
    }));
  };

  const addOffre = (offre: Offre) => {
    // Vérifier si l'offre existe déjà
    if (!formState.offres.some(o => o.id === offre.id)) {
      setFormState(prev => ({
        ...prev,
        offres: [...prev.offres, offre],
        dateModification: new Date()
      }));
    }
  };

  const removeOffre = (offreId: string) => {
    setFormState(prev => ({
      ...prev,
      offres: prev.offres.filter(o => o.id !== offreId),
      dateModification: new Date()
    }));
  };

  return {
    formState,
    updateField,
    addOffre,
    removeOffre,
    agents,
    isLoading
  };
};
