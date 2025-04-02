
import { 
  BarChart, 
  UserCog, 
  Users, 
  FileText, 
  Package, 
  Home, 
  CalendarCheck, 
  User, 
  Phone,
  Mail,
  MessageSquare,
  ListChecks,
  Calendar,
  ShoppingCart
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
    id: 'mes-offres',
    title: 'Nos offres',
    path: '/mes-offres',
    icon: Package,
    permissions: ['client']
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
    id: 'appels',
    title: 'Appels',
    path: '/appels',
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
    id: 'statistiques',
    title: 'Statistiques',
    path: '/statistiques',
    icon: BarChart,
    permissions: ['superviseur', 'responsable']
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
