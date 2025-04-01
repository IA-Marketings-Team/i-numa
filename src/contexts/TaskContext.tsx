
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, TaskStatus } from "@/types";
import { TaskService } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, "id" | "dateCreation">) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "dateCreation">>) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>;
  searchTasks: (query: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger les tâches au démarrage
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Impossible de charger les tâches");
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, "id" | "dateCreation">) => {
    try {
      setLoading(true);
      const newTask = await TaskService.createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès",
      });
      return newTask;
    } catch (err) {
      console.error("Failed to create task:", err);
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, "id" | "dateCreation">>) => {
    try {
      setLoading(true);
      const updatedTask = await TaskService.updateTask(id, updates);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      toast({
        title: "Tâche mise à jour",
        description: "La tâche a été mise à jour avec succès",
      });
      return updatedTask;
    } catch (err) {
      console.error("Failed to update task:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      const success = await TaskService.deleteTask(id);
      if (success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        toast({
          title: "Tâche supprimée",
          description: "La tâche a été supprimée avec succès",
        });
      }
      return success;
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    return updateTask(id, { status });
  };

  const searchTasks = async (query: string) => {
    try {
      setLoading(true);
      if (!query.trim()) {
        await fetchTasks();
        return;
      }
      
      const searchResults = await TaskService.searchTasks(query);
      setTasks(searchResults);
    } catch (err) {
      console.error("Failed to search tasks:", err);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les tâches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        searchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
