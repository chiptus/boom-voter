// Re-export new sets hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useSetsQuery } from "./sets/useSets";
export { useSetBySlugQuery } from "./sets/useSetBySlug";
export { useSetsByEditionQuery } from "./sets/useSetsByEdition";
export { useCreateSetMutation } from "./sets/useCreateSet";
export { useUpdateSetMutation } from "./sets/useUpdateSet";
export { useDeleteSetMutation } from "./sets/useDeleteSet";
export { useAddArtistToSetMutation } from "./sets/useAddArtistToSet";
export { useRemoveArtistFromSetMutation } from "./sets/useRemoveArtistFromSet";

// Re-export types
export type { FestivalSet, Stage } from "./sets/useSets";
