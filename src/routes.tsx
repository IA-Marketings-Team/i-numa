
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DashboardPage from "@/pages/DashboardPage";
import DossiersPage from "@/pages/DossiersPage";
import DossierDetailsPage from "@/pages/DossierDetailsPage";
import DossierNewPage from "@/pages/DossierNewPage";
import DossierEditPage from "@/pages/DossierEditPage";
import ClientsPage from "@/pages/ClientsPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ConsultationsPage from "@/pages/ConsultationsPage";
import DossierConsultationsPage from "@/pages/DossierConsultationsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute element={<DashboardPage />} />
      },
      {
        path: "tableau-de-bord",
        element: <ProtectedRoute element={<DashboardPage />} />
      },
      {
        path: "dossiers",
        element: <ProtectedRoute element={<DossiersPage />} />
      },
      {
        path: "dossiers/nouveau",
        element: <ProtectedRoute element={<DossierNewPage />} />
      },
      {
        path: "dossiers/:id",
        element: <ProtectedRoute element={<DossierDetailsPage />} />
      },
      {
        path: "dossiers/:id/edit",
        element: <ProtectedRoute element={<DossierEditPage />} />
      },
      {
        path: "dossiers/consultations",
        element: <ProtectedRoute element={<DossierConsultationsPage />} />
      },
      {
        path: "consultations",
        element: <ProtectedRoute element={<ConsultationsPage />} />
      },
      {
        path: "clients",
        element: <ProtectedRoute element={<ClientsPage />} />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  },
  {
    path: "/connexion",
    element: <LoginPage />
  }
]);
