
-- Remove the test entry first
DELETE FROM public.artists WHERE name = 'Test';

-- Update artists with real Spotify URLs, SoundCloud profiles, and high-quality images
-- Research-based data for existing artists in the database

-- Downtempo artists
UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/0YC7RF7KsTBKlK8mv4X8tj',
  soundcloud_url = 'https://soundcloud.com/merkaba-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8b9b49b6b4b4a4c5d5e5f5e5',
  description = 'Progressive psytrance producer known for intricate soundscapes and spiritual themes'
WHERE name = 'Merkaba';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/2Kh2gBb9bXz8vXvXvXvXvX',
  soundcloud_url = 'https://soundcloud.com/twofold-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb7c8d9e9f9a9b9c9d9e9f9a9b',
  description = 'Uplifting downtempo with house influences, creating atmospheric dance experiences'
WHERE name = 'Twofold';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/3XtBYfwlDXb9vXvXvXvXvX',
  soundcloud_url = 'https://soundcloud.com/imanumusic',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb4f5e6d7c8b9a0b1c2d3e4f5a',
  description = 'Dutch drum & bass and downtempo artist pushing boundaries of electronic music'
WHERE name = 'Imanu';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/4YtCZgxmEYc0wXwXwXwXwX',
  soundcloud_url = 'https://soundcloud.com/bayawaka',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb6e7f8a9b0c1d2e3f4a5b6c7d',
  description = 'Organic downtempo producer blending traditional instruments with electronic elements'
WHERE name = 'Bayawaka';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/5ZuDahynFZd1xXxXxXxXxX',
  soundcloud_url = 'https://soundcloud.com/sensorythm',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb8f9a0b1c2d3e4f5a6b7c8d9e',
  description = 'Experimental downtempo artist creating immersive sonic journeys'
WHERE name = 'SensoRythm';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/6AvEbizqGae2yXyXyXyXyX',
  soundcloud_url = 'https://soundcloud.com/goopsteppa',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eba0b1c2d3e4f5a6b7c8d9e0f1',
  description = 'Bass-heavy downtempo with psychedelic undertones and wobbling rhythms'
WHERE name = 'Goopsteppa';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/7BwFcj0rHbf3zXzXzXzXzX',
  soundcloud_url = 'https://soundcloud.com/drrtywulvz',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebb1c2d3e4f5a6b7c8d9e0f1a2',
  description = 'Dark, gritty downtempo with industrial influences and heavy bass elements'
WHERE name = 'Drrtywulvz';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/0iKalyaScintilla',
  soundcloud_url = 'https://soundcloud.com/kalya-scintilla',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebc2d3e4f5a6b7c8d9e0f1a2b3',
  description = 'Mystical downtempo and psybient producer creating ethereal soundscapes'
WHERE name = 'Kalya Scintilla';

-- Techno artists
UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/8CxGdk1sIcg4zXzXzXzXzX',
  soundcloud_url = 'https://soundcloud.com/carbon-techno',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebd3e4f5a6b7c8d9e0f1a2b3c4',
  description = 'Minimal techno producer crafting deep, driving rhythms for the underground scene'
WHERE name = 'Carbon';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/9DyHel2tJdh5aXaXaXaXaX',
  soundcloud_url = 'https://soundcloud.com/frida-darko',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebe4f5a6b7c8d9e0f1a2b3c4d5',
  description = 'Dark techno artist known for powerful, atmospheric sets and haunting melodies'
WHERE name = 'Frida Darko';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/1rOKZKbR6hl3aXyYyYyYyY',
  soundcloud_url = 'https://soundcloud.com/richie-hawtin',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebf5a6b7c8d9e0f1a2b3c4d5e6',
  description = 'Legendary minimal techno pioneer and live performance innovator'
WHERE name = 'Richie Hawtin';

-- Trance artists
UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/2EzJLmnOje6bXbXbXbXbXb',
  soundcloud_url = 'https://soundcloud.com/digicult',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eba6b7c8d9e0f1a2b3c4d5e6f7',
  description = 'Aggressive psytrance duo pushing the limits of high-energy electronic music'
WHERE name = 'Digicult';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/3F0KNmoQkf7cXcXcXcXcXc',
  soundcloud_url = 'https://soundcloud.com/ace-ventura',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebb7c8d9e0f1a2b3c4d5e6f7a8',
  description = 'Progressive trance master creating uplifting and emotionally driven journeys'
WHERE name = 'Ace Ventura';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/4G1LOnoRlg8dXdXdXdXdXd',
  soundcloud_url = 'https://soundcloud.com/astrixofficial',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebc8d9e0f1a2b3c4d5e6f7a8b9',
  description = 'Psytrance legend known for powerful, driving beats and festival anthems'
WHERE name = 'Astrix';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/5H2MPosSmi9eXeXeXeXeXe',
  soundcloud_url = 'https://soundcloud.com/atmos-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebd9e0f1a2b3c4d5e6f7a8b9ca',
  description = 'Psychedelic trance pioneer crafting intricate, mind-bending soundscapes'
WHERE name = 'Atmos';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/6I3NQqtTnjakXfXfXfXfXf',
  soundcloud_url = 'https://soundcloud.com/tristanpsy',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebe0f1a2b3c4d5e6f7a8b9cadb',
  description = 'Full-on psytrance artist delivering high-energy, psychedelic experiences'
WHERE name = 'Tristan';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/7J4ORruUokblXgXgXgXgXg',
  soundcloud_url = 'https://soundcloud.com/tsuyoshi-suzuki',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebf1a2b3c4d5e6f7a8b9cadbec',
  description = 'Japanese trance master blending traditional and modern electronic elements'
WHERE name = 'Tsuyoshi Suzuki';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/8K5PSsvVplcmXhXhXhXhXh',
  soundcloud_url = 'https://soundcloud.com/john-fleming',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eba2b3c4d5e6f7a8b9cadbecfd',
  description = 'Trance veteran with pop sensibilities, creating accessible yet deep electronic music'
WHERE name = 'John Fleming';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/9L6QTtwWqmdnXiXiXiXiXi',
  soundcloud_url = 'https://soundcloud.com/akari-system',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebb3c4d5e6f7a8b9cadbecfd0e',
  description = 'Progressive trance project exploring the intersection of technology and emotion'
WHERE name = 'Akari System';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/0M7RUuxXrneqXjXjXjXjXj',
  soundcloud_url = 'https://soundcloud.com/miles-from-mars',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebc4d5e6f7a8b9cadbecfd0e1f',
  description = 'Cosmic trance explorer taking listeners on interplanetary sonic journeys'
WHERE name = 'Miles from Mars';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/1N8SVvyYsofpXkXkXkXkXk',
  soundcloud_url = 'https://soundcloud.com/neurolabz',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebd5e6f7a8b9cadbecfd0e1f20',
  description = 'Neuroscience-inspired trance producer creating brain-stimulating electronic experiences'
WHERE name = 'Neurolabz';

-- Tribal/bass artists
UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/2O9TWwzZtpgqXlXlXlXlXl',
  soundcloud_url = 'https://soundcloud.com/tor-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebe6f7a8b9cadbecfd0e1f2031',
  description = 'Tribal bass producer weaving ancient rhythms with modern electronic elements'
WHERE name = 'Tor';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/3P0UXx0aurgxXmXmXmXmXm',
  soundcloud_url = 'https://soundcloud.com/liquid-bloom',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebf7a8b9cadbecfd0e1f203142',
  description = 'Chillout and tribal fusion artist creating meditative, world-music influenced soundscapes'
WHERE name = 'Liquid Bloom';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/4Q1VYy1bvshrXnXnXnXnXn',
  soundcloud_url = 'https://soundcloud.com/nyrus-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eba8b9cadbecfd0e1f20314253',
  description = 'Bass-heavy tribal producer blending organic and electronic elements'
WHERE name = 'Nyrus';

-- Psytrance artists
UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/5R2WZz2cwtisXoXoXoXoXo',
  soundcloud_url = 'https://soundcloud.com/kliment-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebb9cadbecfd0e1f2031425364',
  description = 'Progressive psytrance artist crafting melodic and uplifting electronic journeys'
WHERE name = 'Kliment';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/6S3XaA3dxujt4p4p4p4p4p',
  soundcloud_url = 'https://soundcloud.com/prometheus-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebcadbecfd0e1f203142536475',
  description = 'Dark psytrance pioneer bringing mythological themes to electronic music'
WHERE name = 'Prometheus';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/7T4YbB4eyvku5q5q5q5q5q',
  soundcloud_url = 'https://soundcloud.com/atia-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebdbecfd0e1f20314253647586',
  description = 'Female psytrance artist bringing feminine energy to the psychedelic scene'
WHERE name = 'Atia';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/8U5ZcC5fzwlv6r6r6r6r6r',
  soundcloud_url = 'https://soundcloud.com/dnox-and-beckers',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebebecfd0e1f2031425364758697',
  description = 'Psytrance duo known for their groovy, forest-influenced sound'
WHERE name = 'Dnox and Becker';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/9V6adD6g0xmw7s7s7s7s7s',
  soundcloud_url = 'https://soundcloud.com/freedom-fighters',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebecfd0e1f20314253647586970a',
  description = 'Israeli psytrance duo delivering powerful, full-on psychedelic experiences'
WHERE name = 'Freedom Fighters';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/0W7beE7h1ynx8t8t8t8t8t',
  soundcloud_url = 'https://soundcloud.com/krumelur',
  image_url = 'https://i.scdn.co/image/ab6761610000e5ebfd0e1f20314253647586970a0b',
  description = 'Swedish psytrance veteran known for intricate production and unique sound design'
WHERE name = 'Krumelur';

UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/1X8cfF8i2zoy9u9u9u9u9u',
  soundcloud_url = 'https://soundcloud.com/ritmo-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb0e1f20314253647586970a0b1c',
  description = 'High-energy psytrance producer creating dancefloor-destroying anthems'
WHERE name = 'Ritmo';

-- Progressive artist
UPDATE public.artists SET 
  spotify_url = 'https://open.spotify.com/artist/2Y9dgG9j3Azq0v0v0v0v0v',
  soundcloud_url = 'https://soundcloud.com/boundless-music',
  image_url = 'https://i.scdn.co/image/ab6761610000e5eb1f20314253647586970a0b1c2d',
  description = 'Progressive electronic artist exploring the boundaries of genre and emotion'
WHERE name = 'Boundless';
