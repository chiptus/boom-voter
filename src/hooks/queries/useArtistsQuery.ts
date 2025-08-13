// Re-export new artist hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useArtists as useArtistsQuery } from "./artists/useArtists";
export { useArtist as useArtistQuery } from "./artists/useArtist";
export { useArtistBySlug as useArtistBySlugQuery } from "./artists/useArtistBySlug";
export { useCreateArtist as useCreateArtistMutation } from "./artists/useCreateArtist";
export { useUpdateArtist as useUpdateArtistMutation } from "./artists/useUpdateArtist";
export { useArchiveArtist as useArchiveArtistMutation } from "./artists/useArchiveArtist";

// Re-export types
export type { Artist } from "./artists/useArtists";
export type { UpdateArtistUpdates } from "./artists/useUpdateArtist";
