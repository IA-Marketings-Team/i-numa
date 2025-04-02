
import { Task, TaskPriority, TaskStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');
  
  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(error.message);
  }
  
  // Transform the Supabase data to match our Task type
  const tasks: Task[] = data.map(item => ({
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    agentId: item.agent_id || '',
    status: (item.status || 'to_do') as TaskStatus,
    priority: (item.priority || 'medium') as TaskPriority,
    dateCreation: new Date(item.date_creation).toISOString(),
    dateEcheance: item.date_echeance ? new Date(item.date_echeance).toISOString() : undefined
  }));
  
  return tasks;
};

export const fetchTaskById = async (id: string): Promise<Task | null> => {
  const { data: item, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  if (!item) return null;
  
  // Transform the Supabase data to match our Task type
  const task: Task = {
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    agentId: item.agent_id || '',
    status: (item.status || 'to_do') as TaskStatus,
    priority: (item.priority || 'medium') as TaskPriority,
    dateCreation: new Date(item.date_creation).toISOString(),
    dateEcheance: item.date_echeance ? new Date(item.date_echeance).toISOString() : undefined
  };
  
  return task;
};

export const createTask = async (taskData: Omit<Task, "id" | "dateCreation">): Promise<Task | null> => {
  // Convert to Supabase table structure
  const taskForSupabase = {
    title: taskData.title,
    description: taskData.description || '',
    agent_id: taskData.agentId || null,
    status: taskData.status || 'to_do',
    priority: taskData.priority || 'medium',
    date_echeance: taskData.dateEcheance ? new Date(taskData.dateEcheance).toISOString() : null
  };
  
  // Insert task
  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert([taskForSupabase])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating task:", error);
    throw new Error(error.message);
  }
  
  // Transform the Supabase data to match our Task type
  const task: Task = {
    id: newTask.id,
    title: newTask.title || '',
    description: newTask.description || '',
    agentId: newTask.agent_id || '',
    status: (newTask.status || 'to_do') as TaskStatus,
    priority: (newTask.priority || 'medium') as TaskPriority,
    dateCreation: new Date(newTask.date_creation).toISOString(),
    dateEcheance: newTask.date_echeance ? new Date(newTask.date_echeance).toISOString() : undefined
  };
  
  return task;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<boolean> => {
  // Convert to Supabase table structure
  const updateData: any = {};
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.agentId !== undefined) updateData.agent_id = updates.agentId;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.priority !== undefined) updateData.priority = updates.priority;
  if (updates.dateEcheance !== undefined) {
    updateData.date_echeance = updates.dateEcheance ? 
      new Date(updates.dateEcheance).toISOString() : 
      null;
  }
  
  // Update task
  const { error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const fetchTasksByAgent = async (agentId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('agent_id', agentId);
  
  if (error) {
    console.error(`Error fetching tasks for agent ${agentId}:`, error);
    throw new Error(error.message);
  }
  
  // Transform the Supabase data to match our Task type
  const tasks: Task[] = data.map(item => ({
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    agentId: item.agent_id || '',
    status: (item.status || 'to_do') as TaskStatus,
    priority: (item.priority || 'medium') as TaskPriority,
    dateCreation: new Date(item.date_creation).toISOString(),
    dateEcheance: item.date_echeance ? new Date(item.date_echeance).toISOString() : undefined
  }));
  
  return tasks;
};
