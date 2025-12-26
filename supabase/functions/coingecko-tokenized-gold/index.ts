import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching tokenized gold tokens data from CoinGecko...');

    // Fetch tokenized gold market data from CoinGecko
    const coingeckoUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=tokenized-gold&order=market_cap_desc&per_page=10';

    // Add API key if available in environment
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    // Check if we have a CoinGecko API key in environment variables
    const apiKey = Deno.env.get('COINGECKO_API_KEY');
    if (apiKey) {
      headers['X-CG-API-KEY'] = apiKey;
    }

    const response = await fetch(coingeckoUrl, {
      headers,
      cache: 'no-store' // Force fresh result every time
    });

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      throw new Error(`CoinGecko API returned ${response.status}`);
    }

    const tokensData = await response.json();
    console.log(`Received ${tokensData.length} tokenized gold tokens from CoinGecko`);

    // Process and format token data - only include required fields
    const tokens = tokensData.map((t: any) => ({
      name: t.name,
      symbol: (t.symbol || '').toUpperCase(),
      current_price: t.current_price,
      market_cap: t.market_cap,
    }));

    console.log(`Successfully processed ${tokens.length} tokenized gold tokens`);

    return new Response(
      JSON.stringify({
        tokens,
        lastUpdated: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching tokenized gold data:', errorMessage);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        tokens: [],
        lastUpdated: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});