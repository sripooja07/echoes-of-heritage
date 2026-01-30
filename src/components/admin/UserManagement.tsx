import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Shield, 
  ShieldOff, 
  Loader2, 
  UserCog,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface UserWithRole {
  user_id: string;
  display_name: string | null;
  role: "admin" | "user";
}

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "promote" | "demote";
    user: UserWithRole | null;
  }>({ open: false, action: "promote", user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, display_name");

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          user_id: profile.user_id,
          display_name: profile.display_name,
          role: (userRole?.role as "admin" | "user") || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async () => {
    if (!confirmDialog.user) return;
    
    setProcessing(confirmDialog.user.user_id);
    setConfirmDialog({ ...confirmDialog, open: false });

    try {
      const { data, error } = await supabase.rpc("promote_user_to_admin", {
        _target_user_id: confirmDialog.user.user_id,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "✅ User Promoted",
          description: `${confirmDialog.user.display_name || "User"} is now an admin.`,
        });
        fetchUsers();
      } else {
        toast({
          title: "Already Admin",
          description: "This user is already an admin.",
        });
      }
    } catch (error: any) {
      console.error("Error promoting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleDemote = async () => {
    if (!confirmDialog.user) return;

    setProcessing(confirmDialog.user.user_id);
    setConfirmDialog({ ...confirmDialog, open: false });

    try {
      const { data, error } = await supabase.rpc("demote_admin_to_user", {
        _target_user_id: confirmDialog.user.user_id,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "User Demoted",
          description: `${confirmDialog.user.display_name || "User"} is no longer an admin.`,
        });
        fetchUsers();
      } else {
        toast({
          title: "Not an Admin",
          description: "This user is not an admin.",
        });
      }
    } catch (error: any) {
      console.error("Error demoting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to demote user",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openConfirmDialog = (action: "promote" | "demote", userToModify: UserWithRole) => {
    setConfirmDialog({ open: true, action, user: userToModify });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <UserCog className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">User Role Management</h2>
            <p className="text-sm text-muted-foreground">
              Promote or demote user admin privileges
            </p>
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userRow) => (
                  <TableRow key={userRow.user_id}>
                    <TableCell className="font-medium">
                      {userRow.display_name || "Unknown User"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {userRow.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={userRow.role === "admin" ? "default" : "secondary"}
                        className={userRow.role === "admin" ? "bg-primary" : ""}
                      >
                        {userRow.role === "admin" ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : null}
                        {userRow.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {processing === userRow.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                      ) : userRow.user_id === user?.id ? (
                        <span className="text-xs text-muted-foreground">You</span>
                      ) : userRow.role === "admin" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirmDialog("demote", userRow)}
                          className="text-destructive hover:text-destructive"
                        >
                          <ShieldOff className="w-4 h-4 mr-1" />
                          Demote
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirmDialog("promote", userRow)}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Promote
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Confirm {confirmDialog.action === "promote" ? "Promotion" : "Demotion"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "promote" ? (
                <>
                  Are you sure you want to promote{" "}
                  <strong>{confirmDialog.user?.display_name || "this user"}</strong> to admin?
                  They will have full access to the admin dashboard.
                </>
              ) : (
                <>
                  Are you sure you want to demote{" "}
                  <strong>{confirmDialog.user?.display_name || "this user"}</strong> from admin?
                  They will lose access to the admin dashboard.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === "demote" ? "destructive" : "default"}
              onClick={confirmDialog.action === "promote" ? handlePromote : handleDemote}
            >
              {confirmDialog.action === "promote" ? "Promote to Admin" : "Demote to User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
