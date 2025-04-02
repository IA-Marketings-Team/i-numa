
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to check if backend is available
const checkBackendAvailability = async () => {
  try {
    // Attempt to connect to the backend health endpoint
    const response = await fetch('/api/health', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('Backend is available');
      return true;
    } else {
      console.warn('Backend responded with an error');
      return false;
    }
  } catch (error) {
    console.warn('Backend is not available yet, retrying...');
    return false;
  }
};

// Function to start the application
const startApp = () => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Check backend availability before starting the app
const waitForBackend = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;
  
  const tryConnect = async () => {
    const isAvailable = await checkBackendAvailability();
    
    if (isAvailable) {
      startApp();
    } else if (retries < MAX_RETRIES) {
      retries++;
      console.log(`Retrying backend connection (${retries}/${MAX_RETRIES})...`);
      setTimeout(tryConnect, 2000); // Retry after 2 seconds
    } else {
      console.error('Unable to connect to backend after multiple attempts. Starting the app anyway...');
      startApp();
    }
  };
  
  await tryConnect();
};

// Start the application process
waitForBackend();
