
import { Dossier } from '@/types';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/realm';

export const useDossierFormSubmit = (
  isEdit: boolean,
  dossierId?: string
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData: Omit<Dossier, 'id'>) => {
    try {
      const realmUser = getCurrentUser();
      if (!realmUser) {
        throw new Error("Utilisateur Realm non connecté");
      }
      
      const dossiersCollection = realmUser.mongoClient("mongodb-atlas").db("inuma").collection("dossiers");
      
      if (isEdit && dossierId) {
        // Mettre à jour un dossier existant
        await dossiersCollection.updateOne(
          { _id: dossierId },
          { $set: {
            clientId: formData.clientId,
            agentPhonerId: formData.agentPhonerId,
            agentVisioId: formData.agentVisioId,
            statut: formData.statut,
            dateModification: new Date(),
            notes: formData.notes,
            montant: formData.montant,
            offres: formData.offres
          }}
        );
        
        toast({
          title: "Dossier mis à jour",
          description: "Le dossier a été modifié avec succès"
        });
      } else {
        // Créer un nouveau dossier
        const result = await dossiersCollection.insertOne({
          clientId: formData.clientId,
          agentPhonerId: formData.agentPhonerId,
          agentVisioId: formData.agentVisioId,
          statut: formData.statut,
          dateCreation: new Date(),
          dateModification: new Date(),
          notes: formData.notes,
          montant: formData.montant,
          offres: formData.offres
        });
        
        toast({
          title: "Dossier créé",
          description: "Le dossier a été créé avec succès"
        });
        
        // Rediriger vers la page du dossier nouvellement créé
        navigate(`/dossiers/${result.insertedId}`);
        return;
      }
      
      // Rediriger vers la page du dossier
      navigate(`/dossiers/${dossierId}`);
    } catch (error) {
      console.error('Erreur lors de la soumission du dossier:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du dossier"
      });
    }
  };

  return { handleSubmit };
};
