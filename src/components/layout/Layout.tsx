
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated && <Header />}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="py-4 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ConnectCRM. Tous droits réservés.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
