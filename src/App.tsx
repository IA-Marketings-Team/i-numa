
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StatistiqueProvider } from "./contexts/StatistiqueContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/auth/PrivateRoute";
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
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <StatistiqueProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected routes within DashboardLayout */}
              <Route 
                path="/dashboard/*" 
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Routes>
                        {/* Dashboard index route */}
                        <Route index element={<DashboardPage />} />
                        
                        {/* Client routes */}
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="clients/:id" element={<ClientDetailsPage />} />
                        <Route path="clients/:id/edit" element={<ClientEditPage />} />
                        <Route path="clients/nouveau" element={<ClientNewPage />} />
                        
                        {/* Dossier routes */}
                        <Route path="dossiers" element={<DossiersPage />} />
                        <Route path="dossiers/:id" element={<DossierDetailsPage />} />
                        <Route path="dossiers/:id/edit" element={<DossierEditPage />} />
                        <Route path="dossiers/nouveau" element={<DossierNewPage />} />
                        
                        {/* Agent routes */}
                        <Route 
                          path="agents" 
                          element={
                            <PrivateRoute requiredRoles={["superviseur", "responsable"]}>
                              <AgentsPage />
                            </PrivateRoute>
                          } 
                        />
                        
                        {/* Statistics routes */}
                        <Route path="statistiques" element={<StatistiquesPage />} />
                        
                        {/* Not found route */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </DashboardLayout>
                  </PrivateRoute>
                } 
              />
              
              {/* Catch all other routes and redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster />
          </StatistiqueProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
