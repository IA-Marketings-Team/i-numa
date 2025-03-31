
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
      <div className="h-screen flex overflow-hidden">
        {isAuthenticated && <Sidebar />}
        
        <div className="flex flex-col flex-1 w-full">
          {isAuthenticated && <Header />}
          
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
          
          <footer className="py-3 border-t">
            <div className="px-6">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} ConnectCRM. Tous droits réservés.
              </p>
            </div>
          </footer>
        </div>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
