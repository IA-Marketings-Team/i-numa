
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

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <StatistiqueProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/non-autorise" element={<UnauthorizedPage />} />
              
              {/* Redirect root to tableau-de-bord */}
              <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
              
              {/* Protected routes with DashboardLayout */}
              <Route path="/" element={<DashboardLayout />}>
                {/* Dashboard route */}
                <Route path="tableau-de-bord" element={<DashboardPage />} />
                
                {/* Client routes */}
                <Route 
                  path="clients" 
                  element={<ClientsPage />}
                />
                <Route path="clients/:id" element={<ClientDetailsPage />} />
                <Route path="clients/:id/modifier" element={<ClientEditPage />} />
                <Route path="clients/nouveau" element={<ClientNewPage />} />
                
                {/* Dossier routes */}
                <Route path="dossiers" element={<DossiersPage />} />
                <Route path="dossiers/:id" element={<DossierDetailsPage />} />
                <Route path="dossiers/:id/modifier" element={<DossierEditPage />} />
                <Route path="dossiers/nouveau" element={<DossierNewPage />} />
                
                {/* Agent routes */}
                <Route 
                  path="agents" 
                  element={<AgentsPage />}
                />
                
                {/* Tasks routes */}
                <Route path="taches" element={<TasksPage />} />
                
                {/* Profile route */}
                <Route path="profil" element={<ProfilePage />} />
                
                {/* Statistics routes */}
                <Route 
                  path="statistiques" 
                  element={<StatistiquesPage />}
                />
                
                {/* Team management routes for supervisors and responsables */}
                <Route 
                  path="superviseur/equipes" 
                  element={
                    <DashboardLayout roles={["superviseur", "responsable"]}>
                      <AgentsPage />
                    </DashboardLayout>
                  }
                />
                
                {/* Not found route */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              
              {/* Catch all other routes and redirect to login */}
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
