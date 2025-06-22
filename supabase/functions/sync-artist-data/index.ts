import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting SoundCloud artist data sync...')

    // Get artists with SoundCloud URLs that haven't been synced in the last 24 hours
    const { data: artists, error: fetchError } = await supabase
      .from('artists')
      .select('id, name, soundcloud_url, image_url, last_soundcloud_sync')
      .not('soundcloud_url', 'is', null)
      .or('last_soundcloud_sync.is.null,last_soundcloud_sync.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (fetchError) {
      console.error('Error fetching artists:', fetchError)
      throw new Error('Failed to fetch artists')
    }

    console.log(`Found ${artists?.length || 0} artists to sync`)

    const results = {
      processed: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    }

    if (!artists || artists.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No artists to sync', results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process each artist
    for (const artist of artists) {
      try {
        results.processed++
        console.log(`Processing artist: ${artist.name}`)

        // Extract SoundCloud username from URL
        const soundcloudUrl = artist.soundcloud_url
        const urlMatch = soundcloudUrl.match(/soundcloud\.com\/([^/?]+)/)
        
        if (!urlMatch) {
          console.warn(`Invalid SoundCloud URL for ${artist.name}: ${soundcloudUrl}`)
          results.failed++
          results.errors.push(`Invalid URL format for ${artist.name}`)
          continue
        }

        const username = urlMatch[1]
        
        // Call SoundCloud API to resolve the artist
        const resolveUrl = `https://api.soundcloud.com/resolve?url=${encodeURIComponent(soundcloudUrl)}&client_id=iZIs9mchVcX5lhVRyQGGAh8YK2hqEgqF`
        
        console.log(`Fetching data for ${artist.name} from SoundCloud...`)
        const response = await fetch(resolveUrl)
        
        if (!response.ok) {
          console.warn(`SoundCloud API error for ${artist.name}: ${response.status}`)
          results.failed++
          results.errors.push(`API error ${response.status} for ${artist.name}`)
          
          // Update sync timestamp even on failure to prevent repeated attempts
          await supabase
            .from('artists')
            .update({ last_soundcloud_sync: new Date().toISOString() })
            .eq('id', artist.id)
          
          continue
        }

        const soundcloudData = await response.json()
        
        // Extract relevant data
        const followersCount = soundcloudData.followers_count || null
        const avatarUrl = soundcloudData.avatar_url || null
        
        console.log(`Found data for ${artist.name}: ${followersCount} followers`)

        // Prepare update data
        const updateData: any = {
          last_soundcloud_sync: new Date().toISOString()
        }

        if (followersCount !== null) {
          updateData.soundcloud_followers = followersCount
        }

        // Update image_url if SoundCloud has a better image
        if (avatarUrl && (!artist.image_url || avatarUrl.includes('large'))) {
          // Replace 'large' with 't500x500' for higher resolution if available
          const highResUrl = avatarUrl.replace('large.jpg', 't500x500.jpg')
          updateData.image_url = highResUrl
          console.log(`Updating image for ${artist.name}`)
        }

        // Update the artist in the database
        const { error: updateError } = await supabase
          .from('artists')
          .update(updateData)
          .eq('id', artist.id)

        if (updateError) {
          console.error(`Error updating ${artist.name}:`, updateError)
          results.failed++
          results.errors.push(`Update error for ${artist.name}: ${updateError.message}`)
        } else {
          results.updated++
          console.log(`Successfully updated ${artist.name}`)
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error) {
        console.error(`Error processing ${artist.name}:`, error)
        results.failed++
        results.errors.push(`Processing error for ${artist.name}: ${error.message}`)
        
        // Update sync timestamp even on error
        try {
          await supabase
            .from('artists')
            .update({ last_soundcloud_sync: new Date().toISOString() })
            .eq('id', artist.id)
        } catch (syncError) {
          console.error(`Failed to update sync timestamp for ${artist.name}:`, syncError)
        }
      }
    }

    console.log('Sync completed:', results)

    return new Response(
      JSON.stringify({ 
        message: 'SoundCloud sync completed', 
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Sync function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'SoundCloud sync failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})