// Re-export new voting hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useUserVotes as useUserVotesQuery } from "./voting/useUserVotes";
export { useVote as useVoteMutation } from "./voting/useVote";
