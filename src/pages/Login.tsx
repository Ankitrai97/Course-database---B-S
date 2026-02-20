"use client";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

export default function Login() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) {
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl items-center justify-center text-white shadow-xl mb-6">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to access your dashboard</p>
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
                    buttonRadius: '12px',
                    inputRadius: '12px',
                  }
                }
              }
            }}
            providers={['google']}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}