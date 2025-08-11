-- Comprehensive seed data for festival voting app
-- This file creates realistic test data for local development

-- First, let's insert test users into auth.users (these would normally be created via Supabase Auth)
-- Note: In production, users are created through authentication, not direct SQL inserts
-- This is for local testing only

-- Insert test users into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'admin@festival.com', '$2a$10$example_hash', now(), now(), now(), '{"username": "admin"}', false, 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'alice@example.com', '$2a$10$example_hash', now(), now(), now(), '{"username": "alice_music"}', false, 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'bob@example.com', '$2a$10$example_hash', now(), now(), now(), '{"username": "bob_beats"}', false, 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'charlie@example.com', '$2a$10$example_hash', now(), now(), now(), '{"username": "charlie_vibes"}', false, 'authenticated'),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'diana@example.com', '$2a$10$example_hash', now(), now(), now(), '{"username": "diana_dance"}', false, 'authenticated'),
  ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'eve@example.com', '$2a$10$example_hash', now(), now(), now(), '{"username": "eve_electronic"}', false, 'authenticated');

-- Profiles are automatically created by the handle_new_user() trigger
-- when users are inserted into auth.users, so no manual insertion needed

-- Create admin role for the admin user
INSERT INTO public.admin_roles (user_id, role, created_by, created_at) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'super_admin', '11111111-1111-1111-1111-111111111111', now());

-- Get genre IDs for reference
-- (The genres were already seeded in the initial migration)

-- Create test groups
INSERT INTO public.groups (id, name, description, created_by, created_at, updated_at) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Festival Friends', 'Main group for our festival crew', '22222222-2222-2222-2222-222222222222', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Electronic Music Lovers', 'For serious electronic music enthusiasts', '33333333-3333-3333-3333-333333333333', now(), now());

-- Add members to groups
INSERT INTO public.group_members (group_id, user_id, role, joined_at) VALUES 
  -- Festival Friends group
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'admin', now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member', now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'member', now()),
  -- Electronic Music Lovers group
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'admin', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'member', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 'member', now());

-- Create group invites for testing
INSERT INTO public.group_invites (group_id, created_by, invite_token, expires_at, max_uses, is_active) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'FESTIVAL_FRIENDS_2025', now() + interval '30 days', 10, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'ELECTRONIC_LOVERS_2025', now() + interval '30 days', 5, true);

-- Insert festival artists with realistic schedule (July 12-14, 2025)
INSERT INTO public.artists (
  id, name, description, stage, time_start, time_end, 
  added_by, spotify_url, soundcloud_url, soundcloud_followers, created_at, slug
) VALUES 
  -- July 12, 2025 (Friday)
  ('a1111111-1111-1111-1111-111111111111', 'Maya Jane Coles', 'British DJ and producer known for her deep house and techno sets', 
   'Main Stage', '2025-07-12 22:00:00+00', '2025-07-12 23:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/1234567', 'https://soundcloud.com/mayajanecoles', 125000, now(), 'maya-jane-coles'),
  ('a2222222-2222-2222-2222-222222222222', 'Ben Böhmer', 'German melodic house and techno producer', 
   'Club Stage', '2025-07-12 20:00:00+00', '2025-07-12 21:30:00+00', '22222222-2222-2222-2222-222222222222',
   'https://open.spotify.com/artist/2345678', 'https://soundcloud.com/benbohmer', 89000, now(), 'ben-bohmer'),
  ('a3333333-3333-3333-3333-333333333333', 'Kiara Scuro', 'Rising star in dark techno', 
   'Club Stage', '2025-07-12 23:30:00+00', '2025-07-13 01:00:00+00', '33333333-3333-3333-3333-333333333333',
   NULL, 'https://soundcloud.com/kiarascuro', 45000, now(), 'kiara-scuro'),
  ('a4444444-4444-4444-4444-444444444444', 'Nils Frahm', 'Ambient electronic composer and pianist', 
   'Ambient Garden', '2025-07-12 18:00:00+00', '2025-07-12 19:30:00+00', '44444444-4444-4444-4444-444444444444',
   'https://open.spotify.com/artist/3456789', NULL, NULL, now(), 'nils-frahm'),
  ('a5555555-5555-5555-5555-555555555555', 'Charlotte de Witte', 'Belgian techno DJ and producer', 
   'Main Stage', '2025-07-13 01:00:00+00', '2025-07-13 02:30:00+00', '22222222-2222-2222-2222-222222222222',
   'https://open.spotify.com/artist/4567890', 'https://soundcloud.com/charlottedewitte', 234000, now(), 'charlotte-de-witte'),
  -- July 13, 2025 (Saturday)
  ('a6666666-6666-6666-6666-666666666666', 'Stephan Bodzin', 'German techno producer and live performer', 
   'Main Stage', '2025-07-13 21:00:00+00', '2025-07-13 22:30:00+00', '33333333-3333-3333-3333-333333333333',
   'https://open.spotify.com/artist/5678901', 'https://soundcloud.com/stephanbodzin', 156000, now(), 'stephan-bodzin'),
  ('a7777777-7777-7777-7777-777777777777', 'Lane 8', 'American deep house and progressive house producer', 
   'Main Stage', '2025-07-13 19:00:00+00', '2025-07-13 20:30:00+00', '55555555-5555-5555-5555-555555555555',
   'https://open.spotify.com/artist/6789012', 'https://soundcloud.com/lane8music', 189000, now(), 'lane-8'),
  ('a8888888-8888-8888-8888-888888888888', 'Netsky', 'Belgian drum and bass producer', 
   'Club Stage', '2025-07-13 22:30:00+00', '2025-07-14 00:00:00+00', '66666666-6666-6666-6666-666666666666',
   'https://open.spotify.com/artist/7890123', 'https://soundcloud.com/netsky', 178000, now(), 'netsky'),
  ('a9999999-9999-9999-9999-999999999999', 'Bonobo', 'British downtempo and electronic artist', 
   'Ambient Garden', '2025-07-13 17:00:00+00', '2025-07-13 18:30:00+00', '44444444-4444-4444-4444-444444444444',
   'https://open.spotify.com/artist/8901234', 'https://soundcloud.com/bonobomusic', 267000, now(), 'bonobo'),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Amelie Lens', 'Belgian techno DJ', 
   'Club Stage', '2025-07-14 00:00:00+00', '2025-07-14 01:30:00+00', '22222222-2222-2222-2222-222222222222',
   'https://open.spotify.com/artist/9012345', 'https://soundcloud.com/amelielens', 145000, now(), 'amelie-lens'),
  -- July 14, 2025 (Sunday)
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maceo Plex', 'Cuban-American techno and house producer', 
   'Main Stage', '2025-07-14 20:00:00+00', '2025-07-14 21:30:00+00', '33333333-3333-3333-3333-333333333333',
   'https://open.spotify.com/artist/0123456', 'https://soundcloud.com/maceoplex', 198000, now(), 'maceo-plex'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Paul Kalkbrenner', 'German techno producer and live act', 
   'Main Stage', '2025-07-14 22:00:00+00', '2025-07-14 23:30:00+00', '55555555-5555-5555-5555-555555555555',
   'https://open.spotify.com/artist/1234567', 'https://soundcloud.com/paulkalkbrenner', 289000, now(), 'paul-kalkbrenner'),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ott', 'British dub and psychedelic producer', 
   'Ambient Garden', '2025-07-14 16:00:00+00', '2025-07-14 17:30:00+00', '66666666-6666-6666-6666-666666666666',
   'https://open.spotify.com/artist/2345678', 'https://soundcloud.com/ottsonic', 67000, now(), 'ott'),
  ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hybrid Minds', 'British liquid drum and bass duo', 
   'Club Stage', '2025-07-14 19:00:00+00', '2025-07-14 20:30:00+00', '44444444-4444-4444-4444-444444444444',
   'https://open.spotify.com/artist/3456789', 'https://soundcloud.com/hybridminds', 112000, now(), 'hybrid-minds'),
  ('aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tourist', 'British electronic music producer', 
   'Club Stage', '2025-07-14 17:30:00+00', '2025-07-14 18:30:00+00', '22222222-2222-2222-2222-222222222222',
   'https://open.spotify.com/artist/4567890', 'https://soundcloud.com/touristmusic', 89000, now(), 'tourist'),
  -- Additional artists for variety
  ('aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Four Tet', 'British electronic music producer', 
   'Ambient Garden', '2025-07-12 19:30:00+00', '2025-07-12 21:00:00+00', '33333333-3333-3333-3333-333333333333',
   'https://open.spotify.com/artist/5678901', 'https://soundcloud.com/fourtet', 234000, now(), 'four-tet'),
  ('aaaaaaa8-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Moderat', 'German electronic music group', 
   'Main Stage', '2025-07-12 16:00:00+00', '2025-07-12 17:30:00+00', '55555555-5555-5555-5555-555555555555',
   'https://open.spotify.com/artist/6789012', 'https://soundcloud.com/moderat-band', 167000, now(), 'moderat'),
  ('aaaaaaa9-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Disclosure', 'British electronic music duo', 
   'Main Stage', '2025-07-13 23:00:00+00', '2025-07-14 00:30:00+00', '66666666-6666-6666-6666-666666666666',
   'https://open.spotify.com/artist/7890123', 'https://soundcloud.com/disclosure', 345000, now(), 'disclosure'),
  ('aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Shpongle', 'British psychedelic electronic duo', 
   'Ambient Garden', '2025-07-13 20:30:00+00', '2025-07-13 22:00:00+00', '44444444-4444-4444-4444-444444444444',
   'https://open.spotify.com/artist/8901234', 'https://soundcloud.com/shpongle', 78000, now(), 'shpongle'),
  ('aaaaaccc-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Floating Points', 'British electronic musician and neuroscientist', 
   'Club Stage', '2025-07-14 21:30:00+00', '2025-07-14 23:00:00+00', '22222222-2222-2222-2222-222222222222',
   'https://open.spotify.com/artist/9012345', 'https://soundcloud.com/floatingpoints', 89000, now(), 'floating-points');

-- Now insert artist-genre relationships
INSERT INTO public.artist_music_genres (artist_id, music_genre_id) VALUES
  ('a1111111-1111-1111-1111-111111111111', (SELECT id FROM music_genres WHERE name = 'House')),
  ('a2222222-2222-2222-2222-222222222222', (SELECT id FROM music_genres WHERE name = 'Progressive')),
  ('a3333333-3333-3333-3333-333333333333', (SELECT id FROM music_genres WHERE name = 'Techno')),
  ('a4444444-4444-4444-4444-444444444444', (SELECT id FROM music_genres WHERE name = 'Ambient')),
  ('a5555555-5555-5555-5555-555555555555', (SELECT id FROM music_genres WHERE name = 'Techno')),
  ('a6666666-6666-6666-6666-666666666666', (SELECT id FROM music_genres WHERE name = 'Techno')),
  ('a7777777-7777-7777-7777-777777777777', (SELECT id FROM music_genres WHERE name = 'Progressive')),
  ('a8888888-8888-8888-8888-888888888888', (SELECT id FROM music_genres WHERE name = 'Drum & Bass')),
  ('a9999999-9999-9999-9999-999999999999', (SELECT id FROM music_genres WHERE name = 'Downtempo')),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Techno')),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'House')),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Techno')),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Dub')),
  ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Drum & Bass')),
  ('aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Electronic')),
  ('aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Electronic')),
  ('aaaaaaa8-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Electronic')),
  ('aaaaaaa9-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'House')),
  ('aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Experimental')),
  ('aaaaaccc-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM music_genres WHERE name = 'Experimental'));

-- Insert festival (with unique slug to avoid conflicts)
INSERT INTO public.festivals (id, name, slug, description, published, created_at, updated_at) VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'Test festival', 'test', 'Psychedelic music festival in Portugal', true, now(), now());

-- Insert festival edition
INSERT INTO public.festival_editions (id, festival_id, year, slug, name, description, location, start_date, end_date, published, created_at, updated_at) VALUES 
  ('e1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 2025, '2025', 'Boom Festival 2025', 'The 2025 edition of Boom Festival', 'Idanha-a-Nova, Portugal', '2025-07-12', '2025-07-14', true, now(), now());

-- Insert stages
INSERT INTO public.stages (id, name, festival_edition_id, created_at, updated_at) VALUES 
  ('11111111-1111-1111-1111-11111111111a', 'Main Stage', 'e1111111-1111-1111-1111-111111111111', now(), now()),
  ('22222222-2222-2222-2222-22222222222b', 'Club Stage', 'e1111111-1111-1111-1111-111111111111', now(), now()),
  ('33333333-3333-3333-3333-33333333333c', 'Ambient Garden', 'e1111111-1111-1111-1111-111111111111', now(), now());

-- Insert sets (one for each artist, using their name and schedule)
INSERT INTO public.sets (id, name, slug, festival_edition_id, stage_id, time_start, time_end, description, created_by, created_at, updated_at) VALUES 
  -- Friday July 12, 2025
  ('11111111-1111-1111-1111-111111111111', 'Maya Jane Coles', 'maya-jane-coles-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-12 22:00:00+00', '2025-07-12 23:30:00+00', 'British DJ and producer known for her deep house and techno sets', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Ben Böhmer', 'ben-bohmer-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-12 20:00:00+00', '2025-07-12 21:30:00+00', 'German melodic house and techno producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Kiara Scuro', 'kiara-scuro-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-12 23:30:00+00', '2025-07-13 01:00:00+00', 'Rising star in dark techno', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Nils Frahm', 'nils-frahm-set', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-33333333333c', '2025-07-12 18:00:00+00', '2025-07-12 19:30:00+00', 'Ambient electronic composer and pianist', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('55555555-5555-5555-5555-555555555555', 'Charlotte de Witte', 'charlotte-de-witte-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-13 01:00:00+00', '2025-07-13 02:30:00+00', 'Belgian techno DJ and producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('77777777-7777-7777-7777-777777777777', 'Four Tet', 'four-tet-set', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-33333333333c', '2025-07-12 19:30:00+00', '2025-07-12 21:00:00+00', 'British electronic music producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('88888888-8888-8888-8888-888888888888', 'Moderat', 'moderat-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-12 16:00:00+00', '2025-07-12 17:30:00+00', 'German electronic music group', '11111111-1111-1111-1111-111111111111', now(), now()),
  
  -- Saturday July 13, 2025
  ('66666666-6666-6666-6666-666666666666', 'Stephan Bodzin', 'stephan-bodzin-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-13 21:00:00+00', '2025-07-13 22:30:00+00', 'German techno producer and live performer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('99999999-9999-9999-9999-999999999999', 'Lane 8', 'lane-8-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-13 19:00:00+00', '2025-07-13 20:30:00+00', 'American deep house and progressive house producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Netsky', 'netsky-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-13 22:30:00+00', '2025-07-14 00:00:00+00', 'Belgian drum and bass producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bonobo', 'bonobo-set', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-33333333333c', '2025-07-13 17:00:00+00', '2025-07-13 18:30:00+00', 'British downtempo and electronic artist', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Amelie Lens', 'amelie-lens-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-14 00:00:00+00', '2025-07-14 01:30:00+00', 'Belgian techno DJ', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Disclosure', 'disclosure-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-13 23:00:00+00', '2025-07-14 00:30:00+00', 'British electronic music duo', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Shpongle', 'shpongle-set', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-33333333333c', '2025-07-13 20:30:00+00', '2025-07-13 22:00:00+00', 'British psychedelic electronic duo', '11111111-1111-1111-1111-111111111111', now(), now()),
  
  -- Sunday July 14, 2025  
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Maceo Plex', 'maceo-plex-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-14 20:00:00+00', '2025-07-14 21:30:00+00', 'Cuban-American techno and house producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Paul Kalkbrenner', 'paul-kalkbrenner-set', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-11111111111a', '2025-07-14 22:00:00+00', '2025-07-14 23:30:00+00', 'German techno producer and live act', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('aaaaaaac-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ott', 'ott-set', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-33333333333c', '2025-07-14 16:00:00+00', '2025-07-14 17:30:00+00', 'British dub and psychedelic producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('aaaaaaad-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hybrid Minds', 'hybrid-minds-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-14 19:00:00+00', '2025-07-14 20:30:00+00', 'British liquid drum and bass duo', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('aaaaaaae-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tourist', 'tourist-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-14 17:30:00+00', '2025-07-14 18:30:00+00', 'British electronic music producer', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('aaaaaaaf-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Floating Points', 'floating-points-set', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-22222222222b', '2025-07-14 21:30:00+00', '2025-07-14 23:00:00+00', 'British electronic musician and neuroscientist', '11111111-1111-1111-1111-111111111111', now(), now());

-- Link each artist to their corresponding set
INSERT INTO public.set_artists (set_id, artist_id, role, created_at) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'performer', now()),
  ('22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'performer', now()),
  ('33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'performer', now()),
  ('44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'performer', now()),
  ('55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 'performer', now()),
  ('66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 'performer', now()),
  ('99999999-9999-9999-9999-999999999999', 'a7777777-7777-7777-7777-777777777777', 'performer', now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a8888888-8888-8888-8888-888888888888', 'performer', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a9999999-9999-9999-9999-999999999999', 'performer', now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('aaaaaaac-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('aaaaaaad-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('aaaaaaae-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('77777777-7777-7777-7777-777777777777', 'aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('88888888-8888-8888-8888-888888888888', 'aaaaaaa8-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaa9-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now()),
  ('aaaaaaaf-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaccc-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'performer', now());

-- Insert some sample votes for sets (instead of artists)
INSERT INTO public.votes (user_id, set_id, vote_type, created_at) VALUES 
  -- Admin votes (tends to vote high)
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 2, now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 2, now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 2, now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 2, now() - interval '2 days'),
  
  -- Alice votes (Festival Friends group)
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2, now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 2, now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 2, now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 2, now() - interval '1 day'),
  
  -- Bob votes (Electronic Music Lovers group) - prefers harder techno
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 2, now() - interval '1 day'),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 2, now() - interval '1 day'),
  ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 2, now() - interval '1 day'),
  ('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2, now() - interval '1 day'),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, now() - interval '1 day'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 1, now() - interval '1 day'),
  
  -- Charlie votes (in both groups) - mixed tastes
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 1, now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 2, now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaad-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2, now() - interval '1 day'),
  
  -- Diana votes (Festival Friends) - loves progressive and melodic
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 2, now() - interval '6 hours'),
  ('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 2, now() - interval '6 hours'),
  ('55555555-5555-5555-5555-555555555555', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 2, now() - interval '6 hours'),
  ('55555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 1, now() - interval '6 hours'),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', -1, now() - interval '6 hours'),
  
  -- Eve votes (Electronic Music Lovers) - drum & bass fan
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, now() - interval '3 hours'),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaad-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, now() - interval '3 hours'),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaac-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, now() - interval '3 hours'),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaae-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, now() - interval '3 hours'),
  ('66666666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 2, now() - interval '3 hours');

-- Insert artist knowledge (who knows which artists)
INSERT INTO public.artist_knowledge (user_id, artist_id, created_at) VALUES 
  -- Alice knows popular artists
  ('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', now()),
  ('22222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', now()),
  ('22222222-2222-2222-2222-222222222222', 'a7777777-7777-7777-7777-777777777777', now()),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now()),
  
  -- Bob knows techno artists
  ('33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', now()),
  ('33333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', now()),
  ('33333333-3333-3333-3333-333333333333', 'a6666666-6666-6666-6666-666666666666', now()),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now()),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now()),
  
  -- Diana knows melodic artists
  ('55555555-5555-5555-5555-555555555555', 'a2222222-2222-2222-2222-222222222222', now()),
  ('55555555-5555-5555-5555-555555555555', 'a4444444-4444-4444-4444-444444444444', now()),
  ('55555555-5555-5555-5555-555555555555', 'a9999999-9999-9999-9999-999999999999', now()),
  ('55555555-5555-5555-5555-555555555555', 'aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now()),
  
  -- Eve knows drum & bass
  ('66666666-6666-6666-6666-666666666666', 'a8888888-8888-8888-8888-888888888888', now()),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now());

-- Insert sample artist notes
INSERT INTO public.artist_notes (user_id, artist_id, note_content, created_at) VALUES 
  ('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Absolutely incredible live performer! Her set at Fabric was life-changing.', now()),
  ('22222222-2222-2222-2222-222222222222', 'a7777777-7777-7777-7777-777777777777', 'Perfect for sunset vibes. His melodic progressions are unmatched.', now()),
  ('33333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', 'Raw, powerful techno. Always brings the energy!', now()),
  ('33333333-3333-3333-3333-333333333333', 'a6666666-6666-6666-6666-666666666666', 'His live setup is incredible. Real instruments mixed with electronic production.', now()),
  ('44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'Perfect for late night ambient sessions. Very meditative.', now()),
  ('44444444-4444-4444-4444-444444444444', 'a8888888-8888-8888-8888-888888888888', 'Belgian bass master! His liquid DnB sets are smooth as silk.', now()),
  ('55555555-5555-5555-5555-555555555555', 'a2222222-2222-2222-2222-222222222222', 'Melodic house perfection. Every track tells a story.', now()),
  ('55555555-5555-5555-5555-555555555555', 'a9999999-9999-9999-9999-999999999999', 'Simon is a genius. His live band setup brings electronic music to life.', now()),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Best liquid DnB in the scene right now. Their Hospital Records releases are gold.', now()),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaa9-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'UK garage meets house perfection. Brothers know how to move a crowd!', now());

-- Summary comment
-- This seed file creates:
-- - 6 test users (1 admin, 5 regular users)
-- - 2 test groups with members
-- - 2 group invites for testing
-- - 20 realistic festival artists scheduled across 3 days
-- - 3 stages: Main Stage, Club Stage, Ambient Garden
-- - Varied vote patterns showing different group preferences
-- - Artist knowledge tracking
-- - Sample notes demonstrating user engagement
-- 
-- Login credentials for testing:
-- Admin: admin@festival.com (super_admin role)
-- Users: alice@example.com, bob@example.com, charlie@example.com, diana@example.com, eve@example.com
-- 
-- Group invite tokens:
-- FESTIVAL_FRIENDS_2025 - for Festival Friends group
-- ELECTRONIC_LOVERS_2025 - for Electronic Music Lovers group