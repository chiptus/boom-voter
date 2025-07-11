
-- Continue inserting the remaining TBD artists from the table
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
    SELECT id INTO tribal_id FROM public.music_genres WHERE name = 'Tribal/bass';
    SELECT id INTO downtempo_id FROM public.music_genres WHERE name = 'Downtempo';
    SELECT id INTO progressive_id FROM public.music_genres WHERE name = 'Progressive';
    
    -- Get an existing user ID from the profiles table
    SELECT id INTO existing_user_id FROM public.profiles LIMIT 1;

    -- Insert remaining TBD Dance Temple artists
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ARCHAIC') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ARCHAIC', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ARCHE GOAH') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ARCHE GOAH', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'AURAL EYE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('AURAL EYE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'BOOGIE KNIGHT') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('BOOGIE KNIGHT', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'CELESTIAL INTELLIGENCE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('CELESTIAL INTELLIGENCE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DIGITAL HIPPIE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DIGITAL HIPPIE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DJ MAILISE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DJ MAILISE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DRIP DROP') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DRIP DROP', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'E-CLIP') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('E-CLIP', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'EMOK') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('EMOK', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ETNICA & PLEIADIANS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ETNICA & PLEIADIANS', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'EVP') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('EVP', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'FAREBI JALEBI') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('FAREBI JALEBI', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'FIDDLE FADDLE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('FIDDLE FADDLE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'FISHEYE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('FISHEYE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'FUTUREMOON') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('FUTUREMOON', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'GLOBAL ILLUMINATION') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('GLOBAL ILLUMINATION', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'GOVINDA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('GOVINDA', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'IGOR SWAMP') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('IGOR SWAMP', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ITAL') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ITAL', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'JAHBO') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('JAHBO', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'MAGIK') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('MAGIK', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'METAPHYZ') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('METAPHYZ', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'NINESENSE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('NINESENSE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'NITIN') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('NITIN', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ORESTIS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ORESTIS', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SABEDORIA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SABEDORIA', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SATOR AREPO') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SATOR AREPO', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SECTIO AUREA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SECTIO AUREA', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SHANTI V DEEDRAH') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SHANTI V DEEDRAH', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SPECTRA SONICS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SPECTRA SONICS', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SPINAL FUSION') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SPINAL FUSION', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'TAOLIND') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('TAOLIND', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'TAS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('TAS', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'TECHYON') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('TECHYON', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'THIRD EYE OF MONKEY') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('THIRD EYE OF MONKEY', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ULVAE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ULVAE', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'UMBER SONUS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('UMBER SONUS', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'YABBA DABBA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('YABBA DABBA', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ZEN MECHANICS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ZEN MECHANICS', 'Dance Temple', NULL, psytrance_id, existing_user_id);
    END IF;

    -- Insert remaining TBD Alchemy Circle artists
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'AIRI') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('AIRI', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ALEX STEIN & VICTOR RUIZ') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ALEX STEIN & VICTOR RUIZ', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ALEX TOLSTEY') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ALEX TOLSTEY', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ANAH') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ANAH', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ANAïS-LIN') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ANAïS-LIN', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ANDRÉ CASCAIS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ANDRÉ CASCAIS', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ANNA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ANNA', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'BANEL') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('BANEL', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'BEATBOMBERS SPECIAL PSYCHEDELIC TURNTABLISM SHOW') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('BEATBOMBERS SPECIAL PSYCHEDELIC TURNTABLISM SHOW', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'COLECTIVE WAREHOUSE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('COLECTIVE WAREHOUSE', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'CHAMPIROLLS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('CHAMPIROLLS', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DATAGRAMA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DATAGRAMA', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DELTA PROCESS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DELTA PROCESS', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'D-NOX & BECKERS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('D-NOX & BECKERS', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DJ MARIA') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DJ MARIA', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'DJ MARKY') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('DJ MARKY', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ELE LUZ') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ELE LUZ', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ERROR 43') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ERROR 43', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'FRESHKITOS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('FRESHKITOS', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'IDA ENGBERG') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('IDA ENGBERG', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'JAMES MONRO') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('JAMES MONRO', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'JULIUS HORSTHUIS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('JULIUS HORSTHUIS', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'KARIM ALKHAYAT') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('KARIM ALKHAYAT', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'KOKESHI') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('KOKESHI', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'MARYCROFT') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('MARYCROFT', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'METHODIC SPIN') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('METHODIC SPIN', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'MIDINOIZE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('MIDINOIZE', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'NEGRÃO') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('NEGRÃO', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'PATRICE BÄUMEL') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('PATRICE BÄUMEL', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'RØDHÅD') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('RØDHÅD', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'RELIQUARIUM') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('RELIQUARIUM', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'SOURONE') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('SOURONE', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'VAL VASHAR') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('VAL VASHAR', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'VJ DATASET') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('VJ DATASET', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'YUSS') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('YUSS', 'Alchemy Circle', NULL, trance_id, existing_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE name = 'ZIGMON') THEN
        INSERT INTO public.artists (name, stage, estimated_date, genre_id, added_by) VALUES ('ZIGMON', 'Alchemy Circle', NULL, techno_id, existing_user_id);
    END IF;

END $$;
