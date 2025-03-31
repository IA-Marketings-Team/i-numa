
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
  Settings,
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
        name: "Paramètres",
        path: "/parametres",
        icon: <Settings className="size-4" />,
        roles: ["client", "agent_phoner", "agent_visio", "superviseur", "responsable"] as UserRole[]
      }
    ];
    
    return items.filter(item => hasPermission(item.roles));
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="px-3 py-2">
        <div className="text-lg font-semibold">Navigation</div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto">
        <SidebarMenu>
          {getNavItems().map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.path}
              >
                <Link to={item.path} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-2 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === "light" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
            <span>Mode {theme === "light" ? "clair" : "sombre"}</span>
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
