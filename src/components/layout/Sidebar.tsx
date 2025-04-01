import {
  CheckSquare,
  FolderOpen,
  HelpCircle,
  Home,
  Info,
  LogOut,
  Phone,
  Settings,
  ShoppingCart,
  Users,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Bell,
  BarChart,
} from "lucide-react";
import * as React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  link: string;
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathState = location.pathname.split("/")[1];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex h-screen w-[var(--sidebar-width)] flex-col border-r bg-secondary",
        "dark:bg-gray-900 dark:border-gray-700"
      )}
    >
      <div className="mb-4 px-3 pt-1 flex flex-col">
        <Link
          to="/tableau-de-bord"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathState === "tableau-de-bord" ? "bg-accent" : "transparent",
            "text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          Tableau de bord
        </Link>

        <Link
          to="/dossiers"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathState === "dossiers" ? "bg-accent" : "transparent",
            "text-foreground"
          )}
        >
          <FolderOpen className="h-5 w-5" />
          Dossiers
        </Link>

        {user?.role === "superviseur" || user?.role === "responsable" ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:text-primary">
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Équipes
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=open]:rotate-180" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/superviseur-equipes"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      pathState === "superviseur-equipes"
                        ? "bg-accent"
                        : "transparent",
                      "text-foreground"
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Gestion des équipes
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : null}

        <Link
          to="/taches"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathState === "taches" ? "bg-accent" : "transparent",
            "text-foreground"
          )}
        >
          <CheckSquare className="h-5 w-5" />
          Tâches
        </Link>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:text-primary">
              <div className="flex items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  Paramètres
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/mon-profil"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathState === "mon-profil" ? "bg-accent" : "transparent",
                    "text-foreground"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                  Mon profil
                </Link>
                <Link
                  to="/notifications"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathState === "notifications" ? "bg-accent" : "transparent",
                    "text-foreground"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                  Notifications
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
