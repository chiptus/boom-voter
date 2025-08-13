// Re-export new sets hooks for backwards compatibility
// TODO: Update imports throughout codebase to use direct imports
export { useSets as useSetsQuery } from "./sets/useSets";
export { useSetBySlug as useSetBySlugQuery } from "./sets/useSetBySlug";
export { useSetsByEdition as useSetsByEditionQuery } from "./sets/useSetsByEdition";
export { useCreateSet as useCreateSetMutation } from "./sets/useCreateSet";
export { useUpdateSet as useUpdateSetMutation } from "./sets/useUpdateSet";
export { useDeleteSet as useDeleteSetMutation } from "./sets/useDeleteSet";
export { useAddArtistToSet as useAddArtistToSetMutation } from "./sets/useAddArtistToSet";
export { useRemoveArtistFromSet as useRemoveArtistFromSetMutation } from "./sets/useRemoveArtistFromSet";

// Re-export types
export type { FestivalSet, Stage } from "./sets/useSets";
