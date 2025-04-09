
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Agent } from "@/types/agent";
import { Badge } from "@/components/ui/badge";

interface AgentsListProps {
  agents: Agent[];
  isLoading: boolean;
}

export const AgentsList: React.FC<AgentsListProps> = ({ agents, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Chargement des agents...</p>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-2">Aucun agent trouvé</p>
        <p className="text-sm text-muted-foreground">Ajoutez des agents pour qu'ils apparaissent ici.</p>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'agent_phoner':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Agent Phoner</Badge>;
      case 'agent_visio':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Agent Visio</Badge>;
      case 'agent_developpeur':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Agent Développeur</Badge>;
      case 'agent_marketing':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Agent Marketing</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.prenom} {agent.nom}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.telephone || "-"}</TableCell>
              <TableCell>{getRoleBadge(agent.role)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
