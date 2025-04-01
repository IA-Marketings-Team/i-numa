
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Agent, 
  Team, 
  Task
} from "@/types";
import { 
  agents as mockAgents,
  teams as mockTeams,
  tasks as mockTasks
} from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import RendezVousChart from "@/components/stats/RendezVousChart";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TeamForm from "@/components/teams/TeamForm";
import AgentForm from "@/components/agents/AgentForm";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";
import { 
  BarChart2, 
  Phone, 
  Users, 
  Video, 
  Code, 
  TrendingUp,
  UserPlus,
  PlusCircle,
  List,
  ClipboardCheck,
  Calendar,
  ChevronRight,
  Briefcase
} from "lucide-react";

const SuperviseurEquipe = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isTeamDetailsOpen, setIsTeamDetailsOpen] = useState(false);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("teams");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [agentToManage, setAgentToManage] = useState<Agent | null>(null);
  const [teamForAgent, setTeamForAgent] = useState<Team | null>(null);

  // Check permissions
  React.useEffect(() => {
    if (!hasPermission(['superviseur', 'responsable'])) {
      navigate("/tableau-de-bord");
    }
  }, [hasPermission, navigate]);

  // Get agent role icon
  const getAgentRoleIcon = (role: string) => {
    switch (role) {
      case "agent_phoner":
        return <Phone className="h-3 w-3" />;
      case "agent_visio":
        return <Video className="h-3 w-3" />;
      case "agent_developpeur":
        return <Code className="h-3 w-3" />;
      case "agent_marketing":
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  // Get agent role label
  const getAgentRoleLabel = (role: string) => {
    switch (role) {
      case "agent_phoner":
        return "Agent Phoner";
      case "agent_visio":
        return "Agent Visio";
      case "agent_developpeur":
        return "Agent Développeur";
      case "agent_marketing":
        return "Agent Marketing";
      default:
        return role;
    }
  };

  // Get agent team name
  const getAgentTeamName = (agent: Agent) => {
    if (!agent.equipeId) return "Non assigné";
    const team = teams.find(t => t.id === agent.equipeId);
    return team ? team.nom : "Non assigné";
  };

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

  // Get agent tasks
  const getAgentTasks = (agentId: string) => {
    return tasks.filter(task => task.agentId === agentId);
  };

  // Handle agent click
  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsStatsOpen(true);
  };

  // Handle team click
  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsTeamDetailsOpen(true);
  };

  // Handle add team
  const handleAddTeam = (data: any) => {
    const newTeam: Team = {
      id: `team${teams.length + 1}`,
      nom: data.nom,
      fonction: data.fonction,
      description: data.description,
      dateCreation: new Date()
    };

    setTeams([...teams, newTeam]);
    setIsAddTeamOpen(false);
    
    toast({
      title: "Équipe créée",
      description: `L'équipe ${data.nom} a été créée avec succès`,
    });
  };

  // Handle add agent
  const handleAddAgent = (data: any) => {
    const newAgent: Agent = {
      id: `agent${agents.length + 1}`,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      role: data.role,
      equipeId: data.equipeId === "aucune" ? undefined : data.equipeId,
      dateCreation: new Date(),
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

    setAgents([...agents, newAgent]);
    setIsAddAgentOpen(false);
    
    toast({
      title: "Agent ajouté",
      description: `${data.prenom} ${data.nom} a été ajouté avec succès`,
    });
  };

  // Handle add task
  const handleAddTask = (data: any) => {
    const newTask: Task = {
      id: `task${tasks.length + 1}`,
      title: data.title,
      description: data.description,
      agentId: data.agentId,
      status: data.status,
      dateCreation: new Date(),
      dateEcheance: data.dateEcheance,
      priority: data.priority
    };

    setTasks([...tasks, newTask]);
    setIsTaskFormOpen(false);
    
    toast({
      title: "Tâche ajoutée",
      description: `La tâche "${data.title}" a été ajoutée avec succès`,
    });
  };

  // Handle edit task
  const handleEditTask = (data: any) => {
    if (!selectedTask) return;

    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id
        ? {
            ...task,
            title: data.title,
            description: data.description,
            agentId: data.agentId,
            status: data.status,
            dateEcheance: data.dateEcheance,
            priority: data.priority
          }
        : task
    );

    setTasks(updatedTasks);
    setSelectedTask(null);
    
    toast({
      title: "Tâche mise à jour",
      description: `La tâche "${data.title}" a été mise à jour avec succès`,
    });
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  // Agent card component
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
                variant="outline"
                className="flex items-center gap-1"
              >
                {getAgentRoleIcon(agent.role)}
                {getAgentRoleLabel(agent.role)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getAgentTeamName(agent)}
            </p>
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

  // Team card component
  const TeamCard = ({ team }: { team: Team }) => {
    const teamAgents = agents.filter(agent => agent.equipeId === team.id);
    
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow" 
        onClick={() => handleTeamClick(team)}
      >
        <CardHeader>
          <CardTitle>{team.nom}</CardTitle>
          <CardDescription>{team.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Badge>
              {team.fonction === "phoning" ? "Phoning" :
               team.fonction === "visio" ? "Visio" :
               team.fonction === "developpement" ? "Développement" :
               team.fonction === "marketing" ? "Marketing" : "Mixte"}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {teamAgents.length} agents
            </Badge>
          </div>
          
          {teamAgents.length > 0 ? (
            <div className="space-y-3">
              {teamAgents.slice(0, 3).map(agent => (
                <div 
                  key={agent.id}
                  className="flex items-center space-x-3 p-2 rounded-md border hover:bg-muted/50"
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{agent.prenom} {agent.nom}</p>
                    <p className="text-xs text-muted-foreground">
                      {getAgentRoleLabel(agent.role)}
                    </p>
                  </div>
                </div>
              ))}
              {teamAgents.length > 3 && (
                <div className="text-center text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className="w-full">
                    +{teamAgents.length - 3} autres agents <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Aucun agent dans cette équipe
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Équipes</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsAddAgentOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un agent
          </Button>
          <Button onClick={() => setIsAddTeamOpen(true)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une équipe
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Équipes</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden md:inline">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden md:inline">Tâches</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="agents" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tâches</h2>
            <Button onClick={() => {
              setSelectedTask(null);
              setIsTaskFormOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une tâche
            </Button>
          </div>
          <KanbanBoard 
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog for agent statistics */}
      <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              {selectedAgent && (
                <>Statistiques de {selectedAgent.prenom} {selectedAgent.nom}</>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAgent && (
            <Tabs defaultValue="performance">
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="tasks">
                  <List className="h-4 w-4 mr-2" />
                  Tâches
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
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
                            variant="outline"
                            className="mt-1 flex items-center gap-1"
                          >
                            {getAgentRoleIcon(selectedAgent.role)}
                            {getAgentRoleLabel(selectedAgent.role)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getAgentTeamName(selectedAgent)}
                          </p>
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
                              {selectedAgent.statistiques.appelsEmis > 0 
                                ? Math.round((selectedAgent.statistiques.appelsDecroches / selectedAgent.statistiques.appelsEmis) * 100)
                                : 0}%
                            </div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-xs font-medium text-muted-foreground">Taux de transformation</div>
                            <div className="text-xl font-bold">
                              {selectedAgent.statistiques.appelsDecroches > 0 
                                ? Math.round((selectedAgent.statistiques.appelsTransformes / selectedAgent.statistiques.appelsDecroches) * 100)
                                : 0}%
                            </div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-xs font-medium text-muted-foreground">Taux de présence RDV</div>
                            <div className="text-xl font-bold">
                              {(selectedAgent.statistiques.rendezVousHonores + selectedAgent.statistiques.rendezVousNonHonores) > 0 
                                ? Math.round((selectedAgent.statistiques.rendezVousHonores / (selectedAgent.statistiques.rendezVousHonores + selectedAgent.statistiques.rendezVousNonHonores)) * 100)
                                : 0}%
                            </div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-xs font-medium text-muted-foreground">Taux de conversion</div>
                            <div className="text-xl font-bold">
                              {selectedAgent.statistiques.dossiersValides > 0 
                                ? Math.round((selectedAgent.statistiques.dossiersSigne / selectedAgent.statistiques.dossiersValides) * 100)
                                : 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="lg:col-span-2">
                    <RendezVousChart 
                      data={getAgentChartData(selectedAgent)} 
                      title="Statistiques de performance"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tasks">
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Liste des tâches</h3>
                    <Button 
                      onClick={() => {
                        setSelectedTask(null);
                        setIsTaskFormOpen(true);
                      }}
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter une tâche
                    </Button>
                  </div>
                  <KanbanBoard 
                    tasks={getAgentTasks(selectedAgent.id)}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for team details */}
      <Dialog open={isTeamDetailsOpen} onOpenChange={setIsTeamDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {selectedTeam && (
                <>Détails de l'équipe {selectedTeam.nom}</>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTeam && (
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-2" />
                  Membres
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <List className="h-4 w-4 mr-2" />
                  Tâches
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <div className="grid grid-cols-1 gap-6 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations de l'équipe</CardTitle>
                      <CardDescription>Détails et fonction</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{selectedTeam.nom}</h3>
                            <Badge className="mt-1">
                              {selectedTeam.fonction === "phoning" ? "Phoning" :
                              selectedTeam.fonction === "visio" ? "Visio" :
                              selectedTeam.fonction === "developpement" ? "Développement" :
                              selectedTeam.fonction === "marketing" ? "Marketing" : "Mixte"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Créée le {new Date(selectedTeam.dateCreation).toLocaleDateString('fr-FR')}
                            </p>
                            <Badge variant="outline" className="mt-1 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {agents.filter(a => a.equipeId === selectedTeam.id).length} membres
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm font-medium">Description:</p>
                          <p className="text-sm mt-1">{selectedTeam.description}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Statistiques d'équipe</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {(() => {
                            const teamAgents = agents.filter(a => a.equipeId === selectedTeam.id);
                            const totalAppels = teamAgents.reduce((sum, agent) => sum + agent.statistiques.appelsEmis, 0);
                            const totalRDV = teamAgents.reduce((sum, agent) => 
                              sum + agent.statistiques.rendezVousHonores + agent.statistiques.rendezVousNonHonores, 0);
                            const totalDossiers = teamAgents.reduce((sum, agent) => sum + agent.statistiques.dossiersValides, 0);
                            const totalSignes = teamAgents.reduce((sum, agent) => sum + agent.statistiques.dossiersSigne, 0);
                            
                            return (
                              <>
                                <div className="rounded-lg border p-3">
                                  <div className="text-xs font-medium text-muted-foreground">Total Appels</div>
                                  <div className="text-xl font-bold">{totalAppels}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                  <div className="text-xs font-medium text-muted-foreground">Total RDV</div>
                                  <div className="text-xl font-bold">{totalRDV}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                  <div className="text-xs font-medium text-muted-foreground">Dossiers validés</div>
                                  <div className="text-xl font-bold">{totalDossiers}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                  <div className="text-xs font-medium text-muted-foreground">Contrats signés</div>
                                  <div className="text-xl font-bold">{totalSignes}</div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="members">
                <div className="mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Membres de l'équipe</CardTitle>
                        <Button size="sm" onClick={() => setIsAddAgentOpen(true)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Ajouter un agent
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Agent</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Performances</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agents.filter(agent => agent.equipeId === selectedTeam.id).map(agent => (
                            <TableRow key={agent.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{agent.prenom} {agent.nom}</p>
                                    <p className="text-xs text-muted-foreground">{agent.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="flex w-fit items-center gap-1">
                                  {getAgentRoleIcon(agent.role)}
                                  {getAgentRoleLabel(agent.role)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">{agent.telephone}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2 text-xs">
                                  <div className="p-1 px-2 rounded-md bg-blue-100 text-blue-700">
                                    {agent.statistiques.appelsEmis} appels
                                  </div>
                                  <div className="p-1 px-2 rounded-md bg-green-100 text-green-700">
                                    {agent.statistiques.rendezVousHonores} RDV
                                  </div>
                                  <div className="p-1 px-2 rounded-md bg-purple-100 text-purple-700">
                                    {agent.statistiques.dossiersValides} dossiers
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" onClick={() => handleAgentClick(agent)}>
                                  Détails
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {agents.filter(agent => agent.equipeId === selectedTeam.id).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6">
                                <p className="text-muted-foreground">Aucun agent dans cette équipe</p>
                                <Button variant="outline" className="mt-2" onClick={() => setIsAddAgentOpen(true)}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Ajouter un agent
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="tasks">
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Tâches de l'équipe</h3>
                    <Button 
                      onClick={() => {
                        setSelectedTask(null);
                        setIsTaskFormOpen(true);
                      }}
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter une tâche
                    </Button>
                  </div>
                  <KanbanBoard 
                    tasks={tasks.filter(task => {
                      const agent = agents.find(a => a.id === task.agentId);
                      return agent && agent.equipeId === selectedTeam.id;
                    })}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for add team */}
      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle équipe</DialogTitle>
          </DialogHeader>
          <TeamForm 
            onSubmit={handleAddTeam}
            onCancel={() => setIsAddTeamOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for add agent */}
      <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel agent</DialogTitle>
          </DialogHeader>
          <AgentForm 
            teams={teams}
            onSubmit={handleAddAgent}
            onCancel={() => setIsAddAgentOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for task form */}
      <TaskFormDialog
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        initialData={selectedTask || undefined}
        agents={agents}
        onSubmit={selectedTask ? handleEditTask : handleAddTask}
      />
    </div>
  );
};

export default SuperviseurEquipe;
