
-- First, add the missing "Tribal/bass" genre (only if it doesn't exist)
INSERT INTO public.music_genres (name, created_by)
SELECT 'Tribal/bass', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.music_genres WHERE name = 'Tribal/bass');

-- Create a system user in auth.users if no profiles exist
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, is_super_admin, confirmation_token, recovery_token)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'system@boom-voter.local',
  crypt('system-password', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"username": "system"}'::jsonb,
  false,
  '',
  ''
WHERE NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1);

-- Create the corresponding profile for the system user
INSERT INTO public.profiles (id, username)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'system'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1);

-- Now insert all the artists with proper genre mapping using the system user
INSERT INTO public.artists (name, description, genre_id, added_by) VALUES
-- Artists with Downtempo genre
('Merkaba', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('Twofold', 'Up Downtempo. Maybe house? I have no idea', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('Imanu', 'D&B', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('Bayawaka', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('SensoRythm', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('Goopsteppa', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('Drrtywulvz', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),
('Kalya Scintilla', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), '00000000-0000-0000-0000-000000000000'::uuid),

-- Artists with Techno genre
('Carbon', '', (SELECT id FROM public.music_genres WHERE name = 'Techno'), '00000000-0000-0000-0000-000000000000'::uuid),
('Frida Darko', '', (SELECT id FROM public.music_genres WHERE name = 'Techno'), '00000000-0000-0000-0000-000000000000'::uuid),
('Richie Hawtin', '', (SELECT id FROM public.music_genres WHERE name = 'Techno'), '00000000-0000-0000-0000-000000000000'::uuid),

-- Artists with Trance genre
('Digicult', 'Can be aggressive', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Ace Ventura', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Astrix', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Atmos', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Tristan', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Tsuyoshi Suzuki', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('John Fleming', 'I think a bit pop but fun', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Akari System', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Miles from Mars', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Neurolabz', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), '00000000-0000-0000-0000-000000000000'::uuid),

-- Artists with Tribal/bass genre
('Tor', '', (SELECT id FROM public.music_genres WHERE name = 'Tribal/bass'), '00000000-0000-0000-0000-000000000000'::uuid),
('Liquid Bloom', 'Can be chillout', (SELECT id FROM public.music_genres WHERE name = 'Tribal/bass'), '00000000-0000-0000-0000-000000000000'::uuid),
('Nyrus', '', (SELECT id FROM public.music_genres WHERE name = 'Tribal/bass'), '00000000-0000-0000-0000-000000000000'::uuid),

-- Artists with Psytrance genre (researched missing genres)
('Kliment', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Prometheus', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Atia', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Dnox and Becker', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Freedom Fighters', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Krumelur', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),
('Ritmo', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), '00000000-0000-0000-0000-000000000000'::uuid),

-- Artists with Progressive genre
('Boundless', '', (SELECT id FROM public.music_genres WHERE name = 'Progressive'), '00000000-0000-0000-0000-000000000000'::uuid);
