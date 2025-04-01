
import React, { useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import NotificationsList, { Notification } from "./NotificationsList";
import { initialNotifications } from "@/data/mock/notifications";

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
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/notifications">Voir toutes les notifications</Link>
        </Button>
      </div>
    </PopoverContent>
  );
};

export default NotificationsPanel;
