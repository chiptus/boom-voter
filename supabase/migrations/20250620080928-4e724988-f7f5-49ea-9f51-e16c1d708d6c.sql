
-- First, add the missing "Tribal/bass" genre (only if it doesn't exist)
INSERT INTO public.music_genres (name, created_by)
SELECT 'Tribal/bass', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.music_genres WHERE name = 'Tribal/bass');

-- Get the first available user ID from the profiles table for adding artists
-- Now insert all the artists with proper genre mapping using the first available user
INSERT INTO public.artists (name, description, genre_id, added_by) VALUES
-- Artists with Downtempo genre
('Merkaba', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('Twofold', 'Up Downtempo. Maybe house? I have no idea', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('Imanu', 'D&B', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('Bayawaka', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('SensoRythm', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('Goopsteppa', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('Drrtywulvz', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),
('Kalya Scintilla', '', (SELECT id FROM public.music_genres WHERE name = 'Downtempo'), (SELECT id FROM public.profiles LIMIT 1)),

-- Artists with Techno genre
('Carbon', '', (SELECT id FROM public.music_genres WHERE name = 'Techno'), (SELECT id FROM public.profiles LIMIT 1)),
('Frida Darko', '', (SELECT id FROM public.music_genres WHERE name = 'Techno'), (SELECT id FROM public.profiles LIMIT 1)),
('Richie Hawtin', '', (SELECT id FROM public.music_genres WHERE name = 'Techno'), (SELECT id FROM public.profiles LIMIT 1)),

-- Artists with Trance genre
('Digicult', 'Can be aggressive', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Ace Ventura', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Astrix', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Atmos', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Tristan', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Tsuyoshi Suzuki', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('John Fleming', 'I think a bit pop but fun', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Akari System', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Miles from Mars', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),
('Neurolabz', '', (SELECT id FROM public.music_genres WHERE name = 'Trance'), (SELECT id FROM public.profiles LIMIT 1)),

-- Artists with Tribal/bass genre
('Tor', '', (SELECT id FROM public.music_genres WHERE name = 'Tribal/bass'), (SELECT id FROM public.profiles LIMIT 1)),
('Liquid Bloom', 'Can be chillout', (SELECT id FROM public.music_genres WHERE name = 'Tribal/bass'), (SELECT id FROM public.profiles LIMIT 1)),
('Nyrus', '', (SELECT id FROM public.music_genres WHERE name = 'Tribal/bass'), (SELECT id FROM public.profiles LIMIT 1)),

-- Artists with Psytrance genre (researched missing genres)
('Kliment', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),
('Prometheus', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),
('Atia', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),
('Dnox and Becker', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),
('Freedom Fighters', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),
('Krumelur', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),
('Ritmo', '', (SELECT id FROM public.music_genres WHERE name = 'Psytrance'), (SELECT id FROM public.profiles LIMIT 1)),

-- Artists with Progressive genre
('Boundless', '', (SELECT id FROM public.music_genres WHERE name = 'Progressive'), (SELECT id FROM public.profiles LIMIT 1));
