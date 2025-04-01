
import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/types";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { agents } from "@/data/mock/agents";

const TasksPage: React.FC = () => {
  const { tasks, loading, addTask, editTask, changeTaskStatus } = useTaskContext();
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks based on search
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedTask) {
        await editTask(selectedTask.id, data);
      } else {
        await addTask(data);
      }
      setSelectedTask(null);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestion des Tâches</h1>
        <Button onClick={() => {
          setSelectedTask(null);
          setIsFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une tâche
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des tâches..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <KanbanBoard 
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
        onTaskStatusChange={changeTaskStatus}
        loading={loading}
      />
      
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedTask || undefined}
        agents={agents}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default TasksPage;
