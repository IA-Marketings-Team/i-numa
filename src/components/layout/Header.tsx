
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Search, Plus, ChevronLeft, Bell, Settings } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtenir le titre de la page en fonction de l'URL
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

  // Générer le fil d'Ariane (breadcrumb)
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    // Ne pas afficher de breadcrumb pour la page d'accueil
    if (pathSegments.length === 1 && pathSegments[0] === 'tableau-de-bord') {
      return null;
    }
    
    // Traduire les segments de chemin en noms lisibles
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
          // Construire le chemin jusqu'à ce segment
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          
          // Vérifier si le segment est un ID (non présent dans notre mapping)
          const isId = !segmentLabels[segment] && segment !== 'tableau-de-bord';
          
          // Si c'est le dernier segment ou un ID, ne pas en faire un lien
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
            onClick={() => navigate("/dossiers/nouveau")}
          >
            <Plus className="h-4 w-4" />
            <span>Créer</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              2
            </span>
          </Button>
          
          <CartDrawer />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/parametres")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
