import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import AuthLayout from "@/layouts/AuthLayout";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { AuthProvider } from "@/contexts/AuthContext";
import DossierListPage from "@/pages/DossierList";
import DossierEdit from "@/pages/DossierEdit";
import DossierDetailsPage from "@/pages/DossierDetailsPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientEditPage from "@/pages/ClientEditPage";
import MarketplacePage from "@/pages/MarketplacePage";
import OffrePage from "@/pages/OffrePage";
import UsersPage from "@/pages/UsersPage";
import UserEditPage from "@/pages/UserEditPage";
import CommunicationPage from "@/pages/CommunicationPage";
import MarketplaceEntryPage from "@/pages/MarketplaceEntryPage";
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

// Define routes
const router = createBrowserRouter([
  // Entrée du marketplace
  {
    path: "/marketplace-entry",
    element: <MarketplaceEntryPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/dossiers",
    element: <DossierListPage />,
  },
  {
    path: "/dossiers/nouveau",
    element: <DossierEdit />,
  },
  {
    path: "/dossiers/:id",
    element: <DossierDetailsPage />,
  },
  {
    path: "/dossiers/:id/modifier",
    element: <DossierEdit />,
  },
  {
    path: "/clients",
    element: <ClientsPage />,
  },
  {
    path: "/clients/nouveau",
    element: <ClientEditPage />,
  },
  {
    path: "/clients/:id",
    element: <ClientEditPage />,
  },
  {
    path: "/clients/:id/modifier",
    element: <ClientEditPage />,
  },
  {
    path: "/marketplace",
    element: <MarketplacePage />,
  },
  {
    path: "/offres",
    element: <OffrePage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/users/:id",
    element: <UserEditPage />,
  },
  {
    path: "/users/:id/modifier",
    element: <UserEditPage />,
  },
   {
    path: "/communications",
    element: <CommunicationPage />,
  },
]);

export default App;
