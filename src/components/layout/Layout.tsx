
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
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <div className="flex flex-1 overflow-hidden w-full">
          {isAuthenticated && <Sidebar />}
          
          <div className="flex flex-col flex-1 overflow-hidden w-full">
            {isAuthenticated && <Header />}
            
            <main className="flex-1 overflow-auto w-full">
              <div className="w-full h-full">
                <Outlet />
              </div>
            </main>
            
            <footer className="py-3 bg-background border-t w-full">
              <div className="w-full px-4">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} ConnectCRM. Tous droits réservés.
                </p>
              </div>
            </footer>
          </div>
        </div>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
