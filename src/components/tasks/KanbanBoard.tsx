
import React from "react";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick }) => {
  const todoTasks = tasks.filter((task) => task.status === "to_do");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="font-medium text-sm mb-3 text-blue-700 flex items-center">
          <span className="w-2 h-2 bg-blue-700 rounded-full mr-2"></span>
          À faire ({todoTasks.length})
        </h3>
        <div className="space-y-3">
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="font-medium text-sm mb-3 text-orange-700 flex items-center">
          <span className="w-2 h-2 bg-orange-700 rounded-full mr-2"></span>
          En cours ({inProgressTasks.length})
        </h3>
        <div className="space-y-3">
          {inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="font-medium text-sm mb-3 text-green-700 flex items-center">
          <span className="w-2 h-2 bg-green-700 rounded-full mr-2"></span>
          Terminé ({doneTasks.length})
        </h3>
        <div className="space-y-3">
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
