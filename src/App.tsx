import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import RestrictedOverlay from "@/components/onboarding/RestrictedOverlay";
import DossiersPage from "@/pages/DossiersPage";
import DossierDetailsPage from "@/pages/DossierDetailsPage";
import DossierCreatePage from "@/pages/DossierCreatePage";
import ClientsPage from "@/pages/ClientsPage";
import ClientDetailsPage from "@/pages/ClientDetailsPage";
import ClientCreatePage from "@/pages/ClientCreatePage";
import UsersPage from "@/pages/UsersPage";
import UserDetailsPage from "@/pages/UserDetailsPage";
import UserCreatePage from "@/pages/UserCreatePage";
import AgendaPage from "@/pages/AgendaPage";
import OffresPage from "@/pages/OffresPage";
import OfferList from "@/pages/OfferList";
import NotificationsPage from "@/pages/NotificationsPage";

function App() {
  return (
    <Router>
      <OnboardingProvider>
        <RestrictedOverlay>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dossiers" element={<DossiersPage />} />
                <Route path="/dossiers/:id" element={<DossierDetailsPage />} />
                <Route path="/dossiers/create" element={<DossierCreatePage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientDetailsPage />} />
                <Route path="/clients/create" element={<ClientCreatePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:id" element={<UserDetailsPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/agenda" element={<AgendaPage />} />
                <Route path="/offres" element={<OffresPage />} />
                <Route path="/marketplace" element={<OfferList />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RestrictedOverlay>
      </OnboardingProvider>
    </Router>
  );
}

export default App;
