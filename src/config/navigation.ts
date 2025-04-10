
import { 
  BarChart, 
  UserCog, 
  Users, 
  FileText, 
  Home, 
  CalendarCheck, 
  User, 
  Phone,
  MessageSquare,
  ListChecks,
  Calendar,
  ShoppingCart,
  BookUser,
  UserPlus,
  Eye
} from "lucide-react";
import { UserRole } from "@/types";

interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: any;
  permissions: UserRole[];
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'tableau-de-bord',
    title: 'Tableau de bord',
    path: '/tableau-de-bord',
    icon: Home,
    permissions: ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'dossiers',
    title: 'Dossiers',
    path: '/dossiers',
    icon: FileText,
    permissions: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'clients',
    title: 'Clients',
    path: '/clients',
    icon: Users,
    permissions: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'annuaire',
    title: 'Annuaire',
    path: '/annuaire',
    icon: BookUser,
    permissions: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    path: '/marketplace',
    icon: ShoppingCart,
    permissions: ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'agenda-global',
    title: 'Agenda global',
    path: '/agenda-global',
    icon: Calendar,
    permissions: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'agenda',
    title: 'Mes rendez-vous',
    path: '/agenda',
    icon: CalendarCheck,
    permissions: ['client']
  },
  {
    id: 'taches',
    title: 'Tâches',
    path: '/taches',
    icon: ListChecks,
    permissions: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'prospects',
    title: 'Prospects',
    path: '/prospects',
    icon: Phone,
    permissions: ['agent_phoner', 'superviseur', 'responsable']
  },
  {
    id: 'communications',
    title: 'Communications',
    path: '/communications',
    icon: MessageSquare,
    permissions: ['agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'consultations',
    title: 'Consultations',
    path: '/consultations',
    icon: Eye,
    permissions: ['superviseur', 'responsable']
  },
  {
    id: 'statistiques',
    title: 'Statistiques',
    path: '/statistiques',
    icon: BarChart,
    permissions: ['superviseur', 'responsable']
  },
  {
    id: 'mes-agents',
    title: 'Mes agents',
    path: '/mes-agents',
    icon: UserPlus,
    permissions: ['client']
  },
  {
    id: 'profil',
    title: 'Profil',
    path: '/profil',
    icon: User,
    permissions: ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable']
  },
  {
    id: 'equipes',
    title: 'Gestion d\'équipe',
    path: '/superviseur/equipes',
    icon: UserCog,
    permissions: ['superviseur', 'responsable']
  }
];
