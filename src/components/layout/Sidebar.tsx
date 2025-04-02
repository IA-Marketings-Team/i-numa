
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { navigationConfig } from "@/config/navigation";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen, onClose, ...props }: SidebarProps) {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const { isMobile } = useSidebar();
  const path = location.pathname;
  
  // Find active item based on current path
  const getActiveItem = (path: string) => {
    for (const item of navigationConfig) {
      if (path.includes(item.path)) {
        return item.id;
      }
    }
    return '';
  };
  
  const activeItem = getActiveItem(path);

  const handleItemClick = () => {
    if (onClose && isMobile) {
      onClose();
    }
  };

  // Filter menu items based on user permissions
  const mainMenuItems = navigationConfig.filter(item => 
    user && hasPermission(item.permissions) && 
    ['tableau-de-bord', 'dossiers', 'clients', 'mes-offres', 'agenda-global', 'agenda', 'taches', 'appels', 'communications', 'statistiques'].includes(item.id)
  );

  const accountMenuItems = navigationConfig.filter(item => 
    user && hasPermission(item.permissions) && 
    ['profil', 'equipes'].includes(item.id)
  );

  return (
    <div className={cn("flex flex-col h-full bg-background", className)} {...props}>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <div className="text-muted-foreground text-sm font-medium px-2 py-1">
            Menu principal
          </div>
          
          {mainMenuItems.map(item => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === item.id ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to={item.path}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}

          <div className="mt-6 text-muted-foreground text-sm font-medium px-2 py-1">
            Mon compte
          </div>
          
          {accountMenuItems.map(item => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === item.id ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to={item.path}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
