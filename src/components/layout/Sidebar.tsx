
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
} from "@/components/ui/sidebar";
import { 
  Home, 
  FileText, 
  Users, 
  ShoppingBag, 
  BarChart2, 
  User,
  Sun,
  Moon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UserRole } from "@/types";

export default function Sidebar() {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
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
        name: "Mes offres",
        path: "/mes-offres",
        icon: <ShoppingBag className="size-4" />,
        roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }, 
      {
        name: "Statistiques",
        path: "/statistiques",
        icon: <BarChart2 className="size-4" />,
        roles: ["agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }, 
      {
        name: "Mon compte",
        path: "/parametres",
        icon: <User className="size-4" />,
        roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }
    ];
    
    return items.filter(item => hasPermission(item.roles));
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/tableau-de-bord' && location.pathname.startsWith(path));
  };

  return (
    <SidebarComponent className="border-r h-screen">
      <SidebarHeader className="px-3 py-3 border-b">
        <div className="text-lg font-semibold">Navigation</div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto flex-1">
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
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-3 border-t mt-auto">
        <div className="flex items-center justify-between">
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
      </SidebarFooter>
    </SidebarComponent>
  );
}
