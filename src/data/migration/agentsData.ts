
import { agents } from "../mock/agents";
import { createAgent } from "@/services/supabase/agentsService";

export const migrateAgents = async () => {
  console.log("Migration des agents...");
  
  for (const agent of agents) {
    try {
      await createAgent({
        nom: agent.nom,
        prenom: agent.prenom,
        email: agent.email,
        telephone: agent.telephone,
        role: agent.role,
        adresse: agent.adresse,
        ville: agent.ville,
        codePostal: agent.codePostal,
        iban: agent.iban,
        bic: agent.bic,
        nomBanque: agent.nomBanque,
        equipeId: agent.equipeId
      });
      console.log(`Agent migré: ${agent.prenom} ${agent.nom}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de l'agent ${agent.prenom} ${agent.nom}:`, error);
    }
  }
  
  console.log("Migration des agents terminée.");
};
