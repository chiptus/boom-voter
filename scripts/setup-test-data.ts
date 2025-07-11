import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const testData = {
  artists: [
    { name: 'Test Artist 1', description: 'Test artist for e2e testing', genre: 'Electronic' },
    { name: 'Test Artist 2', description: 'Another test artist', genre: 'Psytrance' },
    { name: 'Test Artist 3', description: 'Third test artist', genre: 'Techno' },
  ],
  genres: ['Electronic', 'Psytrance', 'Techno', 'House', 'Ambient', 'Downtempo'],
  users: [
    { email: 'test@example.com', password: 'testpassword123' },
    { email: 'admin@example.com', password: 'adminpassword123' },
  ],
};

async function setupTestData() {
  console.log('🚀 Setting up test data...');

  try {
    // Insert test genres
    console.log('📝 Inserting test genres...');
    for (const genre of testData.genres) {
      const { error } = await supabase
        .from('genres')
        .insert({ name: genre });
      
      if (error && !error.message.includes('duplicate key')) {
        console.error(`Error inserting genre ${genre}:`, error);
      }
    }

    // Insert test artists
    console.log('🎵 Inserting test artists...');
    for (const artist of testData.artists) {
      // First get the genre ID
      const { data: genreData } = await supabase
        .from('music_genres')
        .select('id')
        .eq('name', artist.genre)
        .single();
      
      if (genreData) {
        const { error } = await supabase
          .from('artists')
          .insert({
            name: artist.name,
            description: artist.description,
            genre_id: genreData.id,
            added_by: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          });
        
        if (error && !error.message.includes('duplicate key')) {
          console.error(`Error inserting artist ${artist.name}:`, error);
        }
      } else {
        console.warn(`Genre ${artist.genre} not found for artist ${artist.name}`);
      }
    }

    console.log('✅ Test data setup completed!');
    console.log('');
    console.log('📋 Test Data Summary:');
    console.log(`   Artists: ${testData.artists.length}`);
    console.log(`   Genres: ${testData.genres.length}`);
    console.log('');
    console.log('🧪 Test Users:');
    testData.users.forEach(user => {
      console.log(`   Email: ${user.email}, Password: ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    process.exit(1);
  }
}

// Run the setup
setupTestData(); 