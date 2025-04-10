
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DossierProvider } from "@/contexts/DossierContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import DossierListPage from "@/pages/DossierList";
import DossierDetailsPage from "@/pages/DossierDetailsPage";
import DossierPage from "@/pages/DossierPage";
import DossierNewPage from "@/pages/DossierNewPage";
import DossierEdit from "@/pages/DossierEdit";
import ProfilePage from "@/pages/ProfilePage";
import StatistiquesPage from "@/pages/StatistiquesPage";
import ClientsPage from "@/pages/ClientsPage";
import OffresPage from "@/pages/OffresPage";
import ConsultationsPage from "@/pages/ConsultationsPage";
import DossierMeetingPage from "@/pages/DossierMeetingPage";
import { Toaster } from "@/components/ui/toaster";
import AuthGuard from "@/components/auth/AuthGuard";
import Index from "@/pages/Index";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <DossierProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                
                <Route 
                  element={
                    <AuthGuard>
                      <Layout />
                    </AuthGuard>
                  }
                >
                  <Route path="/tableau-de-bord" element={<DashboardPage />} />
                  <Route path="/dossiers" element={<DossierListPage />} />
                  <Route path="/dossiers/:id" element={<DossierPage />} />
                  <Route path="/dossiers/detail/:id" element={<DossierDetailsPage />} />
                  <Route path="/dossiers/nouveau" element={<DossierNewPage />} />
                  <Route path="/dossiers/:id/modifier" element={<DossierEdit />} />
                  <Route path="/dossiers/:id/rdv" element={<DossierMeetingPage />} />
                  <Route path="/profil" element={<ProfilePage />} />
                  <Route path="/statistiques" element={<StatistiquesPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/mes-offres" element={<OffresPage />} />
                  <Route path="/consultations" element={<ConsultationsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <Toaster />
            </TooltipProvider>
          </DossierProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
