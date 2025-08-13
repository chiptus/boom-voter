// Re-export new artist hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useArtistsQuery } from "./artists/useArtists";
export { useArtistQuery } from "./artists/useArtist";
export { useArtistBySlugQuery } from "./artists/useArtistBySlug";
export { useCreateArtistMutation } from "./artists/useCreateArtist";
export { useUpdateArtistMutation } from "./artists/useUpdateArtist";
export { useArchiveArtistMutation } from "./artists/useArchiveArtist";

// Re-export types
export type { Artist } from "./artists/useArtists";
export type { UpdateArtistUpdates } from "./artists/useUpdateArtist";
