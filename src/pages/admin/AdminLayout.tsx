import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPermissionsQuery } from "@/hooks/queries/auth/useUserPermissions";
import { useEffect } from "react";
import { Music, Calendar, BarChart3, UserPlus } from "lucide-react";

export default function AdminLayout() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");
  const { data: isSuperAdmin = false, isLoading: isLoadingSuperAdmin } =
    useUserPermissionsQuery(user?.id, "is_admin");

  // Authentication and permission checks
  useEffect(() => {
    if (authLoading || isLoadingPermissions) return;

    if (!user) {
      navigate("/");
      return;
    }

    if (!canEdit) {
      navigate("/");
    }
  }, [user, authLoading, navigate, isLoadingPermissions, canEdit]);

  // Determine current tab based on location
  function getCurrentTab() {
    const path = location.pathname;
    if (path.startsWith("/admin/festivals")) return "festivals";
    if (path.includes("/content")) return "content";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/admins")) return "admins";
    return "artists";
  }

  function handleTabChange(value: string) {
    switch (value) {
      case "artists":
        navigate("/admin");
        break;
      case "festivals":
        navigate("/admin/festivals");
        break;
      case "analytics":
        navigate("/admin/analytics");
        break;
      case "admins":
        navigate("/admin/admins");
        break;
    }
  }

  if (isLoadingPermissions || authLoading || isLoadingSuperAdmin) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!canEdit) return null;

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader
          showBackButton
          backLabel="Back to app"
          title="Admin Dashboard"
          subtitle="Platform Management"
          description="Manage artists, genres, and admin permissions"
        />

        <div className="mt-8">
          <Tabs
            value={getCurrentTab()}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList
              className={`grid w-full ${isSuperAdmin ? "grid-cols-4" : "grid-cols-3"} bg-white/10 backdrop-blur-md`}
            >
              <TabsTrigger
                value="artists"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white"
              >
                <Music className="h-4 w-4 mr-2" />
                Artists
              </TabsTrigger>
              <TabsTrigger
                value="festivals"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Festival Management
              </TabsTrigger>
              {isSuperAdmin && (
                <>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="admins"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Admin Roles
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>

          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
