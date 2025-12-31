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
"[project]/src/lib/normalize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/normalize.ts
// Functions to normalize API responses according to the blueprint
__turbopack_context__.s([
    "normalizeChartPoint",
    ()=>normalizeChartPoint,
    "normalizeChartPoints",
    ()=>normalizeChartPoints,
    "normalizeToken",
    ()=>normalizeToken,
    "normalizeTokenList",
    ()=>normalizeTokenList
]);
function normalizeToken(rawToken) {
    // Validate and normalize token data according to blueprint specifications
    return {
        id: rawToken.id || '',
        symbol: (rawToken.symbol || '').toUpperCase(),
        name: rawToken.name || '',
        image: rawToken.image || '',
        priceUsd: typeof rawToken.current_price === 'number' ? rawToken.current_price : typeof rawToken.priceUsd === 'number' ? rawToken.priceUsd : 0,
        change24hPct: typeof rawToken.price_change_percentage_24h === 'number' ? rawToken.price_change_percentage_24h : typeof rawToken.change24hPct === 'number' ? rawToken.change24hPct : null,
        marketCapUsd: typeof rawToken.market_cap === 'number' ? rawToken.market_cap : typeof rawToken.marketCapUsd === 'number' ? rawToken.marketCapUsd : null,
        volume24hUsd: typeof rawToken.total_volume === 'number' ? rawToken.total_volume : typeof rawToken.volume24hUsd === 'number' ? rawToken.volume24hUsd : null,
        circulatingSupply: typeof rawToken.circulating_supply === 'number' ? rawToken.circulating_supply : typeof rawToken.circulatingSupply === 'number' ? rawToken.circulatingSupply : null,
        totalSupply: typeof rawToken.total_supply === 'number' ? rawToken.total_supply : typeof rawToken.totalSupply === 'number' ? rawToken.totalSupply : null,
        high24h: typeof rawToken.high_24h === 'number' ? rawToken.high_24h : typeof rawToken.high24h === 'number' ? rawToken.high24h : null,
        low24h: typeof rawToken.low_24h === 'number' ? rawToken.low_24h : typeof rawToken.low24h === 'number' ? rawToken.low24h : null
    };
}
function normalizeChartPoint(rawPoint) {
    // Validate and normalize chart point data according to blueprint specifications
    // CoinGecko returns [timestamp, price]
    if (Array.isArray(rawPoint) && rawPoint.length >= 2) {
        return {
            t: typeof rawPoint[0] === 'number' ? rawPoint[0] : 0,
            price: typeof rawPoint[1] === 'number' ? rawPoint[1] : 0
        };
    }
    return {
        t: typeof rawPoint.t === 'number' ? rawPoint.t : 0,
        price: typeof rawPoint.price === 'number' ? rawPoint.price : 0
    };
}
function normalizeTokenList(rawTokens) {
    if (!Array.isArray(rawTokens)) return [];
    return rawTokens.map((token)=>normalizeToken(token));
}
function normalizeChartPoints(rawPoints) {
    if (!Array.isArray(rawPoints)) return [];
    return rawPoints.map((point)=>normalizeChartPoint(point));
}
}),
"[project]/src/app/api/tokens/[id]/chart/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/normalize.ts [app-route] (ecmascript)");
;
async function GET(request, { params }) {
    const { id } = params;
    const cg = process.env.COINGECKO_API_KEY;
    try {
        const chartUrl = new URL(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`);
        chartUrl.searchParams.set('vs_currency', 'usd');
        chartUrl.searchParams.set('days', '7');
        const headers = {
            'Accept': 'application/json'
        };
        // Only add API key if present (optional per blueprint)
        if (cg) {
            headers['x-cg-demo-api-key'] = cg;
        }
        const response = await fetch(chartUrl.toString(), {
            headers,
            next: {
                revalidate: 300
            }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            return Response.json({
                error: 'Failed to fetch chart data from CoinGecko',
                details: errorData
            }, {
                status: response.status
            });
        }
        const rawData = await response.json();
        const normalizedPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeChartPoints"])(rawData.prices || []);
        return new Response(JSON.stringify(normalizedPoints), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=300, stale-while-revalidate=1800'
            }
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return Response.json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dd9d5aeb._.js.map