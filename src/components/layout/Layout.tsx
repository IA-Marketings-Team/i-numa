
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isAuthenticated && <Header />}
      
      <div className="flex-grow flex w-full">
        <SidebarProvider defaultOpen={true}>
          {isAuthenticated && <Sidebar />}
          <SidebarInset className="w-full">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </main>
            <footer className="py-4 bg-background border-t">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} ConnectCRM. Tous droits réservés.
                </p>
              </div>
            </footer>
          </SidebarInset>
        </SidebarProvider>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Layout;
