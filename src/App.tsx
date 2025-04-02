
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StatistiqueProvider } from "./contexts/StatistiqueContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/LoginPage";
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
              
              {/* Routes protégées avec DashboardLayout */}
              <Route path="/" element={<DashboardLayout />}>
                {/* Route du tableau de bord */}
                <Route path="tableau-de-bord" element={<DashboardPage />} />
                
                {/* Routes clients - accessibles par les agents, superviseurs et responsables */}
                <Route path="clients">
                  <Route index element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><ClientsPage /></DashboardLayout>} />
                  <Route path=":id" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><ClientDetailsPage /></DashboardLayout>} />
                  <Route path=":id/modifier" element={<DashboardLayout roles={["superviseur", "responsable"]}><ClientEditPage /></DashboardLayout>} />
                  <Route path="nouveau" element={<DashboardLayout roles={["superviseur", "responsable"]}><ClientNewPage /></DashboardLayout>} />
                </Route>
                
                {/* Routes dossiers */}
                <Route path="dossiers">
                  <Route index element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossiersPage /></DashboardLayout>} />
                  <Route path=":id" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierDetailsPage /></DashboardLayout>} />
                  <Route path=":id/modifier" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><DossierEditPage /></DashboardLayout>} />
                  <Route path="nouveau" element={<DashboardLayout roles={["agent_phoner", "superviseur", "responsable"]}><DossierNewPage /></DashboardLayout>} />
                </Route>
                
                {/* Routes agents */}
                <Route path="agents" element={<DashboardLayout roles={["superviseur", "responsable"]}><AgentsPage /></DashboardLayout>} />
                
                {/* Routes tâches */}
                <Route path="taches" element={<DashboardLayout roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}><TasksPage /></DashboardLayout>} />
                
                {/* Route profil - accessible par tous les utilisateurs authentifiés */}
                <Route path="profil" element={<ProfilePage />} />
                
                {/* Routes statistiques - uniquement pour les superviseurs et responsables */}
                <Route path="statistiques" element={<DashboardLayout roles={["superviseur", "responsable"]}><StatistiquesPage /></DashboardLayout>} />
                
                {/* Routes de gestion d'équipe pour les superviseurs et responsables */}
                <Route path="superviseur/equipes" element={<DashboardLayout roles={["superviseur", "responsable"]}><AgentsPage /></DashboardLayout>} />
                
                {/* Route non trouvée */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              
              {/* Intercepter toutes les autres routes et rediriger vers la connexion */}
              <Route path="*" element={<Navigate to="/connexion" replace />} />
            </Routes>
            <Toaster />
          </StatistiqueProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
