
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useInviteValidation } from "@/hooks/useInviteValidation";
import { AuthDialog } from "@/components/AuthDialog";
import { GroupManagementDialog } from "@/components/GroupManagementDialog";
import { AuthActionButtons } from "@/components/AuthActionButtons";
import { AddArtistDialog } from "@/components/AddArtistDialog";
import { AddGenreDialog } from "@/components/AddGenreDialog";
import { FilterSortControls } from "@/components/filters/FilterSortControls";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtistListItem } from "@/components/ArtistListItem";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { FestivalHeader } from "@/components/FestivalHeader";
import { GroupSelector } from "@/components/GroupSelector";
import { InviteLandingPage } from "@/components/InviteLandingPage";
import { ViewToggle } from "@/components/ViewToggle";
import { useArtistFiltering } from "@/hooks/useArtistFiltering";
import { useUrlState } from "@/hooks/useUrlState";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { inviteValidation, isValidating, hasValidInvite, useInvite, clearInvite } = useInviteValidation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAddArtistDialog, setShowAddArtistDialog] = useState(false);
  const [showAddGenreDialog, setShowAddGenreDialog] = useState(false);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const { state: urlState, updateUrlState } = useUrlState();
  
  const {
    filteredArtists,
    loading: artistsLoading,
  } = useArtistFiltering({
    selectedGenres: urlState.genres,
    selectedStages: urlState.stages,
    minRating: urlState.minRating,
    sortBy: urlState.sort,
    selectedGroupId: urlState.groupId,
  });

  // Show loading while validating invite
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Validating invite...</div>
      </div>
    );
  }

  // Show invite landing page if there's a valid invite and user is not logged in
  if (hasValidInvite && !user && inviteValidation) {
    return (
      <InviteLandingPage
        inviteValidation={inviteValidation}
        onSignupSuccess={async () => {
          setShowAuthDialog(false);
          // Wait a moment for auth state to update, then try to use invite
          setTimeout(async () => {
            const { data: { user: newUser } } = await supabase.auth.getUser();
            if (newUser && inviteValidation) {
              await useInvite(newUser.id);
              clearInvite();
            }
          }, 1000);
        }}
      />
    );
  }

  // Show error page for invalid invites
  if (urlState.invite && inviteValidation && !inviteValidation.is_valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite</h1>
          <p className="mb-4">This invite link is no longer valid.</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Go to Festival
          </button>
        </div>
      </div>
    );
  }

  if (loading || artistsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <FestivalHeader />
        
        <AuthActionButtons
          user={user}
          onAddArtist={() => setShowAddArtistDialog(true)}
          onAddGenre={() => setShowAddGenreDialog(true)}
          onSignIn={() => setShowAuthDialog(true)}
          onSignOut={signOut}
        />

        {user && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <GroupSelector
                selectedGroupId={urlState.groupId}
                onGroupChange={(groupId) => updateUrlState({ groupId })}
                onManageGroups={() => setShowGroupManagement(true)}
              />
              <ViewToggle
                view={urlState.view}
                onViewChange={(view) => updateUrlState({ view })}
              />
            </div>
          </div>
        )}

        <FilterSortControls />

        <div className="mt-8">
          {filteredArtists.length === 0 ? (
            <EmptyArtistsState />
          ) : (
            <div className={
              urlState.view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredArtists.map((artist) => (
                urlState.view === 'grid' ? (
                  <ArtistCard key={artist.id} artist={artist} />
                ) : (
                  <ArtistListItem key={artist.id} artist={artist} />
                )
              ))}
            </div>
          )}
        </div>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={() => setShowAuthDialog(false)}
          inviteToken={hasValidInvite ? inviteValidation?.invite_id : undefined}
          groupName={hasValidInvite ? inviteValidation?.group_name : undefined}
        />

        <AddArtistDialog
          open={showAddArtistDialog}
          onOpenChange={setShowAddArtistDialog}
        />

        <AddGenreDialog
          open={showAddGenreDialog}
          onOpenChange={setShowAddGenreDialog}
        />

        <GroupManagementDialog
          open={showGroupManagement}
          onOpenChange={setShowGroupManagement}
        />
      </div>
    </div>
  );
};

export default Index;
