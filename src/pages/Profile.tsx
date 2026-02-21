"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { User, CreditCard, LogOut, ArrowLeft, Loader2, Save, CheckCircle2, XCircle } from "lucide-react";
import ProfileMenu from "@/components/ProfileMenu";

export default function Profile() {
  const { user, subscriptionStatus, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      showSuccess("Profile updated successfully");
    } catch (error: any) {
      showError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    showSuccess("Logged out successfully");
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const isActive = subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">My Profile</h1>
          </div>
          <ProfileMenu />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
                  {formData.first_name?.[0] || user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold truncate">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-100">
                  <LogOut size={18} /> Logout
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <CreditCard size={16} /> Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={`rounded-lg px-3 py-1 ${isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}`}>
                    {isActive ? (
                      <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1"><XCircle size={12} /> Inactive</span>
                    )}
                  </Badge>
                </div>
                {!isActive && (
                  <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none">
                    Upgrade Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="md:col-span-2">
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-indigo-600" /> Personal Information
                </CardTitle>
                <CardDescription>Update your name and how you appear in the course.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="rounded-xl h-12"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={saving} className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 gap-2">
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}