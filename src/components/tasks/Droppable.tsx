
import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`${isOver ? 'ring-2 ring-primary ring-opacity-50' : ''} rounded-lg transition-all`}
    >
      {children}
    </div>
  );
};
