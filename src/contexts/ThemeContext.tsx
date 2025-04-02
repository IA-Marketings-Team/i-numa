
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to safely get the initial theme
const getInitialTheme = (): Theme => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return "light";
  
  try {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  } catch (error) {
    console.error("Error accessing theme preferences:", error);
    return "light";
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Using a regular value to initialize state (not a function that could cause errors)
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

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
