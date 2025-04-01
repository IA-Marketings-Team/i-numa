
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DossierListPage from "./pages/DossierList";
import DossierPage from "./pages/DossierPage";
import DossierEdit from "./pages/DossierEdit";
import RendezVousEdit from "./pages/RendezVousEdit";
import ClientListPage from "./pages/ClientList";
import ClientPage from "./pages/ClientPage";
import ClientCreate from "./pages/ClientCreate";
import ClientEdit from "./pages/ClientEdit";
import OfferList from "./pages/OfferList";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ContractAcceptance from "./pages/ContractAcceptance";
import AllNotificationsPage from "./pages/AllNotifications";
import { AuthProvider } from "./contexts/auth";
import { DossierProvider } from "./contexts/DossierContext";
import { StatistiqueProvider } from "./contexts/StatistiqueContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SuperviseurEquipes from "./pages/SuperviseurEquipes";
import SuperviseurEquipe from "./pages/SuperviseurEquipe";
import MigrationPage from "./pages/MigrationPage";
import Index from "./pages/Index";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes - outside of Layout */}
                <Route path="/connexion" element={<Login />} />
                <Route path="/inscription" element={<Register />} />
                <Route path="/" element={<Index />} />
                
                {/* Protected routes - with Layout wrapper */}
                <Route element={
                  <DossierProvider>
                    <StatistiqueProvider>
                      <CartProvider>
                        <Toaster />
                        <Sonner />
                        <Layout />
                      </CartProvider>
                    </StatistiqueProvider>
                  </DossierProvider>
                }>
                  <Route 
                    path="/tableau-de-bord" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/dossiers" 
                    element={
                      <ProtectedRoute>
                        <DossierListPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/dossiers/:id" 
                    element={
                      <ProtectedRoute>
                        <DossierPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/dossiers/nouveau" 
                    element={
                      <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                        <DossierEdit />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/dossiers/:id/edit" 
                    element={
                      <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                        <DossierEdit />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/dossiers/:dossierId/rendez-vous/:id" 
                    element={
                      <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                        <RendezVousEdit />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/clients" 
                    element={
                      <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                        <ClientListPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/clients/nouveau" 
                    element={
                      <ProtectedRoute roles={['superviseur', 'responsable']}>
                        <ClientCreate />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/clients/:id" 
                    element={
                      <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                        <ClientPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/clients/:id/edit" 
                    element={
                      <ProtectedRoute roles={['superviseur', 'responsable']}>
                        <ClientEdit />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/mes-offres" 
                    element={
                      <ProtectedRoute>
                        <OfferList />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/contrat-acceptation" 
                    element={
                      <ProtectedRoute>
                        <ContractAcceptance />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/statistiques" 
                    element={
                      <ProtectedRoute>
                        <Statistics />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/parametres" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/notifications" 
                    element={
                      <ProtectedRoute>
                        <AllNotificationsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/superviseur/equipes" 
                    element={
                      <ProtectedRoute roles={['superviseur', 'responsable']}>
                        <SuperviseurEquipes />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/superviseur/equipe" 
                    element={
                      <ProtectedRoute roles={['superviseur', 'responsable']}>
                        <SuperviseurEquipe />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/migration" 
                    element={
                      <ProtectedRoute roles={['superviseur', 'responsable']}>
                        <MigrationPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
