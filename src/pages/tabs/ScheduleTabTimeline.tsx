import { useAuth } from "@/contexts/AuthContext";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { Timeline } from "@/components/timeline/horizontal/Timeline";

export function ScheduleTabTimeline() {
  const { user, showAuthDialog } = useAuth();
  const { userVotes, handleVote } = useOfflineVoting(user);

  async function handleVoteAction(artistId: string, voteType: number) {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      showAuthDialog();
    }
  }

  return <Timeline userVotes={userVotes} onVote={handleVoteAction} />;
}
