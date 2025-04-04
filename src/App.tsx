
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StatistiqueProvider } from "./contexts/StatistiqueContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { OnboardingProvider } from "./components/onboarding/OnboardingProvider";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { Toaster } from "./components/ui/toaster";

// Import RendezVousEdit component
import RendezVousEdit from "./pages/RendezVousEdit";

// Import your pages
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import ClientEditPage from "./pages/ClientEditPage";
import ClientNewPage from "./pages/ClientNewPage";
import DossiersPage from "./pages/DossiersPage";
import DossierDetailsPage from "./pages/DossierDetailsPage";
import DossierEditPage from "./pages/DossierEditPage";
import DossierNewPage from "./pages/DossierNewPage";
import AgentsPage from "./pages/AgentsPage";
import StatistiquesPage from "./pages/StatistiquesPage";
import TasksPage from "./pages/TasksPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ProspectsPage from "./pages/ProspectsPage";
import Communications from "./pages/Communications";
import GlobalAgenda from "./pages/GlobalAgenda";
import ClientAgenda from "./pages/ClientAgenda";
import DossierCallPage from "./pages/DossierCallPage";
import DossierMeetingPage from "./pages/DossierMeetingPage";
import DossierPage from "./pages/DossierPage";
import MarketplacePage from "./pages/MarketplacePage";
import ContractAcceptance from "./pages/ContractAcceptance";
import AnnuairePage from "./pages/AnnuairePage";

// Configuration des routes
const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <StatistiqueProvider>
            <CartProvider>
              <OnboardingProvider>
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/connexion" element={<LoginPage />} />
                  <Route path="/inscription" element={<RegisterPage />} />
                  <Route path="/register" element={<Navigate to="/inscription" replace />} />
                  <Route path="/login" element={<Navigate to="/connexion" replace />} />
                  <Route path="/non-autorise" element={<UnauthorizedPage />} />
                  
                  {/* Rediriger la racine vers le tableau de bord */}
                  <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
                  
                  {/* Routes du dashboard protégées */}
                  <Route path="/tableau-de-bord" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
                  
                  {/* Routes clients */}
                  <Route path="/clients">
                    <Route index element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><ClientsPage /></DashboardLayout>} />
                    <Route path=":id" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><ClientDetailsPage /></DashboardLayout>} />
                    <Route path=":id/modifier" element={<DashboardLayout roles={["superviseur", "responsable"]}><ClientEditPage /></DashboardLayout>} />
                    <Route path="nouveau" element={<DashboardLayout roles={["superviseur", "responsable"]}><ClientNewPage /></DashboardLayout>} />
                  </Route>
                  
                  {/* Route annuaire */}
                  <Route path="/annuaire" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><AnnuairePage /></DashboardLayout>} />
                  
                  {/* Routes dossiers */}
                  <Route path="/dossiers">
                    <Route index element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossiersPage /></DashboardLayout>} />
                    <Route path=":id" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierDetailsPage /></DashboardLayout>} />
                    <Route path=":id/details" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierDetailsPage /></DashboardLayout>} />
                    <Route path=":id/modifier" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierEditPage /></DashboardLayout>} />
                    <Route path=":id/appel" element={<DashboardLayout roles={["agent_phoner", "superviseur", "responsable"]}><DossierCallPage /></DashboardLayout>} />
                    <Route path=":id/rdv" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierMeetingPage /></DashboardLayout>} />
                    {/* Routes pour les rendez-vous */}
                    <Route path=":id/rendez-vous/nouveau" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><RendezVousEdit /></DashboardLayout>} />
                    <Route path=":dossierId/rendez-vous/:id" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><RendezVousEdit /></DashboardLayout>} />
                    <Route path="nouveau" element={<DashboardLayout roles={["agent_phoner", "superviseur", "responsable"]}><DossierNewPage /></DashboardLayout>} />
                  </Route>
                  
                  {/* Routes marketplace (remplace offres) */}
                  <Route path="/marketplace" element={<DashboardLayout><MarketplacePage /></DashboardLayout>} />
                  {/* Rediriger les anciennes routes d'offres vers marketplace */}
                  <Route path="/offres" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/catalogue" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/mes-offres" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/contrat-acceptation" element={<DashboardLayout><ContractAcceptance /></DashboardLayout>} />
                  
                  {/* Routes agents */}
                  <Route path="/agents" element={<DashboardLayout roles={["superviseur", "responsable"]}><AgentsPage /></DashboardLayout>} />
                  
                  {/* Routes tâches */}
                  <Route path="/taches" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><TasksPage /></DashboardLayout>} />
                  
                  {/* Route profil */}
                  <Route path="/profil" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />
                  
                  {/* Routes statistiques */}
                  <Route path="/statistiques" element={<DashboardLayout roles={["superviseur", "responsable"]}><StatistiquesPage /></DashboardLayout>} />
                  
                  {/* Routes de gestion d'équipe */}
                  <Route path="/superviseur/equipes" element={<DashboardLayout roles={["superviseur", "responsable"]}><AgentsPage /></DashboardLayout>} />
                  
                  {/* Route agenda */}
                  <Route path="/agenda-global" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><GlobalAgenda /></DashboardLayout>} />
                  <Route path="/agenda" element={<DashboardLayout roles={["client"]}><ClientAgenda /></DashboardLayout>} />
                  
                  {/* Route prospects (remplace appels) */}
                  <Route path="/prospects" element={<DashboardLayout roles={["agent_phoner", "superviseur", "responsable"]}><ProspectsPage /></DashboardLayout>} />
                  {/* Rediriger l'ancienne route appels vers prospects */}
                  <Route path="/appels" element={<Navigate to="/prospects" replace />} />
                  
                  {/* Route communications */}
                  <Route path="/communications" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><Communications /></DashboardLayout>} />
                  
                  {/* Routes pour la compatibilité avec les anciens chemins */}
                  <Route path="/dashboard/*" element={<Navigate to="/tableau-de-bord" replace />} />
                  <Route path="/dashboard/clients/*" element={<Navigate to="/clients" replace />} />
                  <Route path="/dashboard/clients/:id" element={<Navigate to="/clients/:id" replace />} />
                  <Route path="/dashboard/clients/:id/edit" element={<Navigate to="/clients/:id/modifier" replace />} />
                  <Route path="/dashboard/clients/nouveau" element={<Navigate to="/clients/nouveau" replace />} />
                  <Route path="/dashboard/dossiers/*" element={<Navigate to="/dossiers" replace />} />
                  
                  {/* Route pour les URLs non trouvées */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster />
              </OnboardingProvider>
            </CartProvider>
          </StatistiqueProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
