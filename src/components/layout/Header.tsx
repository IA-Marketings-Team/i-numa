
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Search, Plus, ChevronLeft } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  // Déterminer le titre de la page en fonction de l'URL
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/tableau-de-bord')) return 'Tableau de bord';
    if (path.includes('/dossiers')) return 'Dossiers';
    if (path.includes('/clients')) return 'Clients';
    if (path.includes('/mes-offres')) return 'Mes offres';
    if (path.includes('/statistiques')) return 'Statistiques';
    if (path.includes('/parametres')) return 'Paramètres';
    return '';
  };

  // Déterminer si on doit afficher un bouton de retour
  const shouldShowBackButton = () => {
    return location.pathname !== '/tableau-de-bord' && 
           location.pathname !== '/dossiers' && 
           location.pathname !== '/clients' && 
           location.pathname !== '/mes-offres' && 
           location.pathname !== '/statistiques' && 
           location.pathname !== '/parametres';
  };

  return (
    <header className="border-b h-14 sticky top-0 z-40 w-full bg-white dark:bg-gray-800">
      <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            {shouldShowBackButton() && (
              <>
                <span className="text-sm text-muted-foreground">
                  {getPageTitle()}
                </span>
                <span className="text-sm text-muted-foreground">/</span>
              </>
            )}
            <span className="text-lg font-semibold">
              {shouldShowBackButton() ? location.pathname.split('/').pop() : getPageTitle()}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 bg-muted/50 border-muted"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-1"
            onClick={() => navigate("/dossiers/nouveau")}
          >
            <Plus className="h-4 w-4" />
            <span>Créer</span>
          </Button>
          
          <CartDrawer />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => navigate("/parametres")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
