import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOLD_TOKEN_IDS = [
  'tether-gold',
  'pax-gold',
  'meld-gold',
  'gold-coin',
  'vnx-gold'
].join(',');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching gold token data from CoinGecko...');
    
    // Fetch token market data from CoinGecko
    const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${GOLD_TOKEN_IDS}&sparkline=true&price_change_percentage=24h`;
    
    const response = await fetch(coingeckoUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      throw new Error(`CoinGecko API returned ${response.status}`);
    }

    const tokensData = await response.json();
    console.log(`Received ${tokensData.length} tokens from CoinGecko`);

    // Process and format token data
    const tokens = tokensData.map((t: any) => ({
      id: t.id,
      sym: (t.symbol || '').toUpperCase(),
      name: t.name,
      img: t.image,
      price: t.current_price,
      cap: t.market_cap,
      chg: t.price_change_percentage_24h,
      high: t.high_24h,
      low: t.low_24h,
      volume: t.total_volume,
      circSupply: t.circulating_supply,
      totalSupply: t.total_supply,
      ath: t.ath,
      athDate: t.ath_date,
      atl: t.atl,
      atlDate: t.atl_date,
      spark: t.sparkline_in_7d?.price?.filter((v: number) => v != null) || []
    }));

    // Sort by market cap (highest first)
    tokens.sort((a: any, b: any) => (b.cap || 0) - (a.cap || 0));

    // Use the top token's price as reference gold spot (most liquid gold token)
    const goldSpotPrice = tokens[0]?.price || 0;

    // Calculate aggregate market cap
    const aggregateCap = tokens.reduce((acc: number, t: any) => acc + (t.cap || 0), 0);

    console.log(`Gold spot reference: $${goldSpotPrice}, Aggregate cap: $${aggregateCap}`);

    return new Response(
      JSON.stringify({
        tokens,
        goldPrice: goldSpotPrice,
        aggregateCap,
        lastUpdated: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching gold data:', errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        tokens: [],
        goldPrice: 0,
        aggregateCap: 0,
        lastUpdated: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
