
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  
  // Improved active item detection to handle nested paths better
  const getActiveItem = (path: string) => {
    // First check for exact matches
    for (const item of [...mainMenuItems, ...accountMenuItems]) {
      if (path === item.path) {
        return item.id;
      }
    }
    
    // Then check for parent paths
    for (const item of [...mainMenuItems, ...accountMenuItems]) {
      // Skip root path to avoid it being active for all paths
      if (item.path !== '/' && path.startsWith(item.path + '/')) {
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
    <div className={cn("flex flex-col h-full bg-sidebar-gradient text-white", className)} {...props}>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {mainMenuItems.length > 0 && (
            <>
              <div className="text-white/70 text-sm font-medium px-2 py-1">
                Menu principal
              </div>
              
              {mainMenuItems.map(item => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeItem === item.id 
                      ? 'bg-inuma-red text-white hover:bg-inuma-lightRed hover:text-white' 
                      : 'text-white hover:bg-white/10'
                  }`}
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
              <div className="mt-6 text-white/70 text-sm font-medium px-2 py-1">
                Mon compte
              </div>
              
              {accountMenuItems.map(item => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeItem === item.id 
                      ? 'bg-inuma-red text-white hover:bg-inuma-lightRed hover:text-white' 
                      : 'text-white hover:bg-white/10'
                  }`}
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
