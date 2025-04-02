
import {
  BarChart,
  Building2,
  Calendar,
  CreditCard,
  File,
  LayoutDashboard,
  ListChecks,
  Mail,
  Settings,
  User2,
  Users,
  ClipboardList,
  Headset,
  ShieldCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user, hasPermission } = useAuth();

  // Configuration des menus selon les rôles
  const getDashboardItems = () => {
    return [
      {
        label: "Tableau de bord",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
        path: "/tableau-de-bord",
        active: pathname === "/tableau-de-bord" || pathname === "/",
        roles: ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getClientItems = () => {
    return [
      {
        label: "Clients",
        icon: <User2 className="mr-2 h-4 w-4" />,
        path: "/clients",
        active: pathname.startsWith("/clients"),
        roles: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getDossiersItems = () => {
    return [
      {
        label: "Dossiers",
        icon: <File className="mr-2 h-4 w-4" />,
        path: "/dossiers",
        active: pathname.startsWith("/dossiers"),
        roles: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getOffresItems = () => {
    return [
      {
        label: "Offres",
        icon: <CreditCard className="mr-2 h-4 w-4" />,
        path: "/offres",
        active: pathname.startsWith("/offres"),
        roles: ['client', 'agent_phoner', 'agent_visio', 'supervisable', 'responsable'],
      }
    ];
  };

  const getRdvItems = () => {
    return [
      {
        label: "Rendez-vous",
        icon: <Calendar className="mr-2 h-4 w-4" />,
        path: "/rendez-vous",
        active: pathname.startsWith("/rendez-vous"),
        roles: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getTasksItems = () => {
    return [
      {
        label: "Tâches",
        icon: <ListChecks className="mr-2 h-4 w-4" />,
        path: "/tasks",
        active: pathname.startsWith("/tasks"),
        roles: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getCommunicationItems = () => {
    return [
      {
        label: "Communications",
        icon: <Mail className="mr-2 h-4 w-4" />,
        path: "/communications",
        active: pathname.startsWith("/communications"),
        roles: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getTeamItems = () => {
    return [
      {
        label: "Agents",
        icon: <Users className="mr-2 h-4 w-4" />,
        path: "/agents",
        active: pathname.startsWith("/agents"),
        roles: ['superviseur', 'responsable'],
      },
      {
        label: "Équipes",
        icon: <Building2 className="mr-2 h-4 w-4" />,
        path: "/teams",
        active: pathname.startsWith("/teams"),
        roles: ['superviseur', 'responsable'],
      }
    ];
  };

  const getAnalyticsItems = () => {
    return [
      {
        label: "Statistiques",
        icon: <BarChart className="mr-2 h-4 w-4" />,
        path: "/statistiques",
        active: pathname.startsWith("/statistiques"),
        roles: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  const getClientSupportItems = () => {
    return [
      {
        label: "Support client",
        icon: <Headset className="mr-2 h-4 w-4" />,
        path: "/support",
        active: pathname.startsWith("/support"),
        roles: ['client'],
      }
    ];
  };

  const getConfigItems = () => {
    return [
      {
        label: "Paramètres",
        icon: <Settings className="mr-2 h-4 w-4" />,
        path: "/settings",
        active: pathname.startsWith("/settings"),
        roles: ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable'],
      }
    ];
  };

  // Construction du menu en fonction du rôle
  const buildMenu = () => {
    const menuGroups = [];

    // Section Général - pour tous les rôles
    menuGroups.push({
      group: "Général",
      items: getDashboardItems().filter(item => hasPermission(item.roles))
    });

    // Section Client - uniquement pour les rôles agent_phoner, agent_visio, superviseur, responsable
    if (hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])) {
      menuGroups.push({
        group: "Gestion des clients",
        items: [
          ...getClientItems(),
          ...getDossiersItems()
        ].filter(item => hasPermission(item.roles))
      });
    }

    // Section Offres et Rendez-vous
    const businessItems = [
      ...getOffresItems(),
      ...getRdvItems(),
      ...getTasksItems(),
      ...getCommunicationItems()
    ].filter(item => hasPermission(item.roles));

    if (businessItems.length > 0) {
      menuGroups.push({
        group: "Gestion commerciale",
        items: businessItems
      });
    }

    // Section Équipe - uniquement pour superviseur et responsable
    if (hasPermission(['superviseur', 'responsable'])) {
      menuGroups.push({
        group: "Gestion d'équipe",
        items: getTeamItems().filter(item => hasPermission(item.roles))
      });
    }

    // Section Analyses
    const analyticsItems = getAnalyticsItems().filter(item => hasPermission(item.roles));
    if (analyticsItems.length > 0) {
      menuGroups.push({
        group: "Analyses",
        items: analyticsItems
      });
    }

    // Section Support client - uniquement pour le client
    if (hasPermission(['client'])) {
      menuGroups.push({
        group: "Support",
        items: getClientSupportItems()
      });
    }

    // Section Configuration - pour tous les rôles
    menuGroups.push({
      group: "Configuration",
      items: getConfigItems().filter(item => hasPermission(item.roles))
    });

    return menuGroups;
  };

  const menuItems = buildMenu();

  return (
    <div className="h-full border-r bg-background">
      <SidebarContent className="px-2 py-2">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={item.active}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </div>
  );
}
