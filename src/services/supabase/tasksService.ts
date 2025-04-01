
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types";

export const getTaskById = async (id: string): Promise<Task | null> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching task:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || undefined,
    agentId: data.agent_id,
    status: data.status as "to_do" | "in_progress" | "done",
    dateCreation: new Date(data.date_creation),
    dateEcheance: data.date_echeance ? new Date(data.date_echeance) : undefined,
    priority: data.priority as "low" | "medium" | "high"
  };
};

export const getAllTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("date_creation", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    agentId: task.agent_id,
    status: task.status as "to_do" | "in_progress" | "done",
    dateCreation: new Date(task.date_creation),
    dateEcheance: task.date_echeance ? new Date(task.date_echeance) : undefined,
    priority: task.priority as "low" | "medium" | "high"
  }));
};

export const getTasksByAgentId = async (agentId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("agent_id", agentId)
    .order("date_creation", { ascending: false });

  if (error) {
    console.error("Error fetching tasks by agent ID:", error);
    return [];
  }

  return data.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    agentId: task.agent_id,
    status: task.status as "to_do" | "in_progress" | "done",
    dateCreation: new Date(task.date_creation),
    dateEcheance: task.date_echeance ? new Date(task.date_echeance) : undefined,
    priority: task.priority as "low" | "medium" | "high"
  }));
};

export const getTasksByStatus = async (status: "to_do" | "in_progress" | "done"): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", status)
    .order("date_creation", { ascending: false });

  if (error) {
    console.error(`Error fetching ${status} tasks:`, error);
    return [];
  }

  return data.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    agentId: task.agent_id,
    status: task.status as "to_do" | "in_progress" | "done",
    dateCreation: new Date(task.date_creation),
    dateEcheance: task.date_echeance ? new Date(task.date_echeance) : undefined,
    priority: task.priority as "low" | "medium" | "high"
  }));
};

export const createTask = async (task: Omit<Task, "id" | "dateCreation">): Promise<Task | null> => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        title: task.title,
        description: task.description,
        agent_id: task.agentId,
        status: task.status,
        date_echeance: task.dateEcheance?.toISOString(),
        priority: task.priority
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || undefined,
    agentId: data.agent_id,
    status: data.status as "to_do" | "in_progress" | "done",
    dateCreation: new Date(data.date_creation),
    dateEcheance: data.date_echeance ? new Date(data.date_echeance) : undefined,
    priority: data.priority as "low" | "medium" | "high"
  };
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  const updateData: any = {};
  
  if (updates.title) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.agentId !== undefined) updateData.agent_id = updates.agentId;
  if (updates.status) updateData.status = updates.status;
  if (updates.dateEcheance !== undefined) updateData.date_echeance = updates.dateEcheance?.toISOString();
  if (updates.priority) updateData.priority = updates.priority;

  const { data, error } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || undefined,
    agentId: data.agent_id,
    status: data.status as "to_do" | "in_progress" | "done",
    dateCreation: new Date(data.date_creation),
    dateEcheance: data.date_echeance ? new Date(data.date_echeance) : undefined,
    priority: data.priority as "low" | "medium" | "high"
  };
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    return false;
  }

  return true;
};
