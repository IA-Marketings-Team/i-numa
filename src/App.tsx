
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";

import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Statistics from "@/pages/Statistics";

import ClientList from "@/pages/ClientList";
import ClientPage from "@/pages/ClientPage";
import ClientCreate from "@/pages/ClientCreate";
import ClientEdit from "@/pages/ClientEdit";

import DossierList from "@/pages/DossierList";
import DossierPage from "@/pages/DossierPage";
import DossierEdit from "@/pages/DossierEdit";

import RendezVousEdit from "@/pages/RendezVousEdit";
import TasksPage from "@/pages/TasksPage";

import OfferList from "@/pages/OfferList";
import AllNotifications from "@/pages/AllNotifications";
import SuperviseurEquipe from "@/pages/SuperviseurEquipe";
import SuperviseurEquipes from "@/pages/SuperviseurEquipes";
import ContractAcceptance from "@/pages/ContractAcceptance";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DossierProvider } from "@/contexts/DossierContext";
import { StatistiqueProvider } from "@/contexts/StatistiqueContext";
import { CartProvider } from "@/contexts/CartContext";

import { initializeDatabase } from "@/services/initData";

import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const success = await initializeDatabase();
        setDbInitialized(success);
      } catch (error) {
        console.error("Error initializing database:", error);
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, []);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Initialisation des données...</p>
        </div>
      </div>
    );
  }

  if (!dbInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Erreur de connexion à la base de données</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <DossierProvider>
              <StatistiqueProvider>
                <CartProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/contract-acceptance" element={<ContractAcceptance />} />
                      <Route path="/app" element={<Layout />}>
                        <Route 
                          path="tableau-de-bord" 
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="clients" 
                          element={
                            <ProtectedRoute>
                              <ClientList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="clients/:id" 
                          element={
                            <ProtectedRoute>
                              <ClientPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="clients/:id/edit" 
                          element={
                            <ProtectedRoute>
                              <ClientEdit />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="clients/nouveau" 
                          element={
                            <ProtectedRoute>
                              <ClientCreate />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="dossiers" 
                          element={
                            <ProtectedRoute>
                              <DossierList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="dossiers/:id" 
                          element={
                            <ProtectedRoute>
                              <DossierPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="dossiers/:id/edit" 
                          element={
                            <ProtectedRoute>
                              <DossierEdit />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="rendez-vous/:id/edit" 
                          element={
                            <ProtectedRoute>
                              <RendezVousEdit />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="tasks" 
                          element={
                            <ProtectedRoute>
                              <TasksPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="statistiques" 
                          element={
                            <ProtectedRoute>
                              <Statistics />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="parametres" 
                          element={
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="offres" 
                          element={
                            <ProtectedRoute>
                              <OfferList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="notifications" 
                          element={
                            <ProtectedRoute>
                              <AllNotifications />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="superviseur/equipe" 
                          element={
                            <ProtectedRoute>
                              <SuperviseurEquipe />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="superviseur/equipes" 
                          element={
                            <ProtectedRoute>
                              <SuperviseurEquipes />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Router>
                  <Toaster />
                </CartProvider>
              </StatistiqueProvider>
            </DossierProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
