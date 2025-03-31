
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Search, Plus } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

const Header = () => {
  const {
    user,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  return (
    <header className="bg-background border-b h-14 flex-shrink-0 sticky top-0 z-40 w-full">
      <div className="h-full px-4 w-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden mr-2" />
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">i-numa</span>
            </Link>
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
      </div>
    </header>
  );
};

export default Header;
