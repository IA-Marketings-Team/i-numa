
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { spawn } from "child_process";

// Start backend server function
function startBackendServer() {
  console.log("Starting backend server...");
  const backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.resolve(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
  });

  backendProcess.on('error', (error) => {
    console.error(`Error starting backend server: ${error.message}`);
  });

  process.on('exit', () => {
    console.log('Killing backend server...');
    backendProcess.kill();
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Start backend server in development mode
  if (mode === 'development') {
    startBackendServer();
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
