
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DossierListPage from "./pages/DossierList";
import DossierPage from "./pages/DossierPage";
import DossierEdit from "./pages/DossierEdit";
import ClientListPage from "./pages/ClientList";
import ClientPage from "./pages/ClientPage";
import OfferList from "./pages/OfferList";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { DossierProvider } from "./contexts/DossierContext";
import { StatistiqueProvider } from "./contexts/StatistiqueContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DossierProvider>
          <StatistiqueProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/connexion" element={<Login />} />
                  
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
                    
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
                      path="/dossiers/:id/edit" 
                      element={
                        <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                          <DossierEdit />
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
                      path="/clients/:id" 
                      element={
                        <ProtectedRoute roles={['agent_phoner', 'agent_visio', 'superviseur', 'responsable']}>
                          <ClientPage />
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
                    
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </StatistiqueProvider>
        </DossierProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
