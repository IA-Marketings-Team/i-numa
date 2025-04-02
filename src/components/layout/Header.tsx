
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Search, Plus, ChevronLeft, Bell, Settings, HelpCircle, UserCircle, CreditCard, ShoppingCart } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import HelpDialog from "@/components/support/HelpDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    if (path.includes('/marketplace')) return 'Marketplace';
    if (path.includes('/statistiques')) return 'Statistiques';
    if (path.includes('/parametres')) return 'Paramètres';
    if (path.includes('/agenda-global')) return 'Agenda global';
    if (path.includes('/agenda')) return 'Mes rendez-vous';
    if (path.includes('/appels')) return 'Appels';
    if (path.includes('/communications')) return 'Communications';
    return '';
  };

  const shouldShowBackButton = () => {
    return location.pathname !== '/tableau-de-bord' && 
           location.pathname !== '/dossiers' && 
           location.pathname !== '/clients' && 
           location.pathname !== '/mes-offres' && 
           location.pathname !== '/marketplace' && 
           location.pathname !== '/statistiques' && 
           location.pathname !== '/parametres' &&
           location.pathname !== '/agenda-global' &&
           location.pathname !== '/agenda' &&
           location.pathname !== '/appels' &&
           location.pathname !== '/communications';
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
      'mes-offres': 'Nos offres',
      'marketplace': 'Marketplace',
      'statistiques': 'Statistiques',
      'parametres': 'Paramètres',
      'nouveau': 'Nouveau',
      'modifier': 'Modifier',
      'agenda-global': 'Agenda global',
      'agenda': 'Mes rendez-vous',
      'appels': 'Appels',
      'communications': 'Communications'
    };
    
    const processedIds = new Set<string>();
    
    return (
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link to="/tableau-de-bord" className="hover:text-foreground">
          Accueil
        </Link>
        
        {pathSegments.map((segment, index) => {
          const isId = !segmentLabels[segment] && segment !== 'tableau-de-bord';
          
          if (isId && processedIds.has('detail')) {
            return null;
          }
          
          if (isId) {
            processedIds.add('detail');
          }
          
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          
          const label = segmentLabels[segment] || (isId ? 'Détail' : segment);
          
          return (
            <span key={path}>
              <span className="mx-2">/</span>
              {!isLast ? (
                <Link to={path} className="hover:text-foreground">
                  {label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    );
  };

  const handleMarketplaceClick = () => {
    navigate("/marketplace");
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

  return (
    <header className="border-b sticky top-0 z-40 w-full bg-header-gradient text-white">
      <div className="flex h-16 px-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden mr-2 text-white hover:bg-white/10" />
          {shouldShowBackButton() && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white">
              {getPageTitle()}
            </h1>
            <div className="text-white/70">
              {getBreadcrumbs()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-60 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 h-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
            />
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-1 border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={handleCreateButtonClick}
          >
            <Plus className="h-4 w-4" />
            <span>Créer</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-1 border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={handleMarketplaceClick}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Marketplace</span>
          </Button>
          
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-inuma-red text-[10px] text-white">
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
            className="text-white hover:bg-white/10"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {isClient && <CartDrawer />}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 flex items-center gap-2 font-normal text-white hover:bg-white/10">
                <Avatar>
                  <AvatarFallback className="bg-inuma-red text-white">
                    {user?.prenom?.charAt(0) ?? ''}{user?.nom?.charAt(0) ?? ''}
                  </AvatarFallback>
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
              <DropdownMenuItem onClick={() => navigate("/marketplace")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Marketplace</span>
              </DropdownMenuItem>
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
