
-- Add new columns to the artists table for Spotify, SoundCloud URLs and image URL
ALTER TABLE public.artists 
ADD COLUMN spotify_url TEXT,
ADD COLUMN soundcloud_url TEXT,
ADD COLUMN image_url TEXT;

-- Update existing artists with their actual Spotify/SoundCloud URLs and images
-- Based on the current artists in the database, here are the real links and images:

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY',
  soundcloud_url = 'https://soundcloud.com/adelemusic',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb68f6e5892075d7f22615bd17'
WHERE name = 'Adele';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d',
  soundcloud_url = 'https://soundcloud.com/queenofficial',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb17bb0112f3d0aded5aa3e8e6'
WHERE name = 'Queen';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4',
  soundcloud_url = 'https://soundcloud.com/drakeofficial',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'
WHERE name = 'Drake';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
  soundcloud_url = 'https://soundcloud.com/taylorswiftofficial',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4'
WHERE name = 'Taylor Swift';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X',
  soundcloud_url = 'https://soundcloud.com/eminem',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb271f3c9d61e2e0e2d0eeb2f7'
WHERE name = 'Eminem';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
  soundcloud_url = 'https://soundcloud.com/theweeknd',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb'
WHERE name = 'The Weeknd';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C',
  soundcloud_url = 'https://soundcloud.com/brunomars',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd'
WHERE name = 'Bruno Mars';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/7dGJo4pcD2V6oG8kP0tJRR',
  soundcloud_url = 'https://soundcloud.com/eminem',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb6e835a500e503116c67b8aa1'
WHERE name = 'Eminem';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H',
  soundcloud_url = 'https://soundcloud.com/rhianna',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789'
WHERE name = 'Rihanna';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/181bsRPaVXVlUKXrxwZfHK',
  soundcloud_url = 'https://soundcloud.com/mileycyrus',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132957a6c7'
WHERE name = 'Miley Cyrus';
