import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to scrape SoundCloud data using Browserless
async function scrapeSoundCloudWithBrowserless(soundcloudUrl: string) {
  const browserlessApiKey = Deno.env.get('BROWSERLESS_API_KEY')
  
  if (!browserlessApiKey) {
    throw new Error('BROWSERLESS_API_KEY environment variable is required')
  }

  const browserlessUrl = `https://production-ams.browserless.io/function?token=${browserlessApiKey}`
  
  console.log(`Calling Browserless for URL: ${soundcloudUrl}`)
  
  // Use the function endpoint which allows more control
  const browserScript = `
    export default async ({ page }) => {
      await page.goto('${soundcloudUrl}', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit more for SoundCloud's React to render using standard JS
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Try to wait for specific elements that indicate the page is loaded
      try {
        await page.waitForSelector('body', { timeout: 5000 });
      } catch (e) {
        console.log('Body selector timeout, continuing...');
      }
      
      // Try to wait for SoundCloud specific elements
      try {
        await page.waitForSelector('script', { timeout: 2000 });
      } catch (e) {
        console.log('Script selector timeout, continuing...');
      }
      
      const html = await page.content();
      return { html };
    }
  `;
  
  const response = await fetch(browserlessUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/javascript',
    },
    body: browserScript
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Browserless API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const result = await response.json()
  return extractSoundCloudDataWithCheerio(result.html)
}

// Function to extract data from HTML using Cheerio
function extractSoundCloudDataWithCheerio(html: string) {
  const $ = cheerio.load(html)
  
  let followersCount = null
  let avatarUrl = null
  let displayName = null

  console.log('Parsing HTML with Cheerio...')

  // Method 1: Look for hydration data in script tags
  $('script').each((_, element) => {
    const scriptContent = $(element).html()
    if (scriptContent && scriptContent.includes('window.__sc_hydration')) {
      try {
        const hydrationMatch = scriptContent.match(/window\.__sc_hydration\s*=\s*(\[[\s\S]*?\]);/)
        if (hydrationMatch) {
          const hydrationData = JSON.parse(hydrationMatch[1])
          
          // Look for user data in hydration
          for (const item of hydrationData) {
            if (item && item.hydratable === 'user' && item.data) {
              const userData = item.data
              if (userData.followers_count !== undefined) {
                followersCount = userData.followers_count
                console.log(`Found followers count in hydration: ${followersCount}`)
              }
              if (userData.avatar_url) {
                avatarUrl = userData.avatar_url
                console.log(`Found avatar URL in hydration: ${avatarUrl}`)
              }
              if (userData.display_name || userData.username) {
                displayName = userData.display_name || userData.username
                console.log(`Found display name in hydration: ${displayName}`)
              }
              break
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse hydration data:', e)
      }
    }
  })

  // Method 2: Look for JSON-LD structured data
  if (!followersCount || !avatarUrl) {
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const jsonData = JSON.parse($(element).html() || '{}')
        if (jsonData.interactionStatistic && !followersCount) {
          const followStat = jsonData.interactionStatistic.find((stat: any) => 
            stat.interactionType === 'https://schema.org/FollowAction'
          )
          if (followStat) {
            followersCount = followStat.userInteractionCount
            console.log(`Found followers count in JSON-LD: ${followersCount}`)
          }
        }
        if (jsonData.image && !avatarUrl) {
          avatarUrl = jsonData.image
          console.log(`Found avatar URL in JSON-LD: ${avatarUrl}`)
        }
        if (jsonData.name && !displayName) {
          displayName = jsonData.name
          console.log(`Found display name in JSON-LD: ${displayName}`)
        }
      } catch (e) {
        console.warn('Failed to parse JSON-LD data:', e)
      }
    })
  }

  // Method 3: Look for meta tags
  if (!avatarUrl) {
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) {
      avatarUrl = ogImage
      console.log(`Found avatar URL in og:image: ${avatarUrl}`)
    }
  }

  if (!displayName) {
    const ogTitle = $('meta[property="og:title"]').attr('content')
    if (ogTitle) {
      displayName = ogTitle.split(' | ')[0] // Remove " | SoundCloud" suffix
      console.log(`Found display name in og:title: ${displayName}`)
    }
  }

  // Method 4: Look for followers count in visible text
  if (!followersCount) {
    const bodyText = $('body').text()
    
    const followerPatterns = [
      /(\d+(?:,\d+)*)\s+followers/i,
      /(\d+(?:\.\d+)?[KM]?)\s+followers/i,
      /followers[:\s]*(\d+(?:,\d+)*)/i
    ]

    for (const pattern of followerPatterns) {
      const match = bodyText.match(pattern)
      if (match) {
        let count = match[1].replace(/,/g, '')
        if (count.includes('K')) {
          count = (parseFloat(count) * 1000).toString()
        } else if (count.includes('M')) {
          count = (parseFloat(count) * 1000000).toString()
        }
        followersCount = parseInt(count)
        console.log(`Found followers count in text: ${followersCount}`)
        break
      }
    }
  }

  // Method 5: Look for specific SoundCloud CSS classes/elements
  if (!followersCount) {
    // Try common SoundCloud selectors
    const followersSelectors = [
      '.sc-text-secondary:contains("followers")',
      '.followersCount',
      '.sc-text-body:contains("followers")',
      '[data-testid="followers-count"]'
    ]
    
    for (const selector of followersSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        const text = element.text()
        const match = text.match(/(\d+(?:,\d+)*)/)
        if (match) {
          followersCount = parseInt(match[1].replace(/,/g, ''))
          console.log(`Found followers count in element: ${followersCount}`)
          break
        }
      }
    }
  }

  // Method 6: Look for avatar in img tags
  if (!avatarUrl) {
    const avatarSelectors = [
      'img[src*="avatar"]',
      '.sc-artwork img',
      '.profileHeaderInfo img',
      '.profile-header img'
    ]
    
    for (const selector of avatarSelectors) {
      const img = $(selector).first()
      if (img.length > 0) {
        const src = img.attr('src')
        if (src && src.includes('sndcdn.com')) {
          avatarUrl = src
          console.log(`Found avatar URL in img: ${avatarUrl}`)
          break
        }
      }
    }
  }

  console.log(`Final extracted data:`, { followersCount, avatarUrl, displayName })

  return {
    followersCount,
    avatarUrl,
    displayName
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting SoundCloud artist data sync...')

    // Get count of artists that need syncing
    const { data: artists, error: fetchError } = await supabase
      .from('artists')
      .select('id, name, soundcloud_url, image_url, last_soundcloud_sync')
      .not('soundcloud_url', 'is', null)
      .or('last_soundcloud_sync.is.null,last_soundcloud_sync.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (fetchError) {
      console.error('Error fetching artists:', fetchError)
      throw new Error('Failed to fetch artists')
    }

    const artistCount = artists?.length || 0
    console.log(`Found ${artistCount} artists to sync`)

    // Use EdgeRuntime.waitUntil to ensure background job completes
    EdgeRuntime.waitUntil(
      processSoundCloudArtists(supabase, artists || [])
    )

    // Return immediately with job started confirmation
    return new Response(
      JSON.stringify({ 
        message: 'SoundCloud sync job started in background',
        artistsToProcess: artistCount,
        startedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 202 // Accepted - processing in background
      }
    )

  } catch (error) {
    console.error('Sync function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to start SoundCloud sync job'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Background processing function
async function processSoundCloudArtists(supabase: any, artists: any[]) {
  const results = {
    processed: 0,
    updated: 0,
    failed: 0,
    errors: [] as string[],
    startedAt: new Date().toISOString(),
    completedAt: null as string | null
  }

  console.log(`Background job processing ${artists.length} artists...`)

  if (artists.length === 0) {
    console.log('No artists to process')
    return
  }

  // Process each artist
  for (const artist of artists) {
    try {
      results.processed++
      console.log(`Processing artist ${results.processed}/${artists.length}: ${artist.name}`)

      const soundcloudUrl = artist.soundcloud_url
      
      if (!soundcloudUrl.includes('soundcloud.com/')) {
        console.warn(`Invalid SoundCloud URL for ${artist.name}: ${soundcloudUrl}`)
        results.failed++
        results.errors.push(`Invalid URL format for ${artist.name}`)
        continue
      }

      console.log(`Scraping data for ${artist.name} from SoundCloud...`)
      
      const scrapedData = await scrapeSoundCloudWithBrowserless(soundcloudUrl)
      
      console.log(`Found data for ${artist.name}:`, scrapedData)

      const updateData: any = {
        last_soundcloud_sync: new Date().toISOString()
      }

      if (scrapedData.followersCount !== null && scrapedData.followersCount > 0) {
        updateData.soundcloud_followers = scrapedData.followersCount
      }

      if (scrapedData.avatarUrl && (!artist.image_url || scrapedData.avatarUrl.includes('t500x500'))) {
        // Try to get higher resolution image
        let highResUrl = scrapedData.avatarUrl
        if (highResUrl.includes('large.jpg')) {
          highResUrl = highResUrl.replace('large.jpg', 't500x500.jpg')
        } else if (highResUrl.includes('crop')) {
          // SoundCloud sometimes uses crop parameter, try to get original
          highResUrl = highResUrl.replace(/crop.*?\.jpg/, 't500x500.jpg')
        }
        updateData.image_url = highResUrl
        console.log(`Updating image for ${artist.name}`)
      }

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

      // Rate limiting - Browserless has generous limits but still be respectful
      await new Promise(resolve => setTimeout(resolve, 2000))

    } catch (error) {
      console.error(`Error processing ${artist.name}:`, error)
      results.failed++
      results.errors.push(`Processing error for ${artist.name}: ${error.message}`)
      
      // Only update sync timestamp on certain types of errors (not scraping failures)
      if (error.message.includes('Invalid URL format') || error.message.includes('rate limit')) {
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
  }

  results.completedAt = new Date().toISOString()
  console.log('Background job completed:', results)

  // Optionally store results in a database table for tracking
  // try {
  //   await supabase
  //     .from('sync_jobs')
  //     .insert({
  //       job_type: 'soundcloud_sync',
  //       results: results,
  //       created_at: new Date().toISOString()
  //     })
  // } catch (error) {
  //   console.error('Failed to store job results:', error)
  // }
}