import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Home, Users, User, Settings, FileText, BarChart2, LogOut } from "lucide-react";
import { UserRole } from "@/types";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    user,
    logout,
    hasPermission
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };
  const getNavItems = () => {
    const items = [{
      name: "Tableau de bord",
      path: "/tableau-de-bord",
      icon: <Home className="w-5 h-5 mr-2" />,
      roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
    }, {
      name: "Dossiers",
      path: "/dossiers",
      icon: <FileText className="w-5 h-5 mr-2" />,
      roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
    }, {
      name: "Clients",
      path: "/clients",
      icon: <Users className="w-5 h-5 mr-2" />,
      roles: ["agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
    }, {
      name: "Statistiques",
      path: "/statistiques",
      icon: <BarChart2 className="w-5 h-5 mr-2" />,
      roles: ["agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
    }, {
      name: "Paramètres",
      path: "/parametres",
      icon: <Settings className="w-5 h-5 mr-2" />,
      roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
    }];
    return items.filter(item => hasPermission(item.roles));
  };
  return <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">i-numa</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
            {getNavItems().map(item => <Link key={item.path} to={item.path} className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                {item.icon}
                {item.name}
              </Link>)}
          </nav>

          <div className="hidden md:flex items-center">
            {user && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                      {user.prenom.charAt(0)}{user.nom.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
          </div>

          {/* Bouton menu mobile */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {getNavItems().map(item => <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => setMobileMenuOpen(false)}>
                {item.icon}
                {item.name}
              </Link>)}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user && <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {user.prenom.charAt(0)}{user.nom.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.prenom} {user.nom}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </>}
          </div>
        </div>}
    </header>;
};
export default Header;