
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DossierList from "@/pages/DossierList";
import DossierPage from "@/pages/DossierPage";
import ClientList from "@/pages/ClientList";
import ClientCreate from "@/pages/ClientCreate";
import ClientEdit from "@/pages/ClientEdit";
import ClientPage from "@/pages/ClientPage";
import OfferList from "./pages/OfferList";
import Statistics from "./pages/Statistics";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import SuperviseurEquipes from "@/pages/SuperviseurEquipes";
import SuperviseurEquipe from "@/pages/SuperviseurEquipe";
import Settings from "@/pages/Settings";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import MigrationPage from "@/pages/MigrationPage";
import AllNotifications from "@/pages/AllNotifications";
import DossierEdit from "@/pages/DossierEdit";
import RendezVousEdit from "@/pages/RendezVousEdit";
import TasksPage from "@/pages/TasksPage";
import AppelsPage from "./pages/AppelsPage";
import ContractAcceptance from "./pages/ContractAcceptance";
import Communications from "./pages/Communications";
import ClientAgenda from "./pages/ClientAgenda";
import GlobalAgenda from "./pages/GlobalAgenda";

import { AuthProvider } from "@/contexts/AuthContext";
import { StatistiqueProvider } from "@/contexts/StatistiqueContext";
import { DossierProvider } from "@/contexts/DossierContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <StatistiqueProvider>
            <DossierProvider>
              <CartProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    
                    <Route element={<Layout />}>
                      <Route
                        path="tableau-de-bord"
                        element={
                          <ProtectedRoute roles={["client", "agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="dossiers"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <DossierList />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="dossiers/:id"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <DossierPage />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="dossiers/:id/edit"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <DossierEdit />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="dossiers/:dossierId/rendez-vous/:rdvId/edit"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <RendezVousEdit />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="clients"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <ClientList />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="clients/create"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <ClientCreate />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="clients/:id"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <ClientPage />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="clients/:id/edit"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <ClientEdit />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="statistiques"
                        element={
                          <ProtectedRoute roles={["superviseur", "responsable"]}>
                            <Statistics />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="superviseur/equipes"
                        element={
                          <ProtectedRoute roles={["superviseur", "responsable"]}>
                            <SuperviseurEquipes />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="superviseur/equipes/:id"
                        element={
                          <ProtectedRoute roles={["superviseur", "responsable"]}>
                            <SuperviseurEquipe />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="mes-offres"
                        element={
                          <ProtectedRoute roles={["client"]}>
                            <OfferList />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="contrat-acceptation"
                        element={
                          <ProtectedRoute roles={["client"]}>
                            <ContractAcceptance />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="parametres"
                        element={
                          <ProtectedRoute roles={["client", "agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="profil"
                        element={
                          <ProtectedRoute roles={["client", "agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="notifications"
                        element={
                          <ProtectedRoute roles={["client", "agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <AllNotifications />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="taches"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <TasksPage />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="appels"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "superviseur", "responsable"]}>
                            <AppelsPage />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="communications"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <Communications />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="agenda"
                        element={
                          <ProtectedRoute roles={["client"]}>
                            <ClientAgenda />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route
                        path="agenda-global"
                        element={
                          <ProtectedRoute roles={["agent_phoner", "agent_visio", "superviseur", "responsable"]}>
                            <GlobalAgenda />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route path="*" element={<NotFound />} />
                    </Route>
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/migration" element={<MigrationPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Router>
                <Toaster />
              </CartProvider>
            </DossierProvider>
          </StatistiqueProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
