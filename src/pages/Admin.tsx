import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import { AdminSidebar, AdminSection } from "@/components/admin/AdminSidebar";
import { PendingVoiceNotes } from "@/components/admin/PendingVoiceNotes";
import { ApprovedVoiceNotes } from "@/components/admin/ApprovedVoiceNotes";
import { UserActivityHistory } from "@/components/admin/UserActivityHistory";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("pending");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch pending count for sidebar badge
  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["voice-notes", "pending-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("voice_notes")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
  });

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, loading, isAdmin, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-md text-center">
            <div className="glass-card rounded-3xl p-8">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You need admin privileges to access the dashboard.
              </p>
              <Button variant="hero" onClick={() => navigate("/")}>
                Go Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        pendingCount={pendingCount}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main
        className={cn(
          "pt-20 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <section className="py-8 md:py-12 border-b border-border">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  Admin <span className="text-gradient">Dashboard</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage voice contributions and user activity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-8">
            {activeSection === "pending" && <PendingVoiceNotes />}
            {activeSection === "approved" && <ApprovedVoiceNotes />}
            {activeSection === "activity" && <UserActivityHistory />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
