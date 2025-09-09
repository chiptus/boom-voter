import { Button } from "@/components/ui/button";
import { useVote } from "@/hooks/queries/voting/useVote";
import { useUserVotes } from "@/hooks/queries/voting/useUserVotes";
import { VOTE_CONFIG } from "@/lib/voteConfig";
import { motion } from "framer-motion";

interface VotingActionsProps {
  setId: string;
  userId: string;
  onVote: (voteType: number) => void;
  onSkip: () => void;
}

export function VotingActions({
  setId,
  userId,
  onVote,
  onSkip,
}: VotingActionsProps) {
  const voteMutation = useVote();
  const { data: userVotes = {} } = useUserVotes(userId);

  const existingVote = userVotes[setId];

  async function handleVote(voteType: number) {
    try {
      await voteMutation.mutateAsync({
        setId,
        voteType,
        userId,
        existingVote,
      });
      onVote(voteType);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  }

  const wontGoConfig = VOTE_CONFIG.wontGo;
  const interestedConfig = VOTE_CONFIG.interested;
  const mustGoConfig = VOTE_CONFIG.mustGo;

  const WontGoIcon = wontGoConfig.icon;
  const InterestedIcon = interestedConfig.icon;
  const MustGoIcon = mustGoConfig.icon;

  return (
    <div className="flex items-center justify-center space-x-6 px-4">
      {/* Won't Go */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-gray-500 hover:bg-gray-500 hover:border-gray-500 text-gray-500 hover:text-white"
          onClick={() => handleVote(wontGoConfig.value)}
          disabled={voteMutation.isPending}
        >
          <WontGoIcon className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Skip without voting */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white"
          onClick={onSkip}
        >
          Skip
        </Button>
      </motion.div>

      {/* Interested */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-blue-500 hover:bg-blue-500 hover:border-blue-500 text-blue-500 hover:text-white"
          onClick={() => handleVote(interestedConfig.value)}
          disabled={voteMutation.isPending}
        >
          <InterestedIcon className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Must Go */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-orange-500 hover:bg-orange-500 hover:border-orange-500 text-orange-500 hover:text-white"
          onClick={() => handleVote(mustGoConfig.value)}
          disabled={voteMutation.isPending}
        >
          <MustGoIcon className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
