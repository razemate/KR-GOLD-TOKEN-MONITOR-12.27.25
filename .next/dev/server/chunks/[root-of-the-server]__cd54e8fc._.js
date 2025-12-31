module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/ai/sentinel/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
async function POST(request) {
    try {
        const { tokenData, tokenName } = await request.json();
        // Validate required data
        if (!tokenData || !tokenName) {
            return Response.json({
                error: 'Missing tokenData or tokenName'
            }, {
                status: 400
            });
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
            return Response.json({
                error: 'GEMINI_API_KEY is not configured'
            }, {
                status: 500
            });
        }
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            console.error('Gemini API error:', errorData);
            return Response.json({
                error: 'Failed to get AI analysis from Gemini',
                details: errorData
            }, {
                status: response.status
            });
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
        return Response.json({
            error: 'Internal server error in AI analysis'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cd54e8fc._.js.map