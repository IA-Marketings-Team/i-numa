
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col bg-background">
        {isAuthenticated && <Header />}
        
        <div className="flex-grow flex w-full">
          {isAuthenticated && <Sidebar />}
          
          <main className="flex-grow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
            
            <footer className="py-4 bg-background border-t">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} ConnectCRM. Tous droits réservés.
                </p>
              </div>
            </footer>
          </main>
        </div>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
