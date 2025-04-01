
import React from "react";
import { Task } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "to_do":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-orange-100 text-orange-800";
    case "done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: Task["status"]) => {
  switch (status) {
    case "to_do":
      return "À faire";
    case "in_progress":
      return "En cours";
    case "done":
      return "Terminé";
    default:
      return status;
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(task)}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
        )}
        <Badge className={`${getStatusColor(task.status)} mt-1`}>
          {getStatusLabel(task.status)}
        </Badge>
      </CardContent>
      <CardFooter className="border-t pt-2 text-xs text-muted-foreground">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {task.date_creation && format(new Date(task.date_creation), "dd MMM yyyy", { locale: fr })}
          </div>
          {task.date_echeance && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(task.date_echeance), "dd MMM yyyy", { locale: fr })}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
