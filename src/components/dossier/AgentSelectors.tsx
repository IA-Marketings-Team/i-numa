
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Agent } from "@/types";

interface AgentSelectorsProps {
  phonerAgents: Agent[];
  visioAgents: Agent[];
  selectedAgentPhoner: string;
  selectedAgentVisio: string;
  onPhonerChange: (value: string) => void;
  onVisioChange: (value: string) => void;
  isPhonerDisabled?: boolean;
}

const AgentSelectors: React.FC<AgentSelectorsProps> = ({
  phonerAgents,
  visioAgents,
  selectedAgentPhoner,
  selectedAgentVisio,
  onPhonerChange,
  onVisioChange,
  isPhonerDisabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="agentPhoner">Agent Phoner</Label>
        <Select
          value={selectedAgentPhoner}
          onValueChange={onPhonerChange}
          disabled={isPhonerDisabled}
        >
          <SelectTrigger id="agentPhoner">
            <SelectValue placeholder="Sélectionner un agent phoner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucun</SelectItem>
            {phonerAgents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.prenom} {agent.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="agentVisio">Agent Visio</Label>
        <Select
          value={selectedAgentVisio}
          onValueChange={onVisioChange}
        >
          <SelectTrigger id="agentVisio">
            <SelectValue placeholder="Sélectionner un agent visio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucun</SelectItem>
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
