"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, User, CheckCircle, XCircle, Loader2, Search, Database } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  access_status?: string;
}

export default function Admin() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { role, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchData();
    fetchTestData();
  }, [role, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, role");

      if (profilesError) throw profilesError;

      const { data: accessData, error: accessError } = await supabase
        .from("course_access")
        .select("user_id, status");

      if (accessError) throw accessError;

      const combined = (profilesData || []).map(p => ({
        ...p,
        access_status: accessData?.find(a => a.user_id === p.id)?.status || "inactive"
      }));

      setProfiles(combined);
    } catch (e: any) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestData = async () => {
    try {
      const { data, error } = await supabase
        .from("dyad_test_table")
        .select("*");
      
      if (!error) {
        setTestData(data || []);
      }
    } catch (e) {
      // Table might not exist yet, ignore error
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      showSuccess(`Role updated to ${newRole}`);
      fetchData();
    } catch (e: any) {
      showError(e.message);
    }
  };

  const toggleAccess = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const { error } = await supabase
        .from("course_access")
        .upsert({ user_id: userId, status: newStatus }, { onConflict: "user_id" });

      if (error) throw error;
      showSuccess(`Access updated to ${newStatus}`);
      fetchData();
    } catch (e: any) {
      showError(e.message);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">ADMIN PANEL</h1>
            <p className="text-slate-500">Manage user roles and course permissions.</p>
          </div>
          <Button onClick={fetchData} variant="outline" className="rounded-xl">
            Refresh Data
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input 
            placeholder="Search by email..." 
            className="pl-10 rounded-xl bg-white dark:bg-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Course Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                  </TableCell>
                </TableRow>
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.email}</TableCell>
                    <TableCell>
                      <Badge variant={p.role === "admin" ? "default" : "secondary"} className="capitalize gap-1">
                        {p.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                        {p.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={p.access_status === "active" ? "outline" : "secondary"}
                        className={p.access_status === "active" ? "border-emerald-500 text-emerald-600 gap-1" : "gap-1"}
                      >
                        {p.access_status === "active" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {p.access_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-lg text-xs"
                        onClick={() => toggleRole(p.id, p.role)}
                        disabled={p.id === user?.id}
                      >
                        Toggle Role
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-lg text-xs"
                        onClick={() => toggleAccess(p.id, p.access_status || "inactive")}
                      >
                        Toggle Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {testData.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
              <Database size={20} />
              <h2 className="font-bold">Database Connection Test</h2>
            </div>
            {testData.map((item, i) => (
              <p key={i} className="text-sm font-medium">{item.message}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}