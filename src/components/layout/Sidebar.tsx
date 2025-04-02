
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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
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

  const menuItems = [
    {
      group: "Général",
      items: [
        {
          label: "Tableau de bord",
          icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
          path: "/tableau-de-bord",
          active: pathname === "/tableau-de-bord" || pathname === "/",
        },
      ]
    },
    {
      group: "Gestion des clients",
      items: [
        {
          label: "Clients",
          icon: <User2 className="mr-2 h-4 w-4" />,
          path: "/clients",
          active: pathname.startsWith("/clients"),
        },
        {
          label: "Agents",
          icon: <Users className="mr-2 h-4 w-4" />,
          path: "/agents",
          active: pathname.startsWith("/agents"),
        },
        {
          label: "Équipes",
          icon: <Building2 className="mr-2 h-4 w-4" />,
          path: "/teams",
          active: pathname.startsWith("/teams"),
        },
      ]
    },
    {
      group: "Gestion commerciale",
      items: [
        {
          label: "Offres",
          icon: <CreditCard className="mr-2 h-4 w-4" />,
          path: "/offres",
          active: pathname.startsWith("/offres"),
        },
        {
          label: "Dossiers",
          icon: <File className="mr-2 h-4 w-4" />,
          path: "/dossiers",
          active: pathname.startsWith("/dossiers"),
        },
        {
          label: "Rendez-vous",
          icon: <Calendar className="mr-2 h-4 w-4" />,
          path: "/rendez-vous",
          active: pathname.startsWith("/rendez-vous"),
        },
        {
          label: "Tâches",
          icon: <ListChecks className="mr-2 h-4 w-4" />,
          path: "/tasks",
          active: pathname.startsWith("/tasks"),
        },
      ]
    },
    {
      group: "Analyses",
      items: [
        {
          label: "Statistiques",
          icon: <BarChart className="mr-2 h-4 w-4" />,
          path: "/statistiques",
          active: pathname.startsWith("/statistiques"),
        },
        {
          label: "Communications",
          icon: <Mail className="mr-2 h-4 w-4" />,
          path: "/communications",
          active: pathname.startsWith("/communications"),
        },
      ]
    },
    {
      group: "Configuration",
      items: [
        {
          label: "Paramètres",
          icon: <Settings className="mr-2 h-4 w-4" />,
          path: "/settings",
          active: pathname.startsWith("/settings"),
        },
      ]
    }
  ];

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
