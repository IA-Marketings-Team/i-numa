
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AgentForm from "@/components/agents/AgentForm";
import { z } from "zod";
import { Agent } from "@/types/agent";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentAdded: (agent: Agent) => void;
}

// Schema pour le formulaire agent
const agentFormSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  role: z.enum(["agent_phoner", "agent_visio", "agent_developpeur", "agent_marketing"]),
  equipeId: z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

const AddAgentDialog: React.FC<AddAgentDialogProps> = ({ 
  open, 
  onOpenChange,
  onAgentAdded 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (data: AgentFormValues) => {
    try {
      // Inviter l'agent via l'API Supabase avec un email
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(data.email, {
        redirectTo: `${window.location.origin}/connexion`,
        data: {
          prenom: data.prenom,
          nom: data.nom,
          role: data.role,
        }
      });

      if (inviteError) {
        console.error("Erreur lors de l'invitation:", inviteError);
        throw new Error(inviteError.message);
      }

      // Créer l'agent dans la table profiles avec les statistiques initiales
      const newAgent: Partial<Agent> = {
        id: inviteData?.user?.id,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        role: data.role,
        equipeId: data.equipeId,
        statistiques: {
          appelsEmis: 0,
          appelsDecroches: 0,
          appelsTransformes: 0,
          rendezVousHonores: 0,
          rendezVousNonHonores: 0,
          dossiersValides: 0,
          dossiersSigne: 0
        }
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          role: data.role,
          equipe_id: data.equipeId
        })
        .eq('id', inviteData?.user?.id);

      if (profileError) {
        console.error("Erreur lors de la création du profil agent:", profileError);
        throw new Error(profileError.message);
      }

      // Appel au callback avec le nouvel agent
      onAgentAdded(newAgent as Agent);
      
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'agent:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout de l'agent.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel agent</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouvel agent à votre équipe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <AgentForm
            teams={[]} // Nous n'avons pas besoin d'équipes pour l'instant
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAgentDialog;
