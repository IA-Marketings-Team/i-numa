
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Button as AlertDialogTrigger } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchAgents } from "@/services/agentService";
import { useEffect, useState } from "react";
import { Agent } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TaskFormData {
  title: string;
  description?: string;
  agentId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dateEcheance?: Date;
}

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  isEditMode: boolean;
  onSubmit: ((data: Omit<Task, "id" | "dateCreation">) => Promise<void>) | ((id: string, updates: Partial<Task>) => Promise<void>);
  onDelete?: (id: string) => Promise<void>;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  isOpen,
  onOpenChange,
  task,
  isEditMode,
  onSubmit,
  onDelete,
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { register, handleSubmit, setValue, reset, watch } = useForm<TaskFormData>();
  const selectedDate = watch("dateEcheance");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentList = await fetchAgents();
        setAgents(agentList);
      } catch (error) {
        console.error("Error loading agents:", error);
      }
    };

    loadAgents();
  }, []);

  useEffect(() => {
    if (task && isEditMode) {
      setValue("title", task.title);
      setValue("description", task.description || "");
      setValue("agentId", task.agentId);
      setValue("status", task.status);
      setValue("priority", task.priority);
      setValue("dateEcheance", task.dateEcheance);
    } else {
      reset({
        title: "",
        description: "",
        agentId: "",
        status: "to_do",
        priority: "medium",
      });
    }
  }, [task, isEditMode, setValue, reset]);

  const handleFormSubmit: SubmitHandler<TaskFormData> = (data) => {
    if (isEditMode && task) {
      // Remove undefined values to prevent overwriting with undefined
      const updates: Partial<Task> = {};
      if (data.title !== undefined) updates.title = data.title;
      if (data.description !== undefined) updates.description = data.description;
      if (data.agentId !== undefined) updates.agentId = data.agentId;
      if (data.status !== undefined) updates.status = data.status;
      if (data.priority !== undefined) updates.priority = data.priority;
      if (data.dateEcheance !== undefined) updates.dateEcheance = data.dateEcheance;

      (onSubmit as (id: string, updates: Partial<Task>) => Promise<void>)(task.id, updates);
    } else {
      (onSubmit as (data: Omit<Task, "id" | "dateCreation">) => Promise<void>)(data);
    }
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Modifier la tâche" : "Créer une nouvelle tâche"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Mettez à jour les détails de la tâche ci-dessous."
                : "Remplissez les détails de la nouvelle tâche."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" {...register("title", { required: true })} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>

              <div>
                <Label htmlFor="agentId">Agent assigné</Label>
                <Select
                  onValueChange={(value) => setValue("agentId", value)}
                  defaultValue={task?.agentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.prenom} {agent.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    onValueChange={(value) => setValue("status", value as TaskStatus)}
                    defaultValue={task?.status || "to_do"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to_do">À faire</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="done">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    onValueChange={(value) => setValue("priority", value as TaskPriority)}
                    defaultValue={task?.priority || "medium"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dateEcheance">Date d'échéance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setValue("dateEcheance", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              {isEditMode && onDelete && (
                <AlertDialogTrigger
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </AlertDialogTrigger>
              )}
              <div>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
                  Annuler
                </Button>
                <Button type="submit">
                  {isEditMode ? "Enregistrer les modifications" : "Créer la tâche"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement cette tâche.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskFormDialog;
