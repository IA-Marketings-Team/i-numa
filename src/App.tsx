
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DossierProvider } from "@/contexts/DossierContext";
import { CartProvider } from "@/contexts/CartContext";
import { StatistiqueProvider } from "@/contexts/StatistiqueContext";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import "./App.css";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/NotFound";

// Lazy-loaded pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const OfferList = lazy(() => import("@/pages/OfferList"));
const ClientList = lazy(() => import("@/pages/ClientList"));
const ClientPage = lazy(() => import("@/pages/ClientPage"));
const ClientEdit = lazy(() => import("@/pages/ClientEdit"));
const ClientCreate = lazy(() => import("@/pages/ClientCreate"));
const DossierList = lazy(() => import("@/pages/DossierList"));
const DossierPage = lazy(() => import("@/pages/DossierPage"));
const DossierEdit = lazy(() => import("@/pages/DossierEdit"));
const RendezVousEdit = lazy(() => import("@/pages/RendezVousEdit"));
const Statistics = lazy(() => import("@/pages/Statistics"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const Settings = lazy(() => import("@/pages/Settings"));
const ContractAcceptance = lazy(() => import("@/pages/ContractAcceptance"));
const AllNotifications = lazy(() => import("@/pages/AllNotifications"));
const MigrationPage = lazy(() => import("@/pages/MigrationPage"));
const SuperviseurEquipes = lazy(() => import("@/pages/SuperviseurEquipes"));
const SuperviseurEquipe = lazy(() => import("@/pages/SuperviseurEquipe"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));
const AppelsPage = lazy(() => import("@/pages/AppelsPage"));
const Communications = lazy(() => import("@/pages/Communications"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DossierProvider>
          <CartProvider>
            <StatistiqueProvider>
              <Router>
                <Suspense fallback={<div>Chargement...</div>}>
                  <Routes>
                    {/* Page d'accueil et auth */}
                    <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/acceptation-contrat" element={<ContractAcceptance />} />
                    <Route path="/migration" element={<MigrationPage />} />

                    {/* Routes protégées */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="tableau-de-bord" element={<Dashboard />} />
                      <Route path="mes-offres" element={<OfferList />} />
                      <Route path="clients" element={<ClientList />} />
                      <Route path="clients/:id" element={<ClientPage />} />
                      <Route path="clients/:id/edit" element={<ClientEdit />} />
                      <Route path="clients/nouveau" element={<ClientCreate />} />
                      <Route path="dossiers" element={<DossierList />} />
                      <Route path="dossiers/:id" element={<DossierPage />} />
                      <Route path="dossiers/:id/edit" element={<DossierEdit />} />
                      <Route path="dossiers/nouveau" element={<DossierEdit />} />
                      <Route path="dossiers/:id/rendez-vous/:rdvId" element={<RendezVousEdit />} />
                      <Route path="dossiers/:id/rendez-vous/nouveau" element={<RendezVousEdit />} />
                      <Route path="statistiques" element={<Statistics />} />
                      <Route path="profil" element={<ProfilePage />} />
                      <Route path="parametres" element={<Settings />} />
                      <Route path="notifications" element={<AllNotifications />} />
                      <Route path="superviseur/equipes" element={<SuperviseurEquipes />} />
                      <Route path="superviseur/equipes/:id" element={<SuperviseurEquipe />} />
                      <Route path="taches" element={<TasksPage />} />
                      <Route path="appels" element={<AppelsPage />} />
                      <Route path="communications" element={<Communications />} />
                    </Route>

                    {/* Page 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Router>
              <Toaster />
            </StatistiqueProvider>
          </CartProvider>
        </DossierProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
