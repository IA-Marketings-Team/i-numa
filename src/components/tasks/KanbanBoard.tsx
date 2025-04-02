
import React from "react";
import { Task, TaskStatus } from "@/types";
import TaskDrag from "./TaskDrag";
import { 
  DndContext, 
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { Droppable } from "./Droppable";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, 
  onTaskClick,
  onTaskStatusChange 
}) => {
  const todoTasks = tasks.filter((task) => task.status === "to_do");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = String(active.id);
      const newStatus = String(over.id) as TaskStatus;
      
      if (onTaskStatusChange) {
        onTaskStatusChange(taskId, newStatus);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Droppable id="to_do">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-sm mb-3 text-blue-700 flex items-center">
              <span className="w-2 h-2 bg-blue-700 rounded-full mr-2"></span>
              À faire ({todoTasks.length})
            </h3>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskDrag 
                  key={task.id} 
                  task={task} 
                  onClick={onTaskClick} 
                />
              ))}
            </div>
          </div>
        </Droppable>

        <Droppable id="in_progress">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-sm mb-3 text-orange-700 flex items-center">
              <span className="w-2 h-2 bg-orange-700 rounded-full mr-2"></span>
              En cours ({inProgressTasks.length})
            </h3>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskDrag 
                  key={task.id} 
                  task={task} 
                  onClick={onTaskClick} 
                />
              ))}
            </div>
          </div>
        </Droppable>

        <Droppable id="done">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-sm mb-3 text-green-700 flex items-center">
              <span className="w-2 h-2 bg-green-700 rounded-full mr-2"></span>
              Terminé ({doneTasks.length})
            </h3>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskDrag 
                  key={task.id} 
                  task={task} 
                  onClick={onTaskClick} 
                />
              ))}
            </div>
          </div>
        </Droppable>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
