import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import AboutUsPage from './pages/AboutUsPage';
import MarketplacePage from './pages/MarketplacePage';
import NotificationPage from './pages/NotificationPage';
import TasksPage from './pages/TasksPage';
import DossiersPage from './pages/DossiersPage';
import DossierDetailsPage from './pages/DossierDetailsPage';
import DossierEditPage from './pages/DossierEditPage';
import GlobalAgenda from './pages/GlobalAgenda';
import Communications from './pages/Communications';
import ClientAgenda from './pages/ClientAgenda';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AuthProvider from './contexts/AuthContext';
import CartProvider from './contexts/CartContext';
import NotificationProvider from './contexts/NotificationContext';
import ClientAgendaPage from './pages/ClientAgendaPage';
import SuperviseurDashboardPage from './pages/SuperviseurDashboardPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <ThemeProvider defaultTheme="light" storageKey="inuma-ui-theme">
        <NotificationProvider>
          <CartProvider>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
              </QueryClientProvider>
              <Toaster />
            </AuthProvider>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </div>
  );
}

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/connexion",
    element: <LoginPage />,
  },
  {
    path: "/inscription",
    element: <RegisterPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/tarifs",
    element: <PricingPage />,
  },
  {
    path: "/a-propos",
    element: <AboutUsPage />,
  },
  {
    path: "/marketplace",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <MarketplacePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <NotificationPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/taches",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <TasksPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dossiers",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DossiersPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dossiers/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DossierDetailsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dossiers/:id/edit",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DossierEditPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agenda",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <GlobalAgenda />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/communications",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Communications />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tableau-de-bord",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agenda-client",
    element: (
      <ProtectedRoute roles={["client"]}>
        <DashboardLayout>
          <ClientAgendaPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/supervision",
    element: (
      <ProtectedRoute roles={["superviseur"]}>
        <DashboardLayout>
          <SuperviseurDashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/non-autorise",
    element: <ErrorPage title="Non autorisé" message="Vous n'avez pas les permissions nécessaires pour accéder à cette page." />,
  },
]);

export default App;
