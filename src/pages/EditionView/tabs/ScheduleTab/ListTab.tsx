import { ListSchedule } from "@/pages/EditionView/tabs/ScheduleTab/list/ListSchedule";
import { ListFilters } from "@/pages/EditionView/tabs/ScheduleTab/ListFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";

export function ScheduleTabList() {
  const { user, showAuthDialog } = useAuth();
  const { userVotes, handleVote } = useOfflineVoting(user);

  async function handleVoteAction(artistId: string, voteType: number) {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      showAuthDialog();
    }
  }

  return (
    <>
      <ListFilters />
      <ListSchedule userVotes={userVotes} onVote={handleVoteAction} />
    </>
  );
}
