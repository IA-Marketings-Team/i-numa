
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
        
        <div className="flex flex-1 overflow-hidden">
          {isAuthenticated && <Sidebar />}
          
          <main className="flex-1 overflow-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-10rem)]">
              <Outlet />
            </div>
          </main>
        </div>
        
        <footer className="py-4 bg-background border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} ConnectCRM. Tous droits réservés.
            </p>
          </div>
        </footer>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
