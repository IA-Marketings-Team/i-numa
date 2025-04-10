
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import DossiersPage from "@/pages/DossiersPage";
import DossierDetailsPage from "@/pages/DossierDetailsPage";
import DossierNewPage from "@/pages/DossierNewPage";
import DossierEditPage from "@/pages/DossierEditPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientDetail from "@/pages/ClientDetailPage";
import ClientCreatePage from "@/pages/ClientCreatePage";
import ClientEditPage from "@/pages/ClientEditPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ConsultationsPage from "@/pages/ConsultationsPage";
import MigrationPage from "@/pages/MigrationPage";
import DossierConsultationsPage from "@/pages/dossierConsultations/DossierConsultationsPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import Index from "@/pages/Index";
import ProfilePage from "@/pages/ProfilePage";
import AgendaPage from "@/pages/AgendaPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "/connexion",
        element: <LoginPage />
      },
      {
        path: "non-autorise",
        element: <UnauthorizedPage />
      },
      {
        path: "tableau-de-bord",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
      },
      {
        path: "dossiers",
        element: <ProtectedRoute><DossiersPage /></ProtectedRoute>
      },
      {
        path: "dossiers/nouveau",
        element: <ProtectedRoute><DossierNewPage /></ProtectedRoute>
      },
      {
        path: "dossiers/:id",
        element: <ProtectedRoute><DossierDetailsPage /></ProtectedRoute>
      },
      {
        path: "dossiers/:id/edit",
        element: <ProtectedRoute><DossierEditPage /></ProtectedRoute>
      },
      {
        path: "dossiers/consultations",
        element: <ProtectedRoute roles={['superviseur', 'responsable']}><DossierConsultationsPage /></ProtectedRoute>
      },
      {
        path: "consultations",
        element: <ProtectedRoute roles={['superviseur', 'responsable']}><ConsultationsPage /></ProtectedRoute>
      },
      {
        path: "clients",
        element: <ProtectedRoute><ClientsPage /></ProtectedRoute>
      },
      {
        path: "clients/nouveau",
        element: <ProtectedRoute><ClientCreatePage /></ProtectedRoute>
      },
      {
        path: "clients/:id",
        element: <ProtectedRoute><ClientDetail /></ProtectedRoute>
      },
      {
        path: "clients/:id/edit",
        element: <ProtectedRoute><ClientEditPage /></ProtectedRoute>
      },
      {
        path: "migration",
        element: <ProtectedRoute roles={['superviseur', 'responsable']}><MigrationPage /></ProtectedRoute>
      },
      {
        path: "profil",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: "agenda",
        element: <ProtectedRoute><AgendaPage /></ProtectedRoute>
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);
