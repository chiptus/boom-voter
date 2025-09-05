-- Comprehensive seed data for festival voting app
-- This file creates realistic test data for local development


-- Create a test user for seeding data (this would normally be done via auth flow)
-- Using a predictable ID so we can reference it in test groups, votes, etc.
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
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  '$2a$10$example_hash',
  now(),
  now(),
  now(),
  '{"username": "testuser"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;



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
   'Club Stage', '2025-07-12 20:00:00+00', '2025-07-12 21:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/2345678', 'https://soundcloud.com/benbohmer', 89000, now(), 'ben-bohmer'),
  ('a3333333-3333-3333-3333-333333333333', 'Kiara Scuro', 'Rising star in dark techno', 
   'Club Stage', '2025-07-12 23:30:00+00', '2025-07-13 01:00:00+00', '11111111-1111-1111-1111-111111111111',
   NULL, 'https://soundcloud.com/kiarascuro', 45000, now(), 'kiara-scuro'),
  ('a4444444-4444-4444-4444-444444444444', 'Nils Frahm', 'Ambient electronic composer and pianist', 
   'Ambient Garden', '2025-07-12 18:00:00+00', '2025-07-12 19:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/3456789', NULL, NULL, now(), 'nils-frahm'),
  ('a5555555-5555-5555-5555-555555555555', 'Charlotte de Witte', 'Belgian techno DJ and producer', 
   'Main Stage', '2025-07-13 01:00:00+00', '2025-07-13 02:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/4567890', 'https://soundcloud.com/charlottedewitte', 234000, now(), 'charlotte-de-witte'),
  -- July 13, 2025 (Saturday)
  ('a6666666-6666-6666-6666-666666666666', 'Stephan Bodzin', 'German techno producer and live performer', 
   'Main Stage', '2025-07-13 21:00:00+00', '2025-07-13 22:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/5678901', 'https://soundcloud.com/stephanbodzin', 156000, now(), 'stephan-bodzin'),
  ('a7777777-7777-7777-7777-777777777777', 'Lane 8', 'American deep house and progressive house producer', 
   'Main Stage', '2025-07-13 19:00:00+00', '2025-07-13 20:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/6789012', 'https://soundcloud.com/lane8music', 189000, now(), 'lane-8'),
  ('a8888888-8888-8888-8888-888888888888', 'Netsky', 'Belgian drum and bass producer', 
   'Club Stage', '2025-07-13 22:30:00+00', '2025-07-14 00:00:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/7890123', 'https://soundcloud.com/netsky', 178000, now(), 'netsky'),
  ('a9999999-9999-9999-9999-999999999999', 'Bonobo', 'British downtempo and electronic artist', 
   'Ambient Garden', '2025-07-13 17:00:00+00', '2025-07-13 18:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/8901234', 'https://soundcloud.com/bonobomusic', 267000, now(), 'bonobo'),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Amelie Lens', 'Belgian techno DJ', 
   'Club Stage', '2025-07-14 00:00:00+00', '2025-07-14 01:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/9012345', 'https://soundcloud.com/amelielens', 145000, now(), 'amelie-lens'),
  -- July 14, 2025 (Sunday)
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maceo Plex', 'Cuban-American techno and house producer', 
   'Main Stage', '2025-07-14 20:00:00+00', '2025-07-14 21:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/0123456', 'https://soundcloud.com/maceoplex', 198000, now(), 'maceo-plex'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Paul Kalkbrenner', 'German techno producer and live act', 
   'Main Stage', '2025-07-14 22:00:00+00', '2025-07-14 23:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/1234567', 'https://soundcloud.com/paulkalkbrenner', 289000, now(), 'paul-kalkbrenner'),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ott', 'British dub and psychedelic producer', 
   'Ambient Garden', '2025-07-14 16:00:00+00', '2025-07-14 17:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/2345678', 'https://soundcloud.com/ottsonic', 67000, now(), 'ott'),
  ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hybrid Minds', 'British liquid drum and bass duo', 
   'Club Stage', '2025-07-14 19:00:00+00', '2025-07-14 20:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/3456789', 'https://soundcloud.com/hybridminds', 112000, now(), 'hybrid-minds'),
  ('aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tourist', 'British electronic music producer', 
   'Club Stage', '2025-07-14 17:30:00+00', '2025-07-14 18:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/4567890', 'https://soundcloud.com/touristmusic', 89000, now(), 'tourist'),
  -- Additional artists for variety
  ('aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Four Tet', 'British electronic music producer', 
   'Ambient Garden', '2025-07-12 19:30:00+00', '2025-07-12 21:00:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/5678901', 'https://soundcloud.com/fourtet', 234000, now(), 'four-tet'),
  ('aaaaaaa8-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Moderat', 'German electronic music group', 
   'Main Stage', '2025-07-12 16:00:00+00', '2025-07-12 17:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/6789012', 'https://soundcloud.com/moderat-band', 167000, now(), 'moderat'),
  ('aaaaaaa9-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Disclosure', 'British electronic music duo', 
   'Main Stage', '2025-07-13 23:00:00+00', '2025-07-14 00:30:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/7890123', 'https://soundcloud.com/disclosure', 345000, now(), 'disclosure'),
  ('aaaaaaab-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Shpongle', 'British psychedelic electronic duo', 
   'Ambient Garden', '2025-07-13 20:30:00+00', '2025-07-13 22:00:00+00', '11111111-1111-1111-1111-111111111111',
   'https://open.spotify.com/artist/8901234', 'https://soundcloud.com/shpongle', 78000, now(), 'shpongle'),
  ('aaaaaccc-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Floating Points', 'British electronic musician and neuroscientist', 
   'Club Stage', '2025-07-14 21:30:00+00', '2025-07-14 23:00:00+00', '11111111-1111-1111-1111-111111111111',
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
  ('f1111111-1111-1111-1111-111111111111', 'Test festival', 'test', 'Electronic music festival in beautiful Portuguese countryside', true, now(), now());

-- Update festival info with description and sample data (festival_info record already created by migration trigger)
UPDATE public.festival_info 
SET info_text = '<p>Psychedelic music festival in Portugal</p><p>Experience three days of electronic music in the beautiful Portuguese countryside. From techno to ambient, house to drum & bass, this festival celebrates the diverse spectrum of electronic music culture.</p>',
    facebook_url = 'https://facebook.com/testfestival',
    instagram_url = 'https://instagram.com/testfestival',
    updated_at = now()
WHERE festival_id = 'f1111111-1111-1111-1111-111111111111';

-- Insert sample custom links for the festival
INSERT INTO public.custom_links (festival_id, title, url, display_order, created_at, updated_at) VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'Website', 'https://testfestival.com', 0, now(), now()),
  ('f1111111-1111-1111-1111-111111111111', 'Tickets', 'https://testfestival.com/tickets', 1, now(), now()),
  ('f1111111-1111-1111-1111-111111111111', 'Transport', 'https://testfestival.com/travel', 2, now(), now());

-- Insert festival edition
INSERT INTO public.festival_editions (id, festival_id, year, slug, name, description, location, start_date, end_date, published, created_at, updated_at) VALUES 
  ('e1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 2025, '2025', 'Boom Festival 2025', 'The 2025 edition of Boom Festival', 'Idanha-a-Nova, Portugal', '2025-07-12', '2025-07-14', true, now(), now());

-- Insert stages
INSERT INTO public.stages (id, name, slug, festival_edition_id, created_at, updated_at) VALUES 
  ('11111111-1111-1111-1111-11111111111a', 'Main Stage', 'main-stage', 'e1111111-1111-1111-1111-111111111111', now(), now()),
  ('22222222-2222-2222-2222-22222222222b', 'Club Stage', 'club-stage', 'e1111111-1111-1111-1111-111111111111', now(), now()),
  ('33333333-3333-3333-3333-33333333333c', 'Ambient Garden', 'ambient-garden', 'e1111111-1111-1111-1111-111111111111', now(), now());

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

-- Insert sample artist notes
INSERT INTO public.artist_notes (user_id, artist_id, note_content, created_at) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Absolutely incredible live performer! Her set at Fabric was life-changing.', now()),
  ('11111111-1111-1111-1111-111111111111', 'a7777777-7777-7777-7777-777777777777', 'Perfect for sunset vibes. His melodic progressions are unmatched.', now()),
  ('11111111-1111-1111-1111-111111111111', 'a5555555-5555-5555-5555-555555555555', 'Raw, powerful techno. Always brings the energy!', now()),
  ('11111111-1111-1111-1111-111111111111', 'a6666666-6666-6666-6666-666666666666', 'His live setup is incredible. Real instruments mixed with electronic production.', now()),
  ('11111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 'Perfect for late night ambient sessions. Very meditative.', now()),
  ('11111111-1111-1111-1111-111111111111', 'a8888888-8888-8888-8888-888888888888', 'Belgian bass master! His liquid DnB sets are smooth as silk.', now()),
  ('11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'Melodic house perfection. Every track tells a story.', now()),
  ('11111111-1111-1111-1111-111111111111', 'a9999999-9999-9999-9999-999999999999', 'Simon is a genius. His live band setup brings electronic music to life.', now()),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Best liquid DnB in the scene right now. Their Hospital Records releases are gold.', now()),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaa9-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'UK garage meets house perfection. Brothers know how to move a crowd!', now());
