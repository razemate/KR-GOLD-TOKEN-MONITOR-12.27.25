(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/hooks/useGoldData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGoldData",
    ()=>useGoldData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const CONFIG = {
    CACHE_KEY: 'gold_monitor_v1',
    TIMEZONE: 'America/Los_Angeles',
    WEEKDAY_INTERVAL: 300000,
    WEEKEND_INTERVAL: 900000
};
const isPacificWeekend = ()=>{
    const now = new Date();
    const ptDateStr = now.toLocaleString('en-US', {
        timeZone: CONFIG.TIMEZONE
    });
    const ptDate = new Date(ptDateStr);
    const day = ptDate.getDay();
    return day === 0 || day === 6;
};
function useGoldData() {
    _s();
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [goldPrice, setGoldPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aggregateCap, setAggregateCap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedTokenId, setSelectedTokenId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [syncStatus, setSyncStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [analyses, setAnalyses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const loadData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useGoldData.useCallback[loadData]": async ()=>{
            setSyncStatus('syncing');
            setError(null);
            // Try to load from cache first for fast initial paint
            try {
                const cached = localStorage.getItem(CONFIG.CACHE_KEY);
                if (cached && tokens.length === 0) {
                    const data = JSON.parse(cached);
                    if (data?.tokens?.length > 0) {
                        setTokens(data.tokens);
                        setGoldPrice(data.goldPrice);
                        setAggregateCap(data.aggregateCap);
                        setAnalyses(data.analyses || {});
                        setLastUpdated(new Date(data.lastUpdated));
                        if (!selectedTokenId) {
                            setSelectedTokenId(data.tokens[0]?.id);
                        }
                        setLoading(false);
                    }
                }
            } catch (e) {
                console.warn('Cache load failed', e);
            }
            // Fetch fresh data from the new Vercel API route
            try {
                const response = await fetch('/api/gold-intel');
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data.error) {
                    // Handle the new error format
                    if (data.error === "MISSING_ENV") {
                        const missingKeys = data.missing?.join(', ') || 'unknown';
                        throw new Error(`Missing environment variables: ${missingKeys}. Please add your API keys to .env.local file.`);
                    }
                    throw new Error(data.error);
                }
                if (!data || !data.tokens || data.tokens.length === 0) {
                    throw new Error('No token data received');
                }
                setTokens(data.tokens);
                // Use the top token's price as reference gold spot (most liquid gold token)
                setGoldPrice(data.tokens[0]?.price || null);
                // Calculate aggregate market cap
                const aggregate = data.tokens.reduce({
                    "useGoldData.useCallback[loadData].aggregate": (acc, t)=>acc + (t.cap || 0)
                }["useGoldData.useCallback[loadData].aggregate"], 0);
                setAggregateCap(aggregate);
                setAnalyses(data.analyses);
                setLastUpdated(new Date(data.generatedAt));
                if (!selectedTokenId && data.tokens.length > 0) {
                    setSelectedTokenId(data.tokens[0].id);
                }
                // Update cache
                localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({
                    tokens: data.tokens,
                    goldPrice: data.tokens[0]?.price || null,
                    aggregateCap: aggregate,
                    analyses: data.analyses,
                    lastUpdated: data.generatedAt
                }));
                setSyncStatus('synced');
                setLoading(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
                console.error('Data fetch error:', errorMessage);
                setError(errorMessage);
                setSyncStatus('error');
                setLoading(false);
            }
        }
    }["useGoldData.useCallback[loadData]"], [
        selectedTokenId,
        tokens.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGoldData.useEffect": ()=>{
            // Initial load
            loadData();
            // Set up auto-refresh interval based on weekday/weekend
            const setupInterval = {
                "useGoldData.useEffect.setupInterval": ()=>{
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    const intervalMs = isPacificWeekend() ? CONFIG.WEEKEND_INTERVAL : CONFIG.WEEKDAY_INTERVAL;
                    console.log(`Auto-refresh: ${isPacificWeekend() ? 'Weekend (15min)' : 'Weekday (5min)'}`);
                    intervalRef.current = setInterval(loadData, intervalMs);
                }
            }["useGoldData.useEffect.setupInterval"];
            setupInterval();
            // Check for weekday/weekend change every hour
            const weekendCheckInterval = setInterval({
                "useGoldData.useEffect.weekendCheckInterval": ()=>{
                    setupInterval();
                }
            }["useGoldData.useEffect.weekendCheckInterval"], 3600000);
            return ({
                "useGoldData.useEffect": ()=>{
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    clearInterval(weekendCheckInterval);
                }
            })["useGoldData.useEffect"];
        }
    }["useGoldData.useEffect"], [
        loadData
    ]);
    return {
        tokens,
        goldPrice,
        aggregateCap,
        selectedTokenId,
        setSelectedTokenId,
        lastUpdated,
        loading,
        error,
        syncStatus,
        analyses
    };
}
_s(useGoldData, "EPwgSUxN57ifnIjOKYJtlxXCv0o=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function StatBox({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest",
                children: label
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-2xl font-light text-foreground",
                children: value
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = StatBox;
function Header({ goldPrice, aggregateCap, lastUpdated, syncStatus }) {
    const formatCurrency = (value)=>{
        if (value === null || value === 0) return '---';
        return `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };
    const formatMarketCap = (value)=>{
        if (value === 0) return '---';
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toLocaleString()}`;
    };
    const getTimeSinceUpdate = ()=>{
        if (!lastUpdated) return '';
        const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
        if (mins < 1) return 'just now';
        return `${mins}m ago`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "mb-8 border-b border-border pb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex justify-between items-center py-3 mb-6 border-b border-border/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-2 h-2 rounded-full", syncStatus === 'syncing' && "bg-primary animate-pulse-gold", syncStatus === 'synced' && "bg-positive", syncStatus === 'error' && "bg-negative", syncStatus === 'idle' && "bg-muted-foreground")
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[0.625rem] font-bold uppercase tracking-[0.25em] text-muted-foreground",
                                children: "Live Intelligence"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground",
                            children: syncStatus === 'syncing' ? 'Syncing...' : getTimeSinceUpdate()
                        }, void 0, false, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-primary/10 rounded flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl text-primary",
                                    children: "⬡"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl lg:text-4xl font-extralight text-foreground tracking-tight",
                                        children: "Gold Token Monitor"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[0.625rem] font-bold text-primary uppercase tracking-[0.4em] mt-1",
                                        children: "Katusa Research"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-10 lg:gap-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                label: "Gold Spot",
                                value: formatCurrency(goldPrice)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                label: "Aggregate Cap",
                                value: formatMarketCap(aggregateCap)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c1 = Header;
var _c, _c1;
__turbopack_context__.k.register(_c, "StatBox");
__turbopack_context__.k.register(_c1, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenList",
    ()=>TokenList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function TokenSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-16 w-full bg-muted/50 animate-pulse rounded"
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = TokenSkeleton;
function TokenList({ tokens, selectedId, onSelect, lastUpdated }) {
    const getTimeSinceUpdate = ()=>{
        if (!lastUpdated) return '';
        const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
        if (mins < 1) return 'just now';
        return `${mins}m ago`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-card border border-border rounded p-4 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center border-b border-border pb-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[0.625rem] font-bold text-muted-foreground uppercase tracking-wider",
                        children: [
                            "Active Index (",
                            tokens.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[0.5rem] text-muted-foreground/70",
                        children: getTimeSinceUpdate()
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    tokens.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenSkeleton, {}, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenSkeleton, {}, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenSkeleton, {}, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    tokens.map((token, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>onSelect(token.id),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 cursor-pointer flex items-center justify-between transition-all duration-200 border rounded", selectedId === token.id ? "bg-secondary/50 border-primary/50" : "border-transparent hover:bg-secondary/30"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[0.625rem] font-bold text-muted-foreground w-5",
                                            children: [
                                                "#",
                                                index + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: token.img,
                                            alt: token.sym,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-7 h-7 rounded-full transition-all", selectedId === token.id ? "grayscale-0" : "grayscale hover:grayscale-0")
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: token.name
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[0.625rem] font-bold text-muted-foreground uppercase",
                                                    children: token.sym
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-light text-foreground",
                                            children: [
                                                "$",
                                                token.price?.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[0.625rem] font-semibold", token.chg >= 0 ? "text-positive" : "text-negative"),
                                            children: [
                                                token.chg > 0 ? '+' : '',
                                                token.chg?.toFixed(2),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, token.id, true, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c1 = TokenList;
var _c, _c1;
__turbopack_context__.k.register(_c, "TokenSkeleton");
__turbopack_context__.k.register(_c1, "TokenList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PerformanceChart",
    ()=>PerformanceChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/cartesian/Area.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/chart/AreaChart.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function PerformanceChart({ token }) {
    _s();
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PerformanceChart.useMemo[chartData]": ()=>{
            if (!token) return [];
            const spark = token.spark || [];
            const dataPoints = spark.length > 0 ? spark : [
                token.price
            ];
            // Sample to ~100 points for performance
            const pts = 100;
            const step = Math.max(1, Math.ceil(dataPoints.length / pts));
            const sampledData = dataPoints.filter({
                "PerformanceChart.useMemo[chartData].sampledData": (_, i)=>i % step === 0
            }["PerformanceChart.useMemo[chartData].sampledData"]);
            return sampledData.map({
                "PerformanceChart.useMemo[chartData]": (price, i)=>{
                    const total = sampledData.length;
                    const hr = Math.floor((total - 1 - i) * (168 / (total || 1))); // 168h = 7d
                    const label = hr === 0 ? 'NOW' : hr >= 24 ? `-${Math.floor(hr / 24)}d` : `-${hr}h`;
                    return {
                        time: label,
                        price: price
                    };
                }
            }["PerformanceChart.useMemo[chartData]"]);
        }
    }["PerformanceChart.useMemo[chartData]"], [
        token
    ]);
    if (!token || chartData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card border border-border rounded p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[300px] flex items-center justify-center text-muted-foreground",
                children: "Select a token to view performance"
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    const minPrice = Math.min(...chartData.map((d)=>d.price));
    const maxPrice = Math.max(...chartData.map((d)=>d.price));
    const padding = (maxPrice - minPrice) * 0.1 || 10;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-card border border-border rounded p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-medium text-foreground uppercase mb-6 tracking-wide",
                children: [
                    token.name,
                    " Performance (7D)"
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[300px] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    height: "100%",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                        data: chartData,
                        margin: {
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                    id: "goldGradient",
                                    x1: "0",
                                    y1: "0",
                                    x2: "0",
                                    y2: "1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "5%",
                                            stopColor: "hsl(43, 55%, 55%)",
                                            stopOpacity: 0.15
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "95%",
                                            stopColor: "hsl(43, 55%, 55%)",
                                            stopOpacity: 0
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                            lineNumber: 68,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                dataKey: "time",
                                axisLine: false,
                                tickLine: false,
                                tick: {
                                    fill: 'hsl(0, 0%, 45%)',
                                    fontSize: 11
                                },
                                interval: "preserveStartEnd"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                orientation: "right",
                                axisLine: false,
                                tickLine: false,
                                tick: {
                                    fill: 'hsl(0, 0%, 45%)',
                                    fontSize: 11
                                },
                                domain: [
                                    minPrice - padding,
                                    maxPrice + padding
                                ],
                                tickFormatter: (value)=>`$${value.toFixed(0)}`
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                contentStyle: {
                                    backgroundColor: 'hsl(0, 0%, 6%)',
                                    border: '1px solid hsl(43, 55%, 55%, 0.3)',
                                    borderRadius: '4px',
                                    color: 'hsl(0, 0%, 85%)'
                                },
                                labelStyle: {
                                    color: 'hsl(43, 55%, 55%)'
                                },
                                formatter: (value)=>[
                                        `$${value.toFixed(2)}`,
                                        'Price'
                                    ]
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
                                type: "monotone",
                                dataKey: "price",
                                stroke: "hsl(43, 55%, 55%)",
                                strokeWidth: 1.5,
                                fill: "url(#goldGradient)"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(PerformanceChart, "i4eYYg6GOj65klTCDK4mhi4wfgw=");
_c = PerformanceChart;
var _c;
__turbopack_context__.k.register(_c, "PerformanceChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketIntel",
    ()=>MarketIntel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function MarketIntel({ token, goldPrice, analysis }) {
    // Calculate spread vs spot
    const spread = token && goldPrice ? (token.price - goldPrice) / goldPrice * 100 : null;
    // Generate market analysis based on token data if no AI analysis is available
    const getAnalysis = ()=>{
        if (!token) return 'Select a token to view market intelligence...';
        // If we have AI analysis, return it
        if (analysis) {
            return analysis.summary;
        }
        // Fallback to generated analysis
        const priceChange = token.chg;
        const isUp = priceChange >= 0;
        const changeAbs = Math.abs(priceChange);
        if (changeAbs > 3) {
            return isUp ? `${token.name} showing strong momentum with ${changeAbs.toFixed(1)}% gains. Elevated institutional interest detected in gold-backed digital assets.` : `${token.name} under pressure with ${changeAbs.toFixed(1)}% decline. Monitor for potential reversion to mean near support levels.`;
        } else if (changeAbs > 1) {
            return isUp ? `${token.name} maintaining steady upward trajectory. Current price action reflects healthy accumulation phase.` : `${token.name} experiencing minor retracement. Price consolidation typical during periods of market uncertainty.`;
        } else {
            return `${token.name} trading within tight range. Low volatility suggests stable holder base with minimal speculative activity.`;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-card border border-border rounded p-6 border-l-2 border-l-primary/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-[0.625rem] font-bold text-muted-foreground uppercase mb-4 tracking-wider",
                children: "Market Intel"
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground leading-relaxed min-h-[60px]",
                children: getAnalysis()
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 pt-4 border-t border-border flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[0.5rem] font-bold text-muted-foreground uppercase tracking-wider",
                        children: "Spread vs Spot"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    spread !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xl font-light", spread >= 0 ? "text-positive" : "text-negative"),
                        children: [
                            spread > 0 ? '+' : '',
                            spread.toFixed(3),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl font-light text-muted-foreground",
                        children: "---"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = MarketIntel;
var _c;
__turbopack_context__.k.register(_c, "MarketIntel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetSpecs",
    ()=>AssetSpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function AssetSpecs({ token }) {
    if (!token) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card border border-border rounded p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-muted-foreground text-sm",
                children: "Select a token..."
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
                lineNumber: 19,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this);
    }
    const formatNumber = (num, decimals = 2)=>{
        if (num === undefined || num === null) return '---';
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };
    const formatLargeNumber = (num)=>{
        if (num === undefined || num === null) return '---';
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
        return formatNumber(num);
    };
    const specs = [
        {
            label: 'Symbol',
            value: token.sym
        },
        {
            label: 'Market Cap',
            value: `$${formatLargeNumber(token.cap)}`
        },
        {
            label: '24h Volume',
            value: `$${formatLargeNumber(token.volume)}`
        },
        {
            label: '24h High',
            value: `$${formatNumber(token.high)}`
        },
        {
            label: '24h Low',
            value: `$${formatNumber(token.low)}`
        },
        {
            label: '24h Change',
            value: `${token.chg > 0 ? '+' : ''}${token.chg?.toFixed(2)}%`,
            isChange: true,
            changeValue: token.chg
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-card border border-border rounded p-6 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-[0.625rem] font-bold text-muted-foreground uppercase mb-4 tracking-wider",
                children: "Asset Specs"
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: specs.map((spec)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between border-b border-border/50 pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[0.75rem] text-muted-foreground uppercase",
                                children: spec.label
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[0.75rem] font-medium", spec.isChange ? spec.changeValue && spec.changeValue >= 0 ? "text-positive" : "text-negative" : "text-foreground"),
                                children: spec.value
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        ]
                    }, spec.label, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c = AssetSpecs;
var _c;
__turbopack_context__.k.register(_c, "AssetSpecs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketDistribution",
    ()=>MarketDistribution
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const COLORS = [
    'hsl(43, 55%, 55%)',
    'hsl(43, 45%, 45%)',
    'hsl(43, 35%, 35%)',
    'hsl(0, 0%, 30%)',
    'hsl(0, 0%, 20%)'
];
function MarketDistribution({ tokens }) {
    _s();
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MarketDistribution.useMemo[chartData]": ()=>{
            const totalCap = tokens.reduce({
                "MarketDistribution.useMemo[chartData].totalCap": (acc, t)=>acc + (t.cap || 0)
            }["MarketDistribution.useMemo[chartData].totalCap"], 0);
            return tokens.map({
                "MarketDistribution.useMemo[chartData]": (token)=>({
                        name: token.sym,
                        value: token.cap || 0,
                        percentage: totalCap > 0 ? (token.cap || 0) / totalCap * 100 : 0
                    })
            }["MarketDistribution.useMemo[chartData]"]);
        }
    }["MarketDistribution.useMemo[chartData]"], [
        tokens
    ]);
    if (tokens.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card border border-border rounded p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[200px] flex items-center justify-center text-muted-foreground",
                children: "Loading distribution data..."
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-card border border-border rounded p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-[0.625rem] font-bold text-muted-foreground uppercase mb-4 tracking-wider",
                children: "Market Cap Distribution"
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[180px] w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    height: "100%",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                data: chartData,
                                cx: "50%",
                                cy: "50%",
                                innerRadius: 40,
                                outerRadius: 70,
                                paddingAngle: 2,
                                dataKey: "value",
                                children: chartData.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                        fill: COLORS[index % COLORS.length]
                                    }, entry.name, false, {
                                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                contentStyle: {
                                    backgroundColor: 'hsl(0, 0%, 6%)',
                                    border: '1px solid hsl(43, 55%, 55%, 0.3)',
                                    borderRadius: '4px',
                                    color: 'hsl(0, 0%, 85%)'
                                },
                                formatter: (value, name)=>[
                                        `$${(value / 1e9).toFixed(2)}B (${chartData.find((d)=>d.name === name)?.percentage.toFixed(1)}%)`,
                                        name
                                    ]
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3 mt-4 justify-center",
                children: chartData.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full",
                                style: {
                                    backgroundColor: COLORS[index % COLORS.length]
                                }
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[0.625rem] text-muted-foreground",
                                children: [
                                    entry.name,
                                    " (",
                                    entry.percentage.toFixed(1),
                                    "%)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this)
                        ]
                    }, entry.name, true, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(MarketDistribution, "i4eYYg6GOj65klTCDK4mhi4wfgw=");
_c = MarketDistribution;
var _c;
__turbopack_context__.k.register(_c, "MarketDistribution");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx",
        lineNumber: 6,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx",
        lineNumber: 32,
        columnNumber: 37
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/hooks/useTokenizedGoldData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTokenizedGoldData",
    ()=>useTokenizedGoldData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useTokenizedGoldData() {
    _s();
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTokenizedGoldData.useEffect": ()=>{
            const fetchTokenizedGoldData = {
                "useTokenizedGoldData.useEffect.fetchTokenizedGoldData": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const response = await fetch('/api/gold-intel');
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                        const data = await response.json();
                        if (data.error) {
                            // Handle the new error format
                            if (data.error === "MISSING_ENV") {
                                const missingKeys = data.missing?.join(', ') || 'unknown';
                                throw new Error(`Missing environment variables: ${missingKeys}. Please add your API keys to .env.local file.`);
                            }
                            throw new Error(data.error);
                        }
                        if (!data || !data.tokens) {
                            throw new Error('No token data received');
                        }
                        setTokens(data.tokens);
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tokenized gold data';
                        console.error('Tokenized gold data fetch error:', errorMessage);
                        setError(errorMessage);
                    } finally{
                        setLoading(false);
                    }
                }
            }["useTokenizedGoldData.useEffect.fetchTokenizedGoldData"];
            fetchTokenizedGoldData();
        }
    }["useTokenizedGoldData.useEffect"], []);
    return {
        tokens,
        loading,
        error
    };
}
_s(useTokenizedGoldData, "I49/eHYhTlLzTiH6Dqk4N+YXJ0E=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/skeleton.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$hooks$2f$useTokenizedGoldData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/hooks/useTokenizedGoldData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/ui/skeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const formatNumber = (num)=>{
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
const formatMarketCap = (num)=>{
    if (num >= 1_000_000_000) {
        return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
        return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
        return `$${(num / 1_000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
};
const TokenizedGoldList = ()=>{
    _s();
    const { tokens, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$hooks$2f$useTokenizedGoldData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTokenizedGoldData"])();
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "h-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-lg",
                        children: "Tokenized Gold Tokens"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-destructive text-sm",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                    className: "text-lg",
                    children: "Top Tokenized Gold Tokens"
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: loading ? Array.from({
                        length: 5
                    }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-4 w-24"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 52,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-3 w-16"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 53,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                    lineNumber: 51,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-4 w-20 ml-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 56,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-3 w-24 ml-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 57,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                    lineNumber: 55,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, index, true, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                            lineNumber: 50,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))) : tokens.length > 0 ? tokens.map((token, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between py-2 border-b border-border/50 last:border-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-medium",
                                            children: token.name
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 65,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground",
                                            children: token.sym
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 66,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                    lineNumber: 64,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-medium",
                                            children: [
                                                "$",
                                                formatNumber(token.price)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 69,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground",
                                            children: [
                                                "MCap: ",
                                                formatMarketCap(token.cap)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                            lineNumber: 70,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                                    lineNumber: 68,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, index, true, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                            lineNumber: 63,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8 text-muted-foreground",
                        children: "No tokenized gold tokens found"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                        lineNumber: 77,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TokenizedGoldList, "OAVLDeEjoe0XKT/ZQNHBkUr7hoU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$hooks$2f$useTokenizedGoldData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTokenizedGoldData"]
    ];
});
_c = TokenizedGoldList;
const __TURBOPACK__default__export__ = TokenizedGoldList;
var _c;
__turbopack_context__.k.register(_c, "TokenizedGoldList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$PerformanceChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$MarketIntel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$AssetSpecs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$MarketDistribution$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenizedGoldList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx [app-client] (ecmascript) <export default as TokenizedGoldList>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenizedGoldList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenizedGoldList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenizedGoldList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx [app-client] (ecmascript)");
}),
"[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$hooks$2f$useGoldData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/hooks/useGoldData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$PerformanceChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/PerformanceChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$MarketIntel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketIntel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$AssetSpecs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/AssetSpecs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$MarketDistribution$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/MarketDistribution.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenizedGoldList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TokenizedGoldList$3e$__ = __turbopack_context__.i("[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/components/gold/TokenizedGoldList.tsx [app-client] (ecmascript) <export default as TokenizedGoldList>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const Index = ()=>{
    _s();
    const { tokens, goldPrice, aggregateCap, selectedTokenId, setSelectedTokenId, lastUpdated, error, syncStatus, analyses } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$hooks$2f$useGoldData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoldData"])();
    const selectedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Index.useMemo[selectedToken]": ()=>tokens.find({
                "Index.useMemo[selectedToken]": (t)=>t.id === selectedTokenId
            }["Index.useMemo[selectedToken]"]) || null
    }["Index.useMemo[selectedToken]"], [
        tokens,
        selectedTokenId
    ]);
    if (error && tokens.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background text-foreground flex items-center justify-center p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full bg-card border border-destructive/50 p-6 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-destructive mb-2",
                        children: "Connection Error"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm mb-4",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground uppercase",
                        children: "Data will refresh automatically."
                    }, void 0, false, {
                        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background text-foreground pb-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1600px] mx-auto p-4 lg:p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
                    goldPrice: goldPrice,
                    aggregateCap: aggregateCap,
                    lastUpdated: lastUpdated,
                    syncStatus: syncStatus
                }, void 0, false, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "lg:col-span-4 xl:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenList"], {
                                tokens: tokens,
                                selectedId: selectedTokenId,
                                onSelect: setSelectedTokenId,
                                lastUpdated: lastUpdated
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "lg:col-span-8 xl:col-span-6 flex flex-col gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$PerformanceChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerformanceChart"], {
                                    token: selectedToken
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$MarketIntel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketIntel"], {
                                            token: selectedToken,
                                            goldPrice: goldPrice,
                                            analysis: analyses[selectedTokenId || '']
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$AssetSpecs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetSpecs"], {
                                            token: selectedToken
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$TokenizedGoldList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TokenizedGoldList$3e$__["TokenizedGoldList"], {}, void 0, false, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "lg:col-span-12 xl:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$components$2f$gold$2f$MarketDistribution$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketDistribution"], {
                                tokens: tokens
                            }, void 0, false, {
                                fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-between gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[0.625rem] text-muted-foreground uppercase tracking-widest max-w-2xl",
                            children: "Institutional data via CoinGecko. Not financial advice."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-8 text-[0.625rem] text-muted-foreground font-bold uppercase",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Auto-Refresh: 5min"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Tier: L1"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Downloads/APPS - PROTOTYPING/Gold Token Monitor - Lovable/src/pages/Index.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Index, "wYIadPheEckK0i/CGNIt6KfmFng=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$APPS__$2d$__PROTOTYPING$2f$Gold__Token__Monitor__$2d$__Lovable$2f$src$2f$hooks$2f$useGoldData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoldData"]
    ];
});
_c = Index;
const __TURBOPACK__default__export__ = Index;
var _c;
__turbopack_context__.k.register(_c, "Index");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_APPS%20-%20PROTOTYPING_Gold%20Token%20Monitor%20-%20Lovable_src_2ecef796._.js.map