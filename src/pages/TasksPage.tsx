
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Plus } from 'lucide-react';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/taskService';
import { Task, TaskStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mine' | 'team'>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    loadTasks();
  }, [selectedFilter, user]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      let loadedTasks: Task[] = [];
      
      if (selectedFilter === 'mine' && user) {
        loadedTasks = await fetchTasks({ agentId: user.id });
      } else if (selectedFilter === 'team' && user) {
        // Pour l'instant, chargez toutes les tâches.
        // Dans le futur, nous pourrions filtrer par équipe quand cette fonctionnalité sera implémentée
        loadedTasks = await fetchTasks();
      } else {
        loadedTasks = await fetchTasks();
      }
      
      // Transform from DB format to our Task interface if needed
      const transformedTasks: Task[] = loadedTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        agentId: task.agentId,
        status: task.status as TaskStatus,
        dateCreation: task.dateCreation,
        dateEcheance: task.dateEcheance,
        priority: task.priority as 'low' | 'medium' | 'high'
      }));
      
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les tâches."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (data: { 
    title?: string; 
    status?: TaskStatus; 
    agentId?: string; 
    description?: string; 
    priority?: 'low' | 'medium' | 'high';
    dateEcheance?: Date;
  }) => {
    if (!data.title) return;
    
    try {
      const newTask: Omit<Task, 'id'> = {
        title: data.title,
        status: data.status || 'to_do',
        agentId: data.agentId || (user ? user.id : ''),
        description: data.description || '',
        dateCreation: new Date(),
        dateEcheance: data.dateEcheance,
        priority: data.priority || 'medium'
      };
      
      await createTask(newTask);
      loadTasks();
      setIsCreateModalOpen(false);
      
      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la tâche."
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tâche a été mis à jour."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tâche."
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      toast({
        variant: "destructive",
        title: "Erreur", 
        description: "Impossible de supprimer la tâche."
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des tâches</h1>
        <div className="flex space-x-4">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Nouvelle tâche
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs defaultValue="all" value={selectedFilter} onValueChange={(v) => setSelectedFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">Toutes les tâches</TabsTrigger>
            <TabsTrigger value="mine">Mes tâches</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="kanban" value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <p>Chargement des tâches...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'kanban' ? (
          <KanbanBoard 
            tasks={tasks}
            onTaskMove={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Liste des tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tableau des tâches en mode liste (à implémenter)</p>
            </CardContent>
          </Card>
        )
      )}
      
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          </DialogHeader>
          <TaskFormDialog onSubmit={handleAddTask} onCancel={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
