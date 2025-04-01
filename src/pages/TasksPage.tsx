
import React, { useState } from "react";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";

const TasksContent = () => {
  const { tasks, loading, error, updateTaskStatus, searchTasks } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task["status"]) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTasks(searchQuery);
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestion des tâches</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <Input
              placeholder="Rechercher des tâches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Button 
            onClick={() => {
              setSelectedTask(null);
              setIsTaskFormOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {loading && tasks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
        />
      )}

      <TaskFormDialog
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        initialData={selectedTask || undefined}
        onSubmit={() => {
          setIsTaskFormOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
};

const TasksPage = () => {
  return (
    <TaskProvider>
      <TasksContent />
    </TaskProvider>
  );
};

export default TasksPage;
