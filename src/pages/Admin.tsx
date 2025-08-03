import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { ArtistsTable } from "@/components/Admin/ArtistsTable";
import { AdminRolesTable } from "@/components/Admin/AdminRolesTable";
import { AnalyticsTable } from "@/components/Admin/AnalyticsTable";
import { FestivalHierarchyManagement } from "@/components/Admin/FestivalHierarchyManagement";
import { AddArtistDialog } from "@/components/Index/AddArtistDialog";
import { AddGenreDialog } from "@/components/Index/AddGenreDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Music, Tag, UserPlus, Plus, BarChart3, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserPermissionsQuery } from "@/hooks/queries/useGroupsQuery";
import { ArtistsManagement } from "@/components/Admin/ArtistsManagement";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [addArtistOpen, setAddArtistOpen] = useState(false);
  const [addGenreOpen, setAddGenreOpen] = useState(false);

  const navigate = useNavigate();
  const { tab, festivalId } = useParams<{ tab?: string; festivalId?: string }>();
  const { toast } = useToast();

  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const { data: isSuperAdmin = false, isLoading: isLoadingSuperAdmin } =
    useUserPermissionsQuery(user?.id, "is_admin");

 

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading || isLoadingPermissions) {
      return;
    }

    // If not authenticated, redirect
    if (!user) {
      console.log("redirecting to /, no user");
      navigate("/");
      return;
    }

    if (!canEdit) {
      console.log("redirecting to /, no permission");
      navigate("/");
    }
  }, [user, authLoading, navigate, isLoadingPermissions, canEdit]);

  if (isLoadingPermissions || authLoading || isLoadingSuperAdmin) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!canEdit) {
    return null; // Will redirect
  }

  const handleArtistAdded = () => {
    setAddArtistOpen(false);
    toast({
      title: "Success",
      description: "Artist added successfully!",
    });
  };

  // If we're in a festival management route, always show festivals tab
  const currentTab = festivalId ? "festivals" : (tab || "artists");

  const handleTabChange = (value: string) => {
    if (value === "artists") {
      navigate("/admin");
    } else {
      navigate(`/admin/${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader
          showBackButton={true}
          backTo="/"
          backLabel="Back to Artists"
          title="Admin Dashboard"
          subtitle="Platform Management"
          description="Manage artists, genres, and admin permissions"
        />

        <div className="mt-8">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-5' : 'grid-cols-4'} bg-white/10 backdrop-blur-md`}>
              <TabsTrigger
                value="artists"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Music className="h-4 w-4 mr-2" />
                Artists
              </TabsTrigger>
              <TabsTrigger
                value="festivals"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Festival Management
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </TabsTrigger>
              {isSuperAdmin && (
                <>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="admins"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Admin Roles
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="artists" className="mt-6">
              <ArtistsManagement />
            </TabsContent>

            <TabsContent value="festivals" className="mt-6">
              <FestivalHierarchyManagement />
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Music className="h-5 w-5" />
                      Add Artist
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Add a new artist to the festival lineup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setAddArtistOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Music className="h-4 w-4 mr-2" />
                      Add New Artist
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Tag className="h-5 w-5" />
                      Add Genre
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Add a new music genre for categorization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setAddGenreOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Add New Genre
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {isSuperAdmin && (
              <>
                <TabsContent value="analytics" className="mt-6">
                  <AnalyticsTable />
                </TabsContent>
                <TabsContent value="admins" className="mt-6">
                  <AdminRolesTable />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      <AddArtistDialog
        open={addArtistOpen}
        onOpenChange={setAddArtistOpen}
        onSuccess={handleArtistAdded}
      />

      <AddGenreDialog open={addGenreOpen} onOpenChange={setAddGenreOpen} />
    </div>
  );
}
