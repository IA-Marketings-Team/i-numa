
import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Check, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const NotificationPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'success':
        return <Check size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.filter(n => !n.read).length > 0 && (
            <Badge className="ml-2">
              {notifications.filter(n => !n.read).length} non lues
            </Badge>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={markAllAsRead}
          disabled={!notifications.some(n => !n.read)}
        >
          Marquer toutes comme lues
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">Aucune notification</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas encore de notifications. Elles apparaîtront ici lorsque vous en recevrez.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-colors ${notification.read ? 'bg-background' : 'bg-primary/5'}`}
            >
              <CardHeader className="py-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getIconForType(notification.type)}
                    <CardTitle className="text-base">{notification.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.date), { 
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-0 pb-3">
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
