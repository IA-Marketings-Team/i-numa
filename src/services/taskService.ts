
import { Task, TaskStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignedTo (*)
    `);
  
  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchTaskById = async (id: string): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignedTo (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating task:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating status for task ${id}:`, error);
    throw new Error(error.message);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw new Error(error.message);
  }
};

export const fetchTasksByUser = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignedTo (*)
    `)
    .eq('assignedToId', userId);
  
  if (error) {
    console.error(`Error fetching tasks for user ${userId}:`, error);
    throw new Error(error.message);
  }
  
  return data || [];
};
