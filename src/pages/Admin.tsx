import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { AppHeader } from "@/components/AppHeader";
import { ArtistsTable } from "@/components/Admin/ArtistsTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user, loading } = useAuth();
  const { canEditArtists } = useGroups();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      // Wait for auth loading to complete
      if (loading) return;
      
      // If not authenticated, redirect
      if (!user) {
        navigate("/");
        return;
      }
      
      // Check permissions
      const permission = await canEditArtists();
      setHasPermission(permission);
      
      if (!permission) {
        navigate("/");
      }
    };
    
    checkPermissions();
  }, [user, loading, canEditArtists, navigate]);

  if (hasPermission === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!hasPermission) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <AppHeader 
          showBackButton={true}
          backTo="/"
          backLabel="Back to Artists"
          title="Admin Dashboard"
          subtitle="Manage Artists"
          description="Edit artist information, schedules, and details"
        />
        
        <div className="mt-8">
          <ArtistsTable />
        </div>
      </div>
    </div>
  );
}