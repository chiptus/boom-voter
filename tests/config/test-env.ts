// Test environment configuration
export const TEST_CONFIG = {
  // Local Supabase test instance
  SUPABASE_URL: process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_ANON_KEY: process.env.TEST_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  
  // Test user credentials
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || 'test@example.com',
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || 'testpassword123',
  
  // App configuration
  BASE_URL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
  
  // Test data
  TEST_ARTIST_NAME: 'Test Artist',
  TEST_GENRE_NAME: 'Test Genre',
  TEST_GROUP_NAME: 'Test Group',
};

// Test data setup helpers
export const TEST_DATA = {
  artists: [
    { name: 'Test Artist 1', genre: 'Rock' },
    { name: 'Test Artist 2', genre: 'Pop' },
    { name: 'Test Artist 3', genre: 'Jazz' },
  ],
  genres: ['Electronic', 'Psytrance', 'Techno', 'House', 'Ambient', 'Downtempo'],
}; 