
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen, onClose, ...props }: SidebarProps) {
  const location = useLocation();
  const { isMobile } = useSidebar();
  const { mainMenuItems, accountMenuItems } = useRoleBasedNavigation();
  const path = location.pathname;
  
  // Find active item based on current path
  const getActiveItem = (path: string) => {
    for (const item of [...mainMenuItems, ...accountMenuItems]) {
      if (path.startsWith(item.path)) {
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

  return (
    <div className={cn("flex flex-col h-full bg-background", className)} {...props}>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {mainMenuItems.length > 0 && (
            <>
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
            </>
          )}

          {accountMenuItems.length > 0 && (
            <>
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
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
