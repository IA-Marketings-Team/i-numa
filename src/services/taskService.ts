
import { Task, TaskStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère toutes les tâches
 */
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('date_echeance', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      return [];
    }

    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      agentId: task.agent_id,
      status: task.status as TaskStatus,
      dateCreation: new Date(task.date_creation),
      dateEcheance: task.date_echeance ? new Date(task.date_echeance) : undefined,
      priority: task.priority
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des tâches:", error);
    return [];
  }
};

/**
 * Récupère les tâches par agent
 */
export const fetchTasksByAgent = async (agentId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('agent_id', agentId)
      .order('date_echeance', { ascending: true });

    if (error) {
      console.error(`Erreur lors de la récupération des tâches pour l'agent ${agentId}:`, error);
      return [];
    }

    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      agentId: task.agent_id,
      status: task.status as TaskStatus,
      dateCreation: new Date(task.date_creation),
      dateEcheance: task.date_echeance ? new Date(task.date_echeance) : undefined,
      priority: task.priority
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des tâches pour l'agent ${agentId}:`, error);
    return [];
  }
};

/**
 * Récupère une tâche par son ID
 */
export const fetchTaskById = async (id: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de la tâche ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      agentId: data.agent_id,
      status: data.status as TaskStatus,
      dateCreation: new Date(data.date_creation),
      dateEcheance: data.date_echeance ? new Date(data.date_echeance) : undefined,
      priority: data.priority
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de la tâche ${id}:`, error);
    return null;
  }
};

/**
 * Crée une nouvelle tâche
 */
export const createTask = async (task: Omit<Task, 'id' | 'dateCreation'>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        agent_id: task.agentId,
        status: task.status,
        date_echeance: task.dateEcheance?.toISOString(),
        priority: task.priority
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      agentId: data.agent_id,
      status: data.status as TaskStatus,
      dateCreation: new Date(data.date_creation),
      dateEcheance: data.date_echeance ? new Date(data.date_echeance) : undefined,
      priority: data.priority
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de la tâche:", error);
    return null;
  }
};

/**
 * Met à jour une tâche existante
 */
export const updateTask = async (id: string, updates: Partial<Task>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.agentId !== undefined) updateData.agent_id = updates.agentId;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.dateEcheance !== undefined) updateData.date_echeance = updates.dateEcheance?.toISOString();
    if (updates.priority !== undefined) updateData.priority = updates.priority;

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de la tâche ${id}:`, error);
    return false;
  }
};

/**
 * Supprime une tâche
 */
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression de la tâche ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de la tâche ${id}:`, error);
    return false;
  }
};
