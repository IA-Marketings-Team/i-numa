
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StatistiqueProvider } from "./contexts/StatistiqueContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { Toaster } from "./components/ui/toaster";

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

// Configuration des routes
const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <StatistiqueProvider>
            <Routes>
              {/* Routes publiques */}
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
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
              
              {/* Routes dossiers */}
              <Route path="/dossiers">
                <Route index element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossiersPage /></DashboardLayout>} />
                <Route path=":id" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierDetailsPage /></DashboardLayout>} />
                <Route path=":id/modifier" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierEditPage /></DashboardLayout>} />
                <Route path="nouveau" element={<DashboardLayout roles={["agent_phoner", "superviseur", "responsable"]}><DossierNewPage /></DashboardLayout>} />
              </Route>
              
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
          </StatistiqueProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
