import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const SoundCloudUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  permalink_url: z.string(),
});

export const SoundCloudTrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  permalink_url: z.string(),
  stream_url: z.string().optional(),
  duration: z.number(),
  artwork_url: z.string().nullable(),
});

export const SoundCloudPlaylistSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  permalink_url: z.string(),
  artwork_url: z.string().nullable(),
  user: SoundCloudUserSchema,
  track_count: z.number(),
  tracks: z.array(SoundCloudTrackSchema).optional(),
  likes_count: z.number().optional(),
  reposts_count: z.number().optional(),
  created_at: z.string(),
});

export const SoundCloudTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number().optional(),
  scope: z.string().optional(),
});

export const SoundCloudErrorResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  link: z.string().optional(),
  status: z.string(),
  errors: z
    .array(
      z.object({
        error_message: z.string(),
      }),
    )
    .optional(),
  error: z.any().nullable().optional(),
});

export const SoundCloudPlaylistArraySchema = z.array(SoundCloudPlaylistSchema);
export const SoundCloudTrackArraySchema = z.array(SoundCloudTrackSchema);

export type SoundCloudUser = z.infer<typeof SoundCloudUserSchema>;
export type SoundCloudPlaylist = z.infer<typeof SoundCloudPlaylistSchema>;
export type SoundCloudTrack = z.infer<typeof SoundCloudTrackSchema>;
export type SoundCloudTokenResponse = z.infer<
  typeof SoundCloudTokenResponseSchema
>;
export type SoundCloudErrorResponse = z.infer<
  typeof SoundCloudErrorResponseSchema
>;
