"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthGuard = () => {
  const { session, loading } = useAuth();

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <h1 className="text-2xl font-bold">You are logged in</h1>
      <p className="text-slate-500">{session.user.email}</p>
      <Button 
        variant="outline" 
        onClick={() => supabase.auth.signOut()}
      >
        Logout
      </Button>
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