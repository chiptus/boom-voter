import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Trash2, Crown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AdminRole = Database["public"]["Tables"]["admin_roles"]["Row"] & {
  profile?: {
    username: string | null;
    email: string | null;
  };
};

export const AdminRolesTable = () => {
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Database["public"]["Enums"]["admin_role"]>("moderator");
  const [addingUser, setAddingUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminRoles();
  }, []);

  const fetchAdminRoles = async () => {
    try {
      const { data: roles, error } = await supabase
        .from("admin_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (roles) {
        // Fetch profile information for each admin
        const rolesWithProfiles = await Promise.all(
          roles.map(async (role) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, email")
              .eq("id", role.user_id)
              .single();

            return {
              ...role,
              profile: profile || { username: null, email: null }
            };
          })
        );

        setAdminRoles(rolesWithProfiles);
      }
    } catch (error) {
      console.error("Error fetching admin roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch admin roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);

    try {
      // First, get the user ID by email
      const { data: userId, error: userError } = await supabase
        .rpc("get_user_id_by_email", { user_email: newUserEmail });

      if (userError || !userId) {
        toast({
          title: "User not found",
          description: "No user found with this email address",
          variant: "destructive",
        });
        return;
      }

      // Check if user already has an admin role
      const { data: existingRole } = await supabase
        .from("admin_roles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existingRole) {
        toast({
          title: "User already has admin role",
          description: `This user already has the ${existingRole.role} role`,
          variant: "destructive",
        });
        return;
      }

      // Add the admin role
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.id) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        
        throw new Error("User not found");
      }

      const { error: insertError } = await supabase
        .from("admin_roles")
        .insert({
          user_id: userId,
          role: newUserRole,
          created_by: user?.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `User added as ${newUserRole}`,
      });

      setNewUserEmail("");
      setNewUserRole("moderator");
      setAddDialogOpen(false);
      fetchAdminRoles();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: "Failed to add admin role",
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveAdmin = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("admin_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin role removed",
      });

      fetchAdminRoles();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (roleId: string, newRole: Database["public"]["Enums"]["admin_role"]) => {
    try {
      const { error } = await supabase
        .from("admin_roles")
        .update({ role: newRole })
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin role updated",
      });

      fetchAdminRoles();
    } catch (error) {
      console.error("Error updating admin role:", error);
      toast({
        title: "Error",
        description: "Failed to update admin role",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "default";
      case "admin":
        return "secondary";
      case "moderator":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading admin roles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Admin Roles Management
            </CardTitle>
            <CardDescription>
              Manage admin roles and permissions for the platform
            </CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Add a new admin role by entering the user's email address
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="user-email">User Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="admin-role">Admin Role</Label>
                  <Select value={newUserRole} onValueChange={(value: Database["public"]["Enums"]["admin_role"]) => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={addingUser}>
                  {addingUser ? "Adding Admin..." : "Add Admin"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminRoles.map((adminRole) => (
              <TableRow key={adminRole.id}>
                <TableCell className="font-medium">
                  {adminRole.profile?.username || "No username"}
                </TableCell>
                <TableCell>{adminRole.profile?.email}</TableCell>
                <TableCell>
                  {adminRole.role === "super_admin" ? (
                    <Badge variant={getRoleBadgeVariant(adminRole.role)}>
                      {adminRole.role.replace("_", " ")}
                    </Badge>
                  ) : (
                    <Select
                      value={adminRole.role}
                      onValueChange={(value: Database["public"]["Enums"]["admin_role"]) => 
                        handleRoleChange(adminRole.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(adminRole.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {adminRole.role !== "super_admin" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin Role</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove the admin role from {adminRole.profile?.username || adminRole.profile?.email}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveAdmin(adminRole.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {adminRoles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No admin roles found
          </div>
        )}
      </CardContent>
    </Card>
  );
};