
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./components/layout/Layout";
import AuthGuard from "./components/auth/AuthGuard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ClientCreatePage from "./pages/ClientCreatePage";
import ClientEditPage from "./pages/ClientEditPage";
import DossiersPage from "./pages/DossiersPage";
import DossierDetailsPage from "./pages/DossierDetailsPage";
import DossierNewPage from "./pages/DossierNewPage";
import DossierEditPage from "./pages/DossierEditPage";
import AgendaPage from "./pages/AgendaPage";
import GlobalAgenda from "./pages/GlobalAgenda";
import ClientAgenda from "./pages/ClientAgenda";
import StatistiquesPage from "./pages/StatistiquesPage";
import OffresPage from "./pages/OffresPage";
import MesAgentsPage from "./pages/MesAgentsPage";
import ProfilePage from "./pages/ProfilePage";
import SuperviseurEquipes from "./pages/SuperviseurEquipes";
import SuperviseurEquipe from "./pages/SuperviseurEquipe";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AgentsPage from "./pages/AgentsPage";
import Index from "./pages/Index";
import DossierConsultationsPage from "./pages/dossierConsultations/DossierConsultationsPage";
import DossierCallPage from "./pages/DossierCallPage";
import DossierMeetingPage from "./pages/DossierMeetingPage";
import TasksPage from "./pages/TasksPage";
import AgentVisioPage from "./pages/AgentVisioPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProspectsPage from "./pages/ProspectsPage";
import Communications from "./pages/Communications";
import AppelsPage from "./pages/AppelsPage";
import StatsPage from "./pages/dashboard/StatsPage";

// Create a router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "tableau-de-bord",
        element: (
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        ),
      },
      {
        path: "clients",
        element: (
          <AuthGuard>
            <ClientsPage />
          </AuthGuard>
        ),
      },
      {
        path: "clients/nouveau",
        element: (
          <AuthGuard>
            <ClientCreatePage />
          </AuthGuard>
        ),
      },
      {
        path: "clients/:id",
        element: (
          <AuthGuard>
            <ClientDetailPage />
          </AuthGuard>
        ),
      },
      {
        path: "clients/:id/modifier",
        element: (
          <AuthGuard>
            <ClientEditPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers",
        element: (
          <AuthGuard>
            <DossiersPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers/nouveau",
        element: (
          <AuthGuard>
            <DossierNewPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers/:id",
        element: (
          <AuthGuard>
            <DossierDetailsPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers/:id/modifier",
        element: (
          <AuthGuard>
            <DossierEditPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers/:id/appel",
        element: (
          <AuthGuard>
            <DossierCallPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers/:id/rdv",
        element: (
          <AuthGuard>
            <DossierMeetingPage />
          </AuthGuard>
        ),
      },
      {
        path: "dossiers/consultations",
        element: (
          <AuthGuard>
            <DossierConsultationsPage />
          </AuthGuard>
        ),
      },
      {
        path: "agenda",
        element: (
          <AuthGuard>
            <AgendaPage />
          </AuthGuard>
        ),
      },
      {
        path: "agenda-global",
        element: (
          <AuthGuard>
            <GlobalAgenda />
          </AuthGuard>
        ),
      },
      {
        path: "agenda-client",
        element: (
          <AuthGuard>
            <ClientAgenda />
          </AuthGuard>
        ),
      },
      {
        path: "statistiques",
        element: (
          <AuthGuard>
            <StatistiquesPage />
          </AuthGuard>
        ),
      },
      {
        path: "dashboard/stats",
        element: (
          <AuthGuard>
            <StatsPage />
          </AuthGuard>
        ),
      },
      {
        path: "mes-offres",
        element: (
          <AuthGuard>
            <OffresPage />
          </AuthGuard>
        ),
      },
      {
        path: "mes-agents",
        element: (
          <AuthGuard>
            <MesAgentsPage />
          </AuthGuard>
        ),
      },
      {
        path: "profil",
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        ),
      },
      {
        path: "equipes",
        element: (
          <AuthGuard>
            <SuperviseurEquipes />
          </AuthGuard>
        ),
      },
      {
        path: "equipes/:id",
        element: (
          <AuthGuard>
            <SuperviseurEquipe />
          </AuthGuard>
        ),
      },
      {
        path: "agents",
        element: (
          <AuthGuard>
            <AgentsPage />
          </AuthGuard>
        ),
      },
      {
        path: "taches",
        element: (
          <AuthGuard>
            <TasksPage />
          </AuthGuard>
        ),
      },
      {
        path: "agent-visio",
        element: (
          <AuthGuard>
            <AgentVisioPage />
          </AuthGuard>
        ),
      },
      {
        path: "marketplace",
        element: (
          <AuthGuard>
            <MarketplacePage />
          </AuthGuard>
        ),
      },
      {
        path: "prospects",
        element: (
          <AuthGuard>
            <ProspectsPage />
          </AuthGuard>
        ),
      },
      {
        path: "communications",
        element: (
          <AuthGuard>
            <Communications />
          </AuthGuard>
        ),
      },
      {
        path: "appels",
        element: (
          <AuthGuard>
            <AppelsPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);
