import { useAuth } from "@/contexts/AuthContext";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { TimelineTab as TimelineTabComponent } from "@/components/timeline/TimelineTab";

export function TimelineTab() {
  const { user, showAuthDialog } = useAuth();
  const { userVotes, handleVote } = useOfflineVoting(user);

  async function handleVoteAction(artistId: string, voteType: number) {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      showAuthDialog();
    }
  }

  return (
    <TimelineTabComponent userVotes={userVotes} onVote={handleVoteAction} />
  );
}
