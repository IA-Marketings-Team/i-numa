
import React, { ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import RestrictedOverlay from '@/components/onboarding/RestrictedOverlay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

interface DashboardLayoutProps {
  children: ReactNode;
  roles?: string[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, roles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/connexion', { replace: true });
    } else if (!isLoading && isAuthenticated && roles.length > 0) {
      // Vérifier les permissions de rôle si des rôles sont spécifiés
      const userRole = user?.role || 'client';
      if (!roles.includes(userRole)) {
        navigate('/non-autorise', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, roles, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection se fera via useEffect
  }

  return (
    <RestrictedOverlay>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Sidebar />

          <div
            className="flex flex-col flex-1 w-full overflow-hidden"
            style={{ backgroundColor: "white" }}
          >
            <Header />

            <main className="flex-1 overflow-auto bg-background">
              {children || <Outlet />}
            </main>

            <footer className="py-2 md:py-3 bg-card border-t">
              <div className="w-full px-4 md:px-6">
                <p className="text-center text-xs text-muted-foreground">
                  © {new Date().getFullYear()} i-numa. Tous droits réservés.
                </p>
              </div>
            </footer>
          </div>

          <Toaster />
        </div>
      </SidebarProvider>
      {isAuthenticated && <OnboardingModal />}
    </RestrictedOverlay>
  );
};

export default DashboardLayout;
