
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface TaskDragProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const TaskDrag: React.FC<TaskDragProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <TaskCard 
        task={task} 
        onClick={onClick}
      />
    </div>
  );
};

export default TaskDrag;
