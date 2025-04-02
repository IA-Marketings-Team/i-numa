
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, PhoneCall, Video, Mail, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchAgents } from "@/services/agentService";
import { useToast } from "@/hooks/use-toast";

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAgents();
        setAgents(data);
      } catch (error) {
        console.error("Error loading agents:", error);
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
  
  const handleViewDetails = (agent: any) => {
    setSelectedAgent(agent);
    setIsDetailsOpen(true);
  };
  
  // Filter agents by role
  const phonerAgents = agents.filter(a => a.role === 'agent_phoner');
  const visioAgents = agents.filter(a => a.role === 'agent_visio');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agents</h1>
        <Button>
          <User className="mr-2 h-4 w-4" /> Ajouter un agent
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center p-6">
          <p>Chargement des agents...</p>
        </div>
      ) : (
        <Tabs defaultValue="phoner">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="phoner">
              <PhoneCall className="mr-2 h-4 w-4" /> Agents Phoner
            </TabsTrigger>
            <TabsTrigger value="visio">
              <Video className="mr-2 h-4 w-4" /> Agents Visio
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="phoner" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {phonerAgents.length > 0 ? (
                phonerAgents.map((agent) => (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    onViewDetails={() => handleViewDetails(agent)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center p-6">
                  <p>Aucun agent phoner trouvé</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="visio" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visioAgents.length > 0 ? (
                visioAgents.map((agent) => (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    onViewDetails={() => handleViewDetails(agent)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center p-6">
                  <p>Aucun agent visio trouvé</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {selectedAgent && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Détails de l'agent</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={selectedAgent.profileImage} />
                <AvatarFallback>
                  {selectedAgent.prenom?.[0]}{selectedAgent.nom?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{selectedAgent.prenom} {selectedAgent.nom}</h3>
                <Badge variant="outline" className="mt-1">
                  {selectedAgent.role === 'agent_phoner' ? 'Agent Phoner' : 'Agent Visio'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedAgent.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedAgent.telephone || 'Non renseigné'}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Statistiques</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Appels émis</p>
                    <p className="font-medium">{selectedAgent.appels_emis || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Appels transformés</p>
                    <p className="font-medium">{selectedAgent.appels_transformes || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RDV honorés</p>
                    <p className="font-medium">{selectedAgent.rendez_vous_honores || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dossiers validés</p>
                    <p className="font-medium">{selectedAgent.dossiers_valides || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface AgentCardProps {
  agent: any;
  onViewDetails: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onViewDetails }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{agent.prenom} {agent.nom}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetails}>Voir détails</DropdownMenuItem>
              <DropdownMenuItem>Modifier</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={agent.profileImage} />
            <AvatarFallback>
              {agent.prenom?.[0]}{agent.nom?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <Badge variant="outline">
              {agent.role === 'agent_phoner' ? 'Agent Phoner' : 'Agent Visio'}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">{agent.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Appels</p>
            <p className="font-medium">{agent.appels_emis || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">RDV</p>
            <p className="font-medium">{agent.rendez_vous_honores || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentsPage;
