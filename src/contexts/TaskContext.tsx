
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types";
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'date_creation'>) => Promise<void>;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'date_creation'>>) => Promise<void>;
  changeTaskStatus: (id: string, newStatus: Task['status']) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
    
    // Set up real-time subscription for tasks
    const channel = supabase
      .channel('public:tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        (payload) => {
          console.log('Change received!', payload);
          refreshTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'date_creation'>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast({
        title: "Task added",
        description: "The task has been created successfully.",
      });
    } catch (err) {
      console.error("Failed to add task:", err);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const editTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'date_creation'>>) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
    } catch (err) {
      console.error("Failed to update task:", err);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const changeTaskStatus = async (id: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await updateTaskStatus(id, newStatus);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast({
        title: "Status updated",
        description: `The task has been moved to ${
          newStatus === "to_do" ? "To Do" :
          newStatus === "in_progress" ? "In Progress" : "Done"
        }.`,
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const value = {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    changeTaskStatus,
    removeTask,
    refreshTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
