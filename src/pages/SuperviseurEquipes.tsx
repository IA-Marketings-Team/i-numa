
import React, { useState } from "react";
import { agents } from "@/data/mock/agents";
import { Agent } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import RendezVousChart from "@/components/stats/RendezVousChart";
import { Badge } from "@/components/ui/badge";
import { BarChart2, Phone, Users, Video } from "lucide-react";

const SuperviseurEquipes = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Filter agents by role
  const phonerAgents = agents.filter(agent => agent.role === "agent_phoner");
  const visioAgents = agents.filter(agent => agent.role === "agent_visio");
  const allAgents = [...phonerAgents, ...visioAgents];

  // Check permissions
  React.useEffect(() => {
    if (!hasPermission(['superviseur', 'responsable'])) {
      navigate("/tableau-de-bord");
    }
  }, [hasPermission, navigate]);

  // Prepare chart data for the selected agent
  const getAgentChartData = (agent: Agent) => {
    return [
      { name: "Appels émis", value: agent.statistiques.appelsEmis, fill: "#3B82F6" },
      { name: "RDV honorés", value: agent.statistiques.rendezVousHonores, fill: "#10B981" },
      { name: "RDV manqués", value: agent.statistiques.rendezVousNonHonores, fill: "#EF4444" },
      { name: "Dossiers validés", value: agent.statistiques.dossiersValides, fill: "#8B5CF6" },
      { name: "Contrats signés", value: agent.statistiques.dossiersSigne, fill: "#F59E0B" }
    ];
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsStatsOpen(true);
  };

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={() => handleAgentClick(agent)}
    >
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{agent.prenom} {agent.nom}</p>
            <div className="flex items-center mt-1">
              <Badge 
                variant={agent.role === "agent_phoner" ? "secondary" : "default"}
                className="flex items-center gap-1"
              >
                {agent.role === "agent_phoner" ? <Phone className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                {agent.role === "agent_phoner" ? "Agent Phoner" : "Agent Visio"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="text-sm">
            <p className="text-muted-foreground">Appels</p>
            <p className="font-medium">{agent.statistiques.appelsEmis}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">RDV</p>
            <p className="font-medium">{agent.statistiques.rendezVousHonores + agent.statistiques.rendezVousNonHonores}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Dossiers</p>
            <p className="font-medium">{agent.statistiques.dossiersValides}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Signés</p>
            <p className="font-medium">{agent.statistiques.dossiersSigne}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Équipes</h1>
        <div className="flex items-center">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {allAgents.length} agents
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les équipes</TabsTrigger>
          <TabsTrigger value="phoner">Équipe Phoner</TabsTrigger>
          <TabsTrigger value="visio">Équipe Visio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="phoner" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phonerAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="visio" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visioAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for agent statistics */}
      <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Statistiques de {selectedAgent?.prenom} {selectedAgent?.nom}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAgent && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'agent</CardTitle>
                  <CardDescription>Détails et coordonnées</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {selectedAgent.prenom.charAt(0)}{selectedAgent.nom.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">{selectedAgent.prenom} {selectedAgent.nom}</p>
                      <Badge 
                        variant={selectedAgent.role === "agent_phoner" ? "secondary" : "default"}
                        className="mt-1"
                      >
                        {selectedAgent.role === "agent_phoner" ? "Agent Phoner" : "Agent Visio"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {selectedAgent.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Téléphone:</span> {selectedAgent.telephone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date d'entrée:</span> {new Date(selectedAgent.dateCreation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Indicateurs clés de performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground">Taux de décrochage</div>
                        <div className="text-xl font-bold">
                          {Math.round((selectedAgent.statistiques.appelsDecroches / selectedAgent.statistiques.appelsEmis) * 100)}%
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground">Taux de transformation</div>
                        <div className="text-xl font-bold">
                          {Math.round((selectedAgent.statistiques.appelsTransformes / selectedAgent.statistiques.appelsDecroches) * 100)}%
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground">Taux de présence RDV</div>
                        <div className="text-xl font-bold">
                          {Math.round((selectedAgent.statistiques.rendezVousHonores / (selectedAgent.statistiques.rendezVousHonores + selectedAgent.statistiques.rendezVousNonHonores)) * 100)}%
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs font-medium text-muted-foreground">Taux de conversion</div>
                        <div className="text-xl font-bold">
                          {Math.round((selectedAgent.statistiques.dossiersSigne / selectedAgent.statistiques.dossiersValides) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="lg:col-span-2">
                <RendezVousChart data={getAgentChartData(selectedAgent)} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperviseurEquipes;
