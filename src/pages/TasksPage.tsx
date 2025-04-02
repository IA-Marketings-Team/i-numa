import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";
import { Task, TaskStatus } from "@/types";
import { fetchTasks, createTask, updateTask, deleteTask, fetchTasksByAgent } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    loadTasks();
  }, [user]);
  
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      let loadedTasks;
      
      if (user && (user.role === 'agent_phoner' || user.role === 'agent_visio')) {
        loadedTasks = await fetchTasksByAgent(user.id);
      } else {
        loadedTasks = await fetchTasks();
      }
      
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsFormOpen(true);
  };
  
  const handleAddTask = async (taskData: Omit<Task, "id" | "dateCreation">) => {
    try {
      let assignedAgentId = taskData.agentId;
      if (!assignedAgentId && user && (user.role === 'agent_phoner' || user.role === 'agent_visio')) {
        assignedAgentId = user.id;
      }
      
      const newTask = await createTask({
        ...taskData,
        agentId: assignedAgentId
      });
      
      if (newTask) {
        setTasks(prev => [...prev, newTask]);
        setIsFormOpen(false);
        toast({
          title: "Tâche créée",
          description: "La tâche a été créée avec succès.",
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const success = await updateTask(id, updates);
      
      if (success) {
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ));
        setIsFormOpen(false);
        setSelectedTask(null);
        toast({
          title: "Tâche mise à jour",
          description: "La tâche a été mise à jour avec succès.",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    try {
      const success = await deleteTask(id);
      
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
        setIsFormOpen(false);
        setSelectedTask(null);
        toast({
          title: "Tâche supprimée",
          description: "La tâche a été supprimée avec succès.",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const success = await updateTask(taskId, { status: newStatus });
      
      if (success) {
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus } 
            : task
        ));
        toast({
          title: "Statut mis à jour",
          description: `Le statut de la tâche a été mis à jour en "${newStatus}".`,
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tâches</h1>
        <Button onClick={() => { setIsEditMode(false); setSelectedTask(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center p-6">
          <p>Chargement des tâches...</p>
        </div>
      ) : (
        <KanbanBoard 
          tasks={tasks} 
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
        />
      )}
      
      <TaskFormDialog 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={selectedTask}
        isEditMode={isEditMode}
        onSubmit={isEditMode ? handleUpdateTask : handleAddTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TasksPage;
