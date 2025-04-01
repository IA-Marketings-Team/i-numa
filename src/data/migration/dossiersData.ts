
import { dossiers } from "../mock/dossiers";
import { createDossier } from "@/services/supabase/dossiersService";
import { getAllClients } from "@/services/supabase/clientsService";
import { getAllAgents } from "@/services/supabase/agentsService";
import { getAllOffres } from "@/services/supabase/offresService";

export const migrateDossiers = async () => {
  console.log("Migration des dossiers...");
  
  // Récupérer les clients, agents et offres depuis Supabase
  const clients = await getAllClients();
  const agents = await getAllAgents();
  const offres = await getAllOffres();
  
  if (clients.length === 0 || agents.length === 0 || offres.length === 0) {
    console.error("Impossible de migrer les dossiers : données manquantes");
    return;
  }
  
  for (const dossier of dossiers) {
    try {
      // Trouver les correspondances dans Supabase
      const client = clients.find(c => c.email === dossier.client.email);
      if (!client) {
        console.error(`Client non trouvé pour le dossier: ${dossier.id}`);
        continue;
      }
      
      let agentPhoner = undefined;
      if (dossier.agentPhonerId) {
        agentPhoner = agents.find(a => a.email === agents.find(a => a.id === dossier.agentPhonerId)?.email)?.id;
      }
      
      let agentVisio = undefined;
      if (dossier.agentVisioId) {
        agentVisio = agents.find(a => a.email === agents.find(a => a.id === dossier.agentVisioId)?.email)?.id;
      }
      
      const dossierOffres = dossier.offres.map(o => {
        const offreMatch = offres.find(of => of.nom === o.nom);
        if (!offreMatch) {
          console.error(`Offre non trouvée: ${o.nom}`);
        }
        return offreMatch || o;
      });
      
      await createDossier({
        clientId: client.id,
        agentPhonerId: agentPhoner,
        agentVisioId: agentVisio,
        status: dossier.status,
        offres: dossierOffres,
        dateRdv: dossier.dateRdv,
        dateValidation: dossier.dateValidation,
        dateSignature: dossier.dateSignature,
        dateArchivage: dossier.dateArchivage,
        notes: dossier.notes,
        montant: dossier.montant
      });
      
      console.log(`Dossier migré: ${dossier.id}`);
    } catch (error) {
      console.error(`Erreur lors de la migration du dossier ${dossier.id}:`, error);
    }
  }
  
  console.log("Migration des dossiers terminée.");
};
