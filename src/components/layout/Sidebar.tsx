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
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const navigate = useRouter().push;

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Navigation
        </h2>
        <div className="space-y-1">
          <Button
            variant={pathname === "/" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={pathname === "/clients" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/clients")}
          >
            <User2 className="mr-2 h-4 w-4" />
            Clients
          </Button>
          <Button
            variant={pathname === "/agents" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/agents")}
          >
            <Users className="mr-2 h-4 w-4" />
            Agents
          </Button>
          <Button
            variant={pathname === "/teams" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/teams")}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Equipes
          </Button>
          <Button
            variant={pathname === "/offres" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/offres")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Offres
          </Button>
          <Button
            variant={pathname === "/dossiers" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/dossiers")}
          >
            <File className="mr-2 h-4 w-4" />
            Dossiers
          </Button>
          <Button
            variant={pathname === "/rendez-vous" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/rendez-vous")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Rendez-vous
          </Button>
          <Button
            variant={pathname === "/tasks" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/tasks")}
          >
            <ListChecks className="mr-2 h-4 w-4" />
            Tâches
          </Button>
          <Button
            variant={pathname === "/statistiques" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/statistiques")}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Statistiques
          </Button>
          
          <Button
            variant={pathname === "/communications" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/communications")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Communications
          </Button>
          
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Paramètres
        </h2>
        <div className="space-y-1">
          <Button
            variant={pathname === "/settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
