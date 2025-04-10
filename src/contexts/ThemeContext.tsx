
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Add defaultTheme prop to ThemeProvider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to safely get the initial theme
const getInitialTheme = (defaultTheme?: Theme): Theme => {
  // Default to light mode for i-numa if no defaultTheme is provided
  return defaultTheme || "light";
};

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme(defaultTheme));

  // Effect to apply the theme to the document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const root = window.document.documentElement;
      
      // Remove both themes and add the current one
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
