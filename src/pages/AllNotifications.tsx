
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, CheckCircle, FileText, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Notification } from "@/components/notifications/NotificationsList";

// Importing our notification list component
import NotificationsList from "@/components/notifications/NotificationsList";
import { initialNotifications } from "@/data/mock/notifications";

const AllNotificationsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Consultez et gérez toutes vos notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button onClick={markAllAsRead}>Tout marquer comme lu</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Centre de notifications</CardTitle>
          <CardDescription>
            Vous avez {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="all">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="unread">
                Non lues {unreadCount > 0 && <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <NotificationsList 
                notifications={filteredNotifications()} 
                onMarkAsRead={markAsRead} 
                onDelete={deleteNotification}
                expanded={true}
              />
            </TabsContent>
            
            <TabsContent value="unread" className="mt-4">
              <NotificationsList 
                notifications={filteredNotifications()} 
                onMarkAsRead={markAsRead} 
                onDelete={deleteNotification}
                expanded={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllNotificationsPage;
