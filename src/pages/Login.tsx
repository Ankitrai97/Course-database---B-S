"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-slate-500">Sign in to access your course content</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5',
                    brandAccent: '#4338ca',
                  },
                  radii: {
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  }
                }
              }
            }}
            providers={[]}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}