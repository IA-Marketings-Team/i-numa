
import React, { useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, CheckCircle, FileText, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
  link?: string;
  action?: string;
}

const NotificationsPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      description: "Notification supprimée",
    });
  };
  
  const filteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter(n => !n.read);
      case "all":
      default:
        return notifications;
    }
  };
  
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

  return (
    <PopoverContent align="end" className="w-[380px] p-0">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
          Tout marquer comme lu
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" className="text-xs">
              Toutes
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Non lues {unreadCount > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="m-0">
          <NotificationsList 
            notifications={filteredNotifications()} 
            onMarkAsRead={markAsRead} 
            onDelete={deleteNotification} 
          />
        </TabsContent>
        
        <TabsContent value="unread" className="m-0">
          <NotificationsList 
            notifications={filteredNotifications()} 
            onMarkAsRead={markAsRead} 
            onDelete={deleteNotification} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="p-2">
        <Button variant="outline" size="sm" className="w-full">
          Voir toutes les notifications
        </Button>
      </div>
    </PopoverContent>
  );
};

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationsList = ({ notifications, onMarkAsRead, onDelete }: NotificationsListProps) => {
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
    <div className="max-h-[350px] overflow-y-auto">
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <div 
            className={`flex gap-3 p-4 hover:bg-muted/50 transition-colors relative ${!notification.read ? 'bg-muted/30' : ''}`}
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

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouveau rendez-vous",
    description: "Un rendez-vous a été planifié avec Jean Dupont pour demain à 14h00",
    time: "Il y a 30 minutes",
    read: false,
    type: "info",
    link: "/dossiers/123",
    action: "Voir le dossier"
  },
  {
    id: "2",
    title: "Validation requise",
    description: "Le dossier #2458 requiert votre validation pour passer à l'étape suivante",
    time: "Il y a 2 heures",
    read: false,
    type: "warning",
    link: "/dossiers/2458",
    action: "Valider"
  },
  {
    id: "3",
    title: "Contrat signé",
    description: "Marie Martin a signé le contrat pour l'offre Premium",
    time: "Hier",
    read: true,
    type: "success",
    link: "/dossiers/987",
    action: "Consulter"
  },
  {
    id: "4",
    title: "Rappel de rendez-vous",
    description: "Vous avez un rendez-vous téléphonique avec Sophie Bernard demain à 10h00",
    time: "Hier",
    read: true,
    type: "info",
    link: "/dossiers/654",
    action: "Voir l'agenda"
  },
  {
    id: "5",
    title: "Mise à jour système",
    description: "Une mise à jour du système est prévue ce soir à 22h00. L'application sera indisponible pendant 30 minutes.",
    time: "Il y a 2 jours",
    read: true,
    type: "warning"
  }
];

export default NotificationsPanel;
