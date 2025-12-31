import { NextRequest } from 'next/server';

interface TokenData {
  volume24hUsd: number | null;
  change24hPct: number | null;
  marketCapUsd: number | null;
  priceUsd: number;
  high24h: number | null;
  low24h: number | null;
}

interface RequestBody {
  tokenData: TokenData;
  tokenName: string;
}

export async function POST(request: NextRequest) {
  try {
    const { tokenData, tokenName }: RequestBody = await request.json();

    // Validate required data
    if (!tokenData || !tokenName) {
      return Response.json({ error: 'Missing tokenData or tokenName' }, { status: 400 });
    }

    // Prepare the prompt for Gemini
    const prompt = `Analyze the market conditions for ${tokenName} token based on the following data:
    - Current price: $${tokenData.priceUsd}
    - 24h change: ${tokenData.change24hPct !== null ? tokenData.change24hPct.toFixed(2) + '%' : 'N/A'}
    - 24h volume: $${tokenData.volume24hUsd !== null ? tokenData.volume24hUsd.toLocaleString() : 'N/A'}
    - Market cap: $${tokenData.marketCapUsd !== null ? tokenData.marketCapUsd.toLocaleString() : 'N/A'}
    - 24h high: $${tokenData.high24h !== null ? tokenData.high24h.toFixed(2) : 'N/A'}
    - 24h low: $${tokenData.low24h !== null ? tokenData.low24h.toFixed(2) : 'N/A'}

    Provide a concise market analysis with:
    1. A sentiment label (e.g., Bullish Accumulation, Bearish Divergence, Sideways Action, etc.)
    2. A short narrative explanation (2-3 sentences max) explaining why the market is moving this way based on volume, volatility, trend, and peg behavior.

    Format your response as:
    SENTIMENT: [sentiment label]
    EXPLANATION: [short explanation]`;

    // Call the Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return Response.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      return Response.json({ error: 'Failed to get AI analysis from Gemini', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract the AI response
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available';
    
    // Parse the response to extract sentiment and explanation
    const sentimentMatch = aiText.match(/SENTIMENT:\s*([^\n]+)/i);
    const explanationMatch = aiText.match(/EXPLANATION:\s*([\s\S]*)/i);
    
    const sentiment = sentimentMatch ? sentimentMatch[1].trim() : 'ANALYZING';
    const explanation = explanationMatch ? explanationMatch[1].trim() : aiText.substring(0, 200) + '...';

    return Response.json({
      sentiment: sentiment,
      explanation: explanation,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI Market Sentinel:', error);
    return Response.json({ error: 'Internal server error in AI analysis' }, { status: 500 });
  }
}