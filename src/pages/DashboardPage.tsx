
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.prenom || 'User'}</h1>
        <p className="text-muted-foreground">
          This is your dashboard. You're now connected with Supabase authentication.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Getting Started</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Your application is now using Supabase for authentication and data storage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
