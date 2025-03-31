
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
      <div className="flex h-screen overflow-hidden bg-background">
        {isAuthenticated && <Sidebar />}
        
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          {isAuthenticated && <Header />}
          
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto py-6 px-4 md:px-6 max-w-full">
              <Outlet />
            </div>
          </main>
          
          <footer className="py-3 border-t bg-white dark:bg-gray-800">
            <div className="container mx-auto px-6">
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
