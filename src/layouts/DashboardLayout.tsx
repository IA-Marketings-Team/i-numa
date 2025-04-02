
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  roles?: UserRole[];
}

/**
 * Layout principal pour les pages du tableau de bord
 * Gère la protection des routes et l'affichage de la sidebar
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  roles = ['client', 'agent_phoner', 'agent_visio', 'superviseur', 'responsable']
}) => {
  return (
    <ProtectedRoute roles={roles}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Sidebar />

          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <Header />

            <main className="flex-1 overflow-auto bg-background p-4">
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
    </ProtectedRoute>
  );
};

export default DashboardLayout;
