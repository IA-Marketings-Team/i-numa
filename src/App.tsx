
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import ClientList from "@/pages/ClientList";
import ClientPage from "@/pages/ClientPage";
import ClientCreate from "@/pages/ClientCreate";
import ClientEdit from "@/pages/ClientEdit";
import DossierPage from "@/pages/DossierPage";
import DossierEdit from "@/pages/DossierEdit";
import DossierList from "@/pages/DossierList";
import OfferList from "@/pages/OfferList";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AllNotifications from "@/pages/AllNotifications";
import RendezVousEdit from "@/pages/RendezVousEdit";
import Statistics from "@/pages/Statistics";
import SuperviseurEquipes from "@/pages/SuperviseurEquipes";
import SuperviseurEquipe from "@/pages/SuperviseurEquipe";
import Settings from "@/pages/Settings";
import ContractAcceptance from "@/pages/ContractAcceptance";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/tableau-de-bord" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <ClientList />
              </ProtectedRoute>
            } />
            <Route path="/clients/nouveau" element={
              <ProtectedRoute>
                <ClientCreate />
              </ProtectedRoute>
            } />
            <Route path="/clients/:id" element={
              <ProtectedRoute>
                <ClientPage />
              </ProtectedRoute>
            } />
            <Route path="/clients/:id/modifier" element={
              <ProtectedRoute>
                <ClientEdit />
              </ProtectedRoute>
            } />
            <Route path="/dossiers" element={
              <ProtectedRoute>
                <DossierList />
              </ProtectedRoute>
            } />
            <Route path="/dossiers/:id" element={
              <ProtectedRoute>
                <DossierPage />
              </ProtectedRoute>
            } />
            <Route path="/dossiers/:id/modifier" element={
              <ProtectedRoute>
                <DossierEdit />
              </ProtectedRoute>
            } />
            <Route path="/rendez-vous/:id/modifier" element={
              <ProtectedRoute>
                <RendezVousEdit />
              </ProtectedRoute>
            } />
            <Route path="/offres" element={
              <ProtectedRoute>
                <OfferList />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <AllNotifications />
              </ProtectedRoute>
            } />
            <Route path="/statistiques" element={
              <ProtectedRoute roles={['superviseur', 'responsable']}>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="/superviseur/equipes" element={
              <ProtectedRoute roles={['superviseur', 'responsable']}>
                <SuperviseurEquipes />
              </ProtectedRoute>
            } />
            <Route path="/superviseur/equipe/:id" element={
              <ProtectedRoute roles={['superviseur', 'responsable']}>
                <SuperviseurEquipe />
              </ProtectedRoute>
            } />
            <Route path="/parametres" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/contract/:id/acceptation" element={
              <ProtectedRoute>
                <ContractAcceptance />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
