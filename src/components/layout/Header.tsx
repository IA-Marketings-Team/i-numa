import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Search, Plus, ChevronLeft, Bell, Settings, HelpCircle, UserCircle, CreditCard } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import HelpDialog from "@/components/support/HelpDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isClient = user?.role === 'client';
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  useEffect(() => {
    console.log("[Header] Component initialized:", { 
      currentPath: location.pathname,
      userRole: user?.role
    });
  }, [location.pathname, user]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/tableau-de-bord')) return 'Tableau de bord';
    if (path.includes('/dossiers')) return 'Dossiers';
    if (path.includes('/clients')) return 'Clients';
    if (path.includes('/mes-offres')) return 'Nos offres';
    if (path.includes('/statistiques')) return 'Statistiques';
    if (path.includes('/parametres')) return 'Paramètres';
    return '';
  };

  const shouldShowBackButton = () => {
    return location.pathname !== '/tableau-de-bord' && 
           location.pathname !== '/dossiers' && 
           location.pathname !== '/clients' && 
           location.pathname !== '/mes-offres' && 
           location.pathname !== '/statistiques' && 
           location.pathname !== '/parametres';
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    if (pathSegments.length === 1 && pathSegments[0] === 'tableau-de-bord') {
      return null;
    }
    
    const segmentLabels: Record<string, string> = {
      'tableau-de-bord': 'Tableau de bord',
      'dossiers': 'Dossiers',
      'clients': 'Clients',
      'mes-offres': 'Mes offres',
      'statistiques': 'Statistiques',
      'parametres': 'Paramètres',
      'nouveau': 'Nouveau',
      'edit': 'Modifier'
    };
    
    return (
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link to="/tableau-de-bord" className="hover:text-foreground">
          Accueil
        </Link>
        
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          
          const isId = !segmentLabels[segment] && segment !== 'tableau-de-bord';
          
          return (
            <span key={path}>
              <span className="mx-2">/</span>
              {!isLast ? (
                <Link to={path} className="hover:text-foreground">
                  {segmentLabels[segment] || (isId ? 'Détail' : segment)}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {segmentLabels[segment] || (isId ? 'Détail' : segment)}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    );
  };

  const handleCreateButtonClick = () => {
    console.log("[Header] Create button clicked, navigating to /dossiers/nouveau");
    navigate("/dossiers/nouveau");
  };

  const handleLogout = async () => {
    console.log("[Header] Logging out user");
    await logout();
    navigate("/connexion");
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <header className="border-b sticky top-0 z-40 w-full bg-card">
      <div className="flex h-16 px-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden mr-2" />
          {shouldShowBackButton() && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">
              {getPageTitle()}
            </h1>
            {getBreadcrumbs()}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-60 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 h-9 bg-muted/50 border-muted"
            />
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-1"
            onClick={handleCreateButtonClick}
          >
            <Plus className="h-4 w-4" />
            <span>Créer</span>
          </Button>
          
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  2
                </span>
              </Button>
            </PopoverTrigger>
            <NotificationsPanel />
          </Popover>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setHelpDialogOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {isClient && <CartDrawer />}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 flex items-center gap-2 font-normal">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={`${user?.prenom} ${user?.nom}`} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block">
                  {user?.prenom} {user?.nom}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profil")}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/parametres")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              {isClient && (
                <DropdownMenuItem onClick={() => navigate("/mes-offres")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Mes offres</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </header>
  );
};

export default Header;
