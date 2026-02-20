"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthGuard = () => {
  const { session, user, profile, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-center">You are logged in</h1>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">User Email:</p>
          <p className="p-2 bg-slate-50 rounded border font-mono text-sm">{user?.email}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Role Value:</p>
          <p className="p-2 bg-slate-50 rounded border font-mono text-sm">{role || "No role found"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Profile JSON:</p>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded border overflow-auto text-xs max-h-60">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => supabase.auth.signOut()}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AuthGuard />
    <Toaster />
  </AuthProvider>
);

export default App;