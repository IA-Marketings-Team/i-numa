
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DossierProvider } from "@/contexts/DossierContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <DossierProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
            <Toaster />
          </TooltipProvider>
        </DossierProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
