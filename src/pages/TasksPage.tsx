
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  agent_id: string;
  date_creation: string;
  date_echeance: string;
}

const TasksPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, [user]);
  
  const fetchTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('agent_id', user.id)
        .order('date_echeance', { ascending: true });
        
      if (error) throw error;
      
      setTasks(data as Task[]);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos tâches. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskCreate = async (newTask: Partial<Task>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description || '',
          status: newTask.status || 'todo',
          priority: newTask.priority || 'medium',
          agent_id: user.id,
          date_echeance: newTask.date_echeance
        })
        .select();
        
      if (error) throw error;
      
      setTasks([...tasks, data[0] as Task]);
      
      toast({
        title: "Tâche créée",
        description: "Votre tâche a été créée avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    }
  };
  
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          date_echeance: updatedTask.date_echeance
        })
        .eq('id', updatedTask.id);
        
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      toast({
        title: "Tâche mise à jour",
        description: "Votre tâche a été mise à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    }
  };
  
  const handleTaskDelete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Tâche supprimée",
        description: "Votre tâche a été supprimée avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    }
  };
  
  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'review' | 'done') => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    const updatedTask = { ...taskToUpdate, status: newStatus };
    await handleTaskUpdate(updatedTask);
  };

  // Adjust the props for the KanbanBoard component
  const handleTaskClick = (task: Task) => {
    // Open task detail or edit dialog here if needed
    console.log("Task clicked:", task);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des tâches</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-8">
            <p className="text-center">Chargement des tâches...</p>
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Aucune tâche</h3>
              <p className="text-muted-foreground mb-4">Vous n'avez aucune tâche pour le moment.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Créer une tâche
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <KanbanBoard 
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleStatusChange}
        />
      )}
      
      <TaskFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTaskCreate}
        // Since agents array is required by the component, provide an empty array for now
        agents={[]}
        initialData={undefined}
      />
    </div>
  );
};

export default TasksPage;
