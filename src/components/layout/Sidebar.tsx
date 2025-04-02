
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart, 
  UserCog, 
  Users, 
  FileText, 
  Package, 
  Settings, 
  Home, 
  CalendarCheck, 
  User, 
  Phone,
  Mail,
  MessageSquare,
  ListChecks
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen, onClose, ...props }: SidebarProps) {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const [activeItem, setActiveItem] = useState<string>("");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/tableau-de-bord')) setActiveItem('tableau-de-bord');
    else if (path.includes('/dossiers')) setActiveItem('dossiers');
    else if (path.includes('/clients')) setActiveItem('clients');
    else if (path.includes('/mes-offres')) setActiveItem('mes-offres');
    else if (path.includes('/statistiques')) setActiveItem('statistiques');
    else if (path.includes('/equipes')) setActiveItem('equipes');
    else if (path.includes('/profil')) setActiveItem('profil');
    else if (path.includes('/parametres')) setActiveItem('parametres');
    else if (path.includes('/taches')) setActiveItem('taches');
    else if (path.includes('/appels')) setActiveItem('appels');
    else if (path.includes('/communications')) setActiveItem('communications');
  }, [location]);

  const handleItemClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)} {...props}>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <div className="text-muted-foreground text-sm font-medium px-2 py-1">
            Menu principal
          </div>
          <Button
            variant={activeItem === 'tableau-de-bord' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeItem === 'tableau-de-bord' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
            asChild
            onClick={handleItemClick}
          >
            <Link to="/tableau-de-bord">
              <Home className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>

          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'dossiers' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'dossiers' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/dossiers">
                <FileText className="mr-2 h-4 w-4" />
                Dossiers
              </Link>
            </Button>
          )}

          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'clients' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'clients' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/clients">
                <Users className="mr-2 h-4 w-4" />
                Clients
              </Link>
            </Button>
          )}

          {user?.role === 'client' && (
            <Button
              variant={activeItem === 'mes-offres' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'mes-offres' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/mes-offres">
                <Package className="mr-2 h-4 w-4" />
                Nos offres
              </Link>
            </Button>
          )}

          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'taches' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'taches' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/taches">
                <ListChecks className="mr-2 h-4 w-4" />
                Tâches
              </Link>
            </Button>
          )}

          {hasPermission(['agent_phoner', 'superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'appels' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'appels' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/appels">
                <Phone className="mr-2 h-4 w-4" />
                Appels
              </Link>
            </Button>
          )}

          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'communications' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'communications' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/communications">
                <MessageSquare className="mr-2 h-4 w-4" />
                Communications
              </Link>
            </Button>
          )}

          {hasPermission(['superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'statistiques' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'statistiques' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/statistiques">
                <BarChart className="mr-2 h-4 w-4" />
                Statistiques
              </Link>
            </Button>
          )}

          <div className="mt-6 text-muted-foreground text-sm font-medium px-2 py-1">
            Mon compte
          </div>
          
          <Button
            variant={activeItem === 'profil' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeItem === 'profil' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
            asChild
            onClick={handleItemClick}
          >
            <Link to="/profil">
              <User className="mr-2 h-4 w-4" />
              Profil
            </Link>
          </Button>
          
          {hasPermission(['superviseur', 'responsable'] as UserRole[]) && (
            <Button
              variant={activeItem === 'equipes' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeItem === 'equipes' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
              asChild
              onClick={handleItemClick}
            >
              <Link to="/superviseur/equipes">
                <UserCog className="mr-2 h-4 w-4" />
                Gestion d'équipe
              </Link>
            </Button>
          )}
          
          <Button
            variant={activeItem === 'parametres' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeItem === 'parametres' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
            asChild
            onClick={handleItemClick}
          >
            <Link to="/parametres">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
