
-- First, let's update existing artists with their stage and estimated date information
UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = '2024-07-19'
WHERE name = 'FREEDOM FIGHTERS';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = '2024-07-19'
WHERE name = 'JOHN 00 FLEMING';

UPDATE public.artists SET 
  stage = 'Dance Temple',
  estimated_date = '2024-07-19'
WHERE name = 'TRISTAN';

UPDATE public.artists SET 
  stage = 'The Gardens',
  estimated_date = '2024-07-19'
WHERE name = 'FRIDA DARKO';

UPDATE public.artists SET 
  stage = 'The Gardens',
  estimated_date = '2024-07-19'
WHERE name = 'KALYA SCINTILLA';

UPDATE public.artists SET 
  stage = 'Dance Temple',
  estimated_date = '2024-07-20'
WHERE name = 'TSUYOSHI SUZUKI';

UPDATE public.artists SET 
  stage = 'Dance Temple',
  estimated_date = '2024-07-21',
  spotify_url = 'https://open.spotify.com/artist/7bSyjB4y9NAhoUDrZTpYt4',
  soundcloud_url = 'https://soundcloud.com/schatsi'
WHERE name = 'ACE VENTURA';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = '2024-07-21'
WHERE name = 'MERKABA';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = '2024-07-22'
WHERE name = 'ATIA';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = '2024-07-23'
WHERE name = 'RITMO';

UPDATE public.artists SET 
  stage = 'Dance Temple',
  estimated_date = NULL,
  spotify_url = 'https://open.spotify.com/artist/3dUltShd2gJQc98Kc7Syit',
  soundcloud_url = 'https://soundcloud.com/astrix-official'
WHERE name = 'ASTRIX';

UPDATE public.artists SET 
  stage = 'Dance Temple',
  estimated_date = NULL
WHERE name = 'ATMOS';

UPDATE public.artists SET 
  stage = 'Dance Temple',
  estimated_date = NULL
WHERE name = 'PROMETHEUS';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'AKARI SYSTEM';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'BOUNDLESS';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'CARBON';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'KLIMENT';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'KRUMELUR';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'MILES FROM MARS';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL
WHERE name = 'NEUROLABZ';

UPDATE public.artists SET 
  stage = 'Alchemy Circle',
  estimated_date = NULL,
  spotify_url = 'https://open.spotify.com/artist/3AhwIUus3pIaA3CvYBEtpy',
  soundcloud_url = 'https://soundcloud.com/RICHIEHAWTIN'
WHERE name = 'RICHIE HAWTIN';

-- Now let's insert all the new artists from the table, using an existing user ID
DO $$
DECLARE
    psytrance_id UUID;
    techno_id UUID;
    trance_id UUID;
    tribal_id UUID;
    downtempo_id UUID;
    progressive_id UUID;
    existing_user_id UUID;
BEGIN
    -- Get genre IDs
    SELECT id INTO psytrance_id FROM public.music_genres WHERE name = 'Psytrance';
    SELECT id INTO techno_id FROM public.music_genres WHERE name = 'Techno';
    SELECT id INTO trance_id FROM public.music_genres WHERE name = 'Trance';
    SELECT id INTO tribal_id FROM public.music_genres WHERE name = 'Tribal/bass';  -- Fix genre name
    SELECT id INTO downtempo_id FROM public.music_genres WHERE name = 'Downtempo';
    SELECT id INTO progressive_id FROM public.music_genres WHERE name = 'Progressive';
    
    -- Get an existing user ID from the profiles table
    SELECT id INTO existing_user_id FROM public.profiles LIMIT 1;

    -- Insert new artists only if they don't already exist
    -- July 18
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'CELLI/EARTHLING') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('CELLI/EARTHLING', 'Dance Temple', '2024-07-18', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'AARDVARKK') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('AARDVARKK', 'Dance Temple', '2024-07-18', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'KAUFMANN') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('KAUFMANN', 'Alchemy Circle', '2024-07-18', techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'RUGRATS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('RUGRATS', 'Dance Temple', '2024-07-18', psytrance_id, existing_user_id);
    END IF;
    
    -- July 19
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'MENOG') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('MENOG', 'Dance Temple', '2024-07-19', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DJANTRIX') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DJANTRIX', 'Dance Temple', '2024-07-19', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DJ NUKY') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DJ NUKY', 'Dance Temple', '2024-07-19', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'GIUSEPPE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('GIUSEPPE', 'Dance Temple', '2024-07-19', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'AiÊ (Edgar Valente & LuizG)') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('AiÊ (Edgar Valente & LuizG)', 'Sacred Fire', '2024-07-19', tribal_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'HERRHAUSEN & TREINDL') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('HERRHAUSEN & TREINDL', 'The Gardens', '2024-07-19', downtempo_id, existing_user_id);
    END IF;
    
    -- July 20
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ARJUNA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ARJUNA', 'Dance Temple', '2024-07-20', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = '8TERNAL BEINGS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('8TERNAL BEINGS', 'Dance Temple', '2024-07-20', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'BALANCÉ') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('BALANCÉ', 'TBD', '2024-07-20', progressive_id, existing_user_id);
    END IF;
    
    -- July 21
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ALIEN ART') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ALIEN ART', 'Alchemy Circle', '2024-07-21', trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'YIN YIN BAND') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('YIN YIN BAND', 'Sacred Fire', '2024-07-21', tribal_id, existing_user_id);
    END IF;
    
    -- July 22
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'KONEBU') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('KONEBU', 'Dance Temple', '2024-07-22', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'NASHA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('NASHA', 'Dance Temple', '2024-07-22', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'CAPTAIN HOOK') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by, spotify_url, soundcloud_url) VALUES ('CAPTAIN HOOK', 'Alchemy Circle', '2024-07-22', trance_id, existing_user_id, 'https://open.spotify.com/artist/5xnZNDl118VvPTvthujxpx', 'https://soundcloud.com/captain-hook');
    END IF;
    
    -- July 23
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ACT ONE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ACT ONE', 'Dance Temple', '2024-07-23', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'AVALON') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('AVALON', 'Dance Temple', '2024-07-23', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'FERNANDA PISTELLI') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('FERNANDA PISTELLI', 'Alchemy Circle', '2024-07-23', trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'UNCHARTED TERRITORY') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('UNCHARTED TERRITORY', 'Alchemy Circle', '2024-07-23', trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'OUTSIDERS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('OUTSIDERS', 'Dance Temple', '2024-07-23', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ZEN BABOOM') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ZEN BABOOM', 'The Gardens', '2024-07-23', downtempo_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'AVAN7') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('AVAN7', 'Dance Temple', '2024-07-23', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ALTRUISM') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ALTRUISM', 'Dance Temple', '2024-07-23', psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'STARLAB') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('STARLAB', 'Dance Temple', '2024-07-23', psytrance_id, existing_user_id);
    END IF;

END $$;
