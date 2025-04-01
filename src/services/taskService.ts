
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('date_creation', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  // Convert date strings to Date objects
  return data.map(task => ({
    ...task,
    date_creation: new Date(task.date_creation),
    date_echeance: task.date_echeance ? new Date(task.date_echeance) : undefined
  }));
}

export async function createTask(task: Omit<Task, 'id' | 'date_creation'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      agent_id: task.agent_id,
      status: task.status,
      priority: task.priority,
      date_echeance: task.date_echeance
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return {
    ...data,
    date_creation: new Date(data.date_creation),
    date_echeance: data.date_echeance ? new Date(data.date_echeance) : undefined
  };
}

export async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'date_creation'>>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return {
    ...data,
    date_creation: new Date(data.date_creation),
    date_echeance: data.date_echeance ? new Date(data.date_echeance) : undefined
  };
}

export async function updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
  return updateTask(id, { status });
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}
