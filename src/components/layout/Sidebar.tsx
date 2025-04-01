
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { 
  Home, 
  FileText, 
  Users, 
  ShoppingBag, 
  BarChart2, 
  User,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UserRole } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HelpDialog from "@/components/support/HelpDialog";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  const getNavItems = () => {
    const items = [
      {
        name: "Tableau de bord",
        path: "/tableau-de-bord",
        icon: <Home className="size-4" />,
        roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }, 
      {
        name: "Dossiers",
        path: "/dossiers",
        icon: <FileText className="size-4" />,
        roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }, 
      {
        name: "Clients",
        path: "/clients",
        icon: <Users className="size-4" />,
        roles: ["agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }, 
      {
        name: "Nos offres",
        path: "/mes-offres",
        icon: <ShoppingBag className="size-4" />,
        roles: ["client", "agent_phoner", "responsable"] as UserRole[]
      }, 
      {
        name: "Statistiques",
        path: "/statistiques",
        icon: <BarChart2 className="size-4" />,
        roles: ["agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }
    ];
    
    return items.filter(item => hasPermission(item.roles));
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/tableau-de-bord' && location.pathname.startsWith(path));
  };

  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };
  
  const handleOpenHelpDialog = () => {
    setHelpDialogOpen(true);
  };

  return (
    <>
      <SidebarComponent className="border-r">
        <SidebarHeader className="flex items-center justify-center py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              i
            </div>
            <div className="text-lg font-semibold">i-numa</div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="overflow-y-auto flex-1">
          <SidebarGroup className="pt-2">
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {getNavItems().map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.path)}
                      className="py-2"
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Paramètres</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive("/parametres")}
                    className="py-2"
                  >
                    <Link to="/parametres" className="flex items-center gap-3">
                      <Settings className="size-4" />
                      <span>Paramètres</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="py-2"
                    onClick={handleOpenHelpDialog}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="size-4" />
                      <span>Aide</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t mt-auto">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "light" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span className="text-sm">Mode {theme === "light" ? "clair" : "sombre"}</span>
            </div>
            <Switch 
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>

          {user && (
            <div className="p-3 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="size-4" />
                </button>
              </div>
            </div>
          )}
        </SidebarFooter>
      </SidebarComponent>
      
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </>
  );
}
