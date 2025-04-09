
import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentsList } from "@/components/agent/AgentsList";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchAgents } from "@/services/agentService";
import { Agent } from "@/types/agent";
import AddAgentDialog from "@/components/agent/AddAgentDialog";

const MesAgentsPage: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAgents();
        setAgents(data);
        setFilteredAgents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des agents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des agents.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAgents(agents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = agents.filter(
        agent =>
          agent.nom.toLowerCase().includes(query) ||
          agent.prenom.toLowerCase().includes(query) ||
          agent.email.toLowerCase().includes(query) ||
          agent.role.toLowerCase().includes(query)
      );
      setFilteredAgents(filtered);
    }
  }, [searchQuery, agents]);

  const handleAddAgent = () => {
    setShowAddAgentDialog(true);
  };

  const handleAgentAdded = (newAgent: Agent) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
    setShowAddAgentDialog(false);
    toast({
      title: "Agent ajouté",
      description: `${newAgent.prenom} ${newAgent.nom} a été ajouté avec succès.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes agents</h1>
        <Button onClick={handleAddAgent}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un agent
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Liste des agents</CardTitle>
          <CardDescription>
            Consultez et gérez les agents associés à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un agent..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <AgentsList
            agents={filteredAgents}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AddAgentDialog 
        open={showAddAgentDialog} 
        onOpenChange={setShowAddAgentDialog} 
        onAgentAdded={handleAgentAdded}
      />
    </div>
  );
};

export default MesAgentsPage;
