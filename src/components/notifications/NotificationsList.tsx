
import React from "react";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, CheckCircle, FileText, User, X } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
  link?: string;
  action?: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  expanded?: boolean;
}

const NotificationsList = ({ 
  notifications, 
  onMarkAsRead, 
  onDelete,
  expanded = false 
}: NotificationsListProps) => {
  const getIconForType = (type: Notification["type"]) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };
  
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
        <p className="text-sm text-muted-foreground">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className={expanded ? "" : "max-h-[350px] overflow-y-auto"}>
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <div 
            className={`flex gap-3 p-4 hover:bg-muted/50 transition-colors relative group ${!notification.read ? 'bg-muted/30' : ''}`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="shrink-0">
              {getIconForType(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{notification.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground">{notification.time}</span>
                {notification.action && (
                  <>
                    <Separator orientation="vertical" className="h-3" />
                    <a href={notification.link} className="text-xs text-primary hover:underline">
                      {notification.action}
                    </a>
                  </>
                )}
              </div>
            </div>
            <button 
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-full p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {!notification.read && (
              <div className="absolute top-4 right-3 w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
          {index < notifications.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationsList;
