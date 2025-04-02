
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Agent {
  id: string;
  nom: string;
  prenom: string;
}

interface AgentSelectorsProps {
  phonerAgents: Agent[];
  visioAgents: Agent[];
  selectedAgentPhoner: string;
  selectedAgentVisio: string;
  onPhonerChange: (agentId: string) => void;
  onVisioChange: (agentId: string) => void;
  isPhonerDisabled?: boolean;
}

const AgentSelectors: React.FC<AgentSelectorsProps> = ({
  selectedAgentPhoner,
  selectedAgentVisio,
  onPhonerChange,
  onVisioChange,
  isPhonerDisabled = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [phonerAgents, setPhonerAgents] = useState<Agent[]>([]);
  const [visioAgents, setVisioAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        
        // Fetch phoner agents
        const { data: phonerData, error: phonerError } = await supabase
          .from('profiles')
          .select('id, nom, prenom')
          .eq('role', 'agent_phoner');
        
        if (phonerError) throw phonerError;
        setPhonerAgents(phonerData || []);
        
        // Fetch visio agents
        const { data: visioData, error: visioError } = await supabase
          .from('profiles')
          .select('id, nom, prenom')
          .eq('role', 'agent_visio');
        
        if (visioError) throw visioError;
        setVisioAgents(visioData || []);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Agent Phoner</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label>Agent Visio</Label>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="agent_phoner">Agent Phoner</Label>
        <Select 
          disabled={isPhonerDisabled} 
          value={selectedAgentPhoner} 
          onValueChange={onPhonerChange}
        >
          <SelectTrigger id="agent_phoner">
            <SelectValue placeholder="Sélectionner un agent phoner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            {phonerAgents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.prenom} {agent.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="agent_visio">Agent Visio</Label>
        <Select 
          value={selectedAgentVisio} 
          onValueChange={onVisioChange}
        >
          <SelectTrigger id="agent_visio">
            <SelectValue placeholder="Sélectionner un agent visio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            {visioAgents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.prenom} {agent.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgentSelectors;
