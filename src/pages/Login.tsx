"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showError(error.message);
    else showSuccess("Logged in successfully");
    setIsPending(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) showError(error.message);
    else showSuccess("Check your email for the confirmation link");
    setIsPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Login or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleLogin} disabled={isPending} className="w-full">
                {isPending ? "Processing..." : "Login"}
              </Button>
              <Button onClick={handleSignup} variant="outline" disabled={isPending} className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}