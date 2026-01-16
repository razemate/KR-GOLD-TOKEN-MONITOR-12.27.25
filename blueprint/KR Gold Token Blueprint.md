# GOLD TOKEN MONITOR - AUTHORITATIVE BLUEPRINT  
**(COMBINED + AMENDED + RENumbered, CLEAN)**

This document is the **single, consolidated source of truth**.  
It combines the two attached blueprints and applies the **approved amendments only**.  
All sections are **cleanly renumbered sequentially** for consistency and readability.  
No scope expansion beyond the agreed amendments.

---

## 0. ABSOLUTE NON-NEGOTIABLE RULES

### 0.1 REAL DATA ONLY  
No mock, fake, placeholder, simulated, interpolated, estimated, or invented values are allowed.  
If upstream data is unavailable, the app MUST display **"N/A"** or **"UNKNOWN"**.  
NO spinners. NO "loading..." text. NO fake progress indicators.

**AMENDMENT 0.1-A - UI LOADING SCAFFOLDING (APPROVED)**  
Layout-only visual skeleton placeholders are **PERMITTED** solely to preserve layout stability during the **initial snapshot fetch**.  
Skeletons MUST:
- Contain **NO numbers**
- Contain **NO text**
- Contain **NO implied timing or certainty**
- Disappear immediately once real data is injected  

Still forbidden: spinners, progress bars, countdowns/timers, or any indicator implying data is guaranteed or "on the way".

### 0.2 NO UI DECEPTION  
The UI must never imply data is "coming" if delivery is not guaranteed.  
UNKNOWN and N/A are valid final states.

### 0.3 COINGECKO FREE ONLY  
Use `https://api.coingecko.com/api/v3` ONLY.  
NO API keys. NO CoinGecko Pro. NO demo endpoints.

### 0.4 AI PROVIDER - PRIMARY (LOCKED)  
Gemini **2.5 Flash** is the ONE AND ONLY Gemini model allowed.  
Gemini MUST be called via the **official Gemini API**, server-side only.  
NO Gemini Pro. NO Gemini 1.5. NO Gemini 2.0. NO preview/experimental variants.

### 0.5 MANDATORY GOLD SPOT RULE  
During **EVERY** snapshot execution, Gemini 2.5 Flash MUST use **Google Search Grounding** to retrieve the **CURRENT Spot Gold Price (USD per troy ounce)**.  
This value is the **authoritative** gold price for the entire snapshot lifecycle.  

**Implementation note (approved):** when using the official `@google/generative-ai` SDK, Google Search Grounding MUST be wired using the supported tool configuration (commonly `tools: [{ googleSearch: {} }]`). This is an SDK wiring detail only.

**AMENDMENT 0.5-A - FALLBACK SPOT SOURCE (APPROVED)**  
If Gemini grounding fails to return a valid spot price, the server may use a **single fallback** JSON source:  
`https://data-asg.goldprice.org/dbXRates/USD`  
Fallback is **only** allowed when Gemini returns null/invalid spot price. Gemini remains primary.

### 0.6 SECRETS  
`GEMINI_API_KEY` is required and server-side only.  
Keys must never reach the browser.  
Local development uses `.env.local`.

### 0.7 OPENROUTER - FALLBACK ONLY (LOCKED)  
OpenRouter is used **ONLY** if Gemini 2.5 Flash fails.  
OpenRouter MUST NOT use any Gemini model.  
Allowed FREE models, in order:
1. `xiaomi/mimo-v2-flash:free`  
2. `meta-llama/llama-3.3-70b-instruct:free`  
If both fail => intelligence resolves to **N/A / UNKNOWN**.

### 0.8 READ-ONLY UI  
No manual refresh. No user-triggered fetching.  
Client only consumes `/api/snapshot`.

### 0.9 GLOBAL SNAPSHOT  
All users see the same snapshot within a refresh window.

### 0.10 SERVER-SIDE ONLY EXTERNAL CALLS  
Browser may ONLY call `/api/snapshot`.

### 0.11 QUALITY BAR  
Strict TypeScript. Deterministic logic. No NaN/undefined leaks.  
Stable layout. No UI deception.

---

## 1. APP PURPOSE

### 1.1 PURPOSE  
A read-only market intelligence dashboard for the **Top-10 Tokenized Gold** assets.

### 1.2 NON-PURPOSE  
NOT a trading app.  
NOT real-time tick data.  
NOT an execution platform.

---

## 2. DATA SOURCES

### 2.1 TOKEN MARKETS  
CoinGecko tokenized-gold category.

### 2.2 PRICE CHARTS  
CoinGecko 7-day `market_chart` endpoint.

### 2.3 GOLD SPOT PRICE  
Gemini 2.5 Flash with Google Search Grounding.  
Fallback (only if Gemini spot is null/invalid): `https://data-asg.goldprice.org/dbXRates/USD`.

---

## 3. TECH STACK

- Framework: Next.js (App Router)  
- Language: TypeScript (strict)  
- UI: Tailwind CSS, Recharts  
- Runtime: Node.js 20 LTS, Vercel

---

## 4. GLOBAL SNAPSHOT & CACHING MODEL

### 4.1 SINGLE ENDPOINT  
All data is served from `/api/snapshot`.

### 4.2 CACHE HEADERS  
- **Weekdays:** `public, s-maxage=300, stale-while-revalidate=60`  
- **Weekends:** `public, s-maxage=900, stale-while-revalidate=120`

### 4.3 WARMUP  
Optional Vercel Cron may warm the snapshot on the same cadence.

---

## 5. EXTERNAL API CALL BUDGET (PER SNAPSHOT)

- **CoinGecko:** 1 markets call; 10 chart calls; concurrency capped at **2-3**  
- **Gemini:** 1 batched call per snapshot  
- **OpenRouter:** Only if Gemini fails

---

## 6. FILE STRUCTURE (LOCKED)

/app/layout.tsx
/app/page.tsx
/app/api/snapshot/route.ts

/lib/coingecko.ts
/lib/gemini.ts
/lib/openrouter.ts
/lib/compute.ts
/lib/normalize.ts
/lib/retry.ts
/lib/schedule.ts

/components // UI only, no fetching
/public // branding assets
/.env.local // secrets only


---

## 7. SNAPSHOT EXECUTION ORDER (LOCKED)

1. Determine cadence and cache headers  
2. Fetch Top-10 markets (CoinGecko)  
3. Fetch 7-day charts (concurrency capped)  
4. Normalize all data  
5. Compute prompt-only metrics (non-peg) for Gemini context  
6. Execute **ONE** Gemini 2.5 Flash call that:
   - Uses Google Search Grounding to fetch Spot Gold Price (USD/oz)
   - Generates Market Intelligence for all 10 tokens  
7. Pass spot gold price into `computeMetrics`  
8. Compute all derived metrics  
9. If Gemini fails => OpenRouter fallback  
10. If OpenRouter fails => deterministic rule-based fallback  
11. Assemble `SnapshotResponse`  
12. Return JSON

Metric computation MUST NOT occur before spot gold price is resolved, except for the prompt-only non-peg metrics used to enrich the Gemini request.

---

## 8. DERIVED METRICS (LOCKED)

### 8.1 PEG DEVIATION  
`((tokenPrice - spotGoldUsd) / spotGoldUsd) x 100`

### 8.2 PEG STABILITY  
- <= 0.20% => **TIGHT**  
- <= 0.75% => **NORMAL**  
- > 0.75% => **STRESSED**

### 8.3 MISSING SPOT PRICE  
If spot gold is unavailable => **Peg Stability = UNKNOWN**

**AMENDMENT (APPROVED):** If `spotGoldUsd` is null/invalid, **ALL peg-derived status fields MUST resolve to UNKNOWN** (never NORMAL).

---

## 9. UI RULES (LOCKED)

- UI shell renders immediately  
- Data populates when available  
- Missing data => N/A or UNKNOWN  
- Gold Spot Price displayed in the header, right-aligned opposite logo/app name

---

## 10. ERROR SEMANTICS

- Errors surfaced honestly  
- No silent substitution  
- No fake certainty

**AMENDMENT 10.1-A - LOCAL DIAGNOSTICS (APPROVED)**  
If spot price resolution fails, the server may append a diagnostic line to `spot-price-debug.log` at the repo root (local/dev visibility only). This log is best-effort and must not block the response.

---

## 11. ENVIRONMENT CONTRACT

- Required: `GEMINI_API_KEY`  
- Optional: `OPENROUTER_API_KEY` (fallback only)

---

## 12. OUT OF SCOPE

- Trading  
- User accounts  
- Databases  
- Persistence  
- Background jobs  
- Additional APIs  
- Scraping  
- Client-side AI calls

---

## 13. DERIVED METRICS FORMULAS (UPDATED)

The Spot Gold Price MUST be dynamically retrieved via Gemini 2.5 Flash with Google Search Grounding.  
Hardcoded or static gold prices are forbidden.

Peg Deviation formula remains as defined in 8.1.  
All other derived metrics remain deterministic and unchanged.

---

## 14. OUT OF SCOPE (CLARIFIED)

- External gold price APIs (e.g., GoldAPI, Metals-API, Nasdaq feeds), except the approved fallback in 0.5-A  
- Client-side gold price fetching  
- Cached or manually updated gold constants  
- User-configurable spot prices

**Rationale:** Gemini 2.5 Flash with Google Search Grounding is the sole authoritative gold price source.

---

## END OF AUTHORITATIVE BLUEPRINT

