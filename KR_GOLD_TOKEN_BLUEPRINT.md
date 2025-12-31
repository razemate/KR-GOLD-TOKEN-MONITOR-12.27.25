# KR GOLD TOKEN MONITOR — FULL AUTHORITATIVE BLUEPRINT (UPDATED)

## 1. APP OVERVIEW
### 1.1 Purpose
1. Monitor and analyze the **Top 10 Tokenized Gold tokens**.
2. Provide a **token intelligence dashboard** combining price data, quantitative metrics, and AI-driven qualitative analysis.
3. Deliver a stable, rebuildable, production-grade app with zero ambiguity in data sources, AI usage, and UI behavior.

### 1.2 Primary Data Authority (NON-NEGOTIABLE)
Primary and sole source for token inclusion and ranking:
https://www.coingecko.com/en/categories/tokenized-gold

Programmatic backend source (FREE TIER ONLY):
GET https://api.coingecko.com/api/v3/coins/markets  
Parameters:
- vs_currency=usd  
- category=tokenized-gold  
- order=market_cap_desc  
- per_page=10  
- page=1  
- sparkline=false  
- price_change_percentage=24h  

This app **never** uses the CoinGecko Pro API.  
No Pro endpoints. No Pro headers. No Pro keys.

### 1.3 AI Provider (NON-NEGOTIABLE)
- **AI Provider:** Google Gemini
- **API Key Source:** Vercel Environment Variables (already configured)
- **No user-entered AI keys**
- **No OpenAI, Claude, or other paid APIs**
- AI usage is limited strictly to the **AI Market Sentinel** container

### 1.4 Core User Flow
1. User opens the app.
2. Sidebar loads Top 10 Tokenized Gold tokens.
3. First token auto-selected.
4. Main panel renders chart + 5 intelligence containers.
5. User selects another token → all right-side panels update.
6. Optional manual refresh revalidates data.

---

## 2. TECH STACK
- Framework: Next.js (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS
- Charts: Recharts
- Deployment: Vercel
- APIs:
  - CoinGecko **FREE** API
  - Google Gemini API (via Vercel env)

---

## 3. DATA ARCHITECTURE
### 3.1 Serverless Proxy (MANDATORY)
All CoinGecko and Gemini calls occur server-side.

#### 3.1.1 Token List Route
Path: /api/tokens  
Method: GET  
Upstream:
https://api.coingecko.com/api/v3/coins/markets  
Purpose:
- Fetch Top 10 Tokenized Gold tokens
- Normalize and validate data
- Apply cache headers

#### 3.1.2 Token Chart Route
Path: /api/tokens/[id]/chart?days=7  
Method: GET  
Upstream:
https://api.coingecko.com/api/v3/coins/{id}/market_chart  
Purpose:
- Fetch 7-day price history
- Normalize timestamps and prices

#### 3.1.3 AI Market Sentinel Route
Path: /api/ai/sentinel  
Method: POST  
Upstream:
- Google Gemini API (via Vercel env key)

Purpose:
- Generate qualitative market explanation
- Accept structured numeric inputs
- Return short narrative + sentiment label

---

## 4. DOMAIN MODELS
### 4.1 Token Model
type Token = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  priceUsd: number;
  change24hPct: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  high24h: number | null;
  low24h: number | null;
};

### 4.2 Chart Point
type ChartPoint = {
  t: number;
  price: number;
};

### 4.3 Validation Rules
1. All numeric validation happens server-side.
2. Invalid or missing numbers → null (never NaN).
3. Client renders null as “—”.
4. Chart renders only if ≥2 points exist.

---

## 5. UI LAYOUT (AUTHORITATIVE)

### 5.1 Overall Structure
Two-column layout:
- **Left Sidebar:** Top 10 tokens
- **Right Main Panel:** Chart + 5 intelligence containers

---

### 5.2 Left Sidebar — Token Selector
Purpose: Asset selection

Contents:
- Top 10 Tokenized Gold tokens
- Token icon + name/symbol
- Optional small price or % change

Behavior:
- First token auto-selected
- Active token highlighted
- Clicking updates entire main panel

---

### 5.3 Right Main Panel

#### 5.3.1 Primary Chart (Top)
- 7-day price line chart
- Updates on token change
- No “NOW” label
- Reserved space (no layout shift)

---

#### 5.3.2 Intelligence Grid (5 Containers)

##### 1. AI Market Sentinel (“The Brain”)
AI REQUIRED: YES (Gemini)

Purpose:
Explain **why** the market is moving.

Inputs:
- Volume
- Volatility
- Trend
- Peg behavior

Outputs:
- Sentiment label (e.g., Bullish Accumulation)
- Short AI-generated explanation

Implementation:
- Gemini prompt constrained to short analytical output
- Deterministic fallback logic allowed if AI unavailable

---

##### 2. Peg Efficiency (“The Accuracy”)
AI REQUIRED: NO

Purpose:
Measure deviation from gold spot price.

Calculation:
((Token Price − Spot Gold Price) / Spot Gold Price) × 100

Display:
- Percentage deviation
- Color-coded status

---

##### 3. Asset Depth (“The Vault”)
AI REQUIRED: NO

Purpose:
Translate digital supply into physical gold.

Calculation:
circulating_supply / 32,150.7 = tonnes of gold

Display:
- Tonnes of gold backing circulation

---

##### 4. Liquidity Health (“The Exit Strategy”)
AI REQUIRED: NO

Purpose:
Measure trading activity and exit feasibility.

Calculation:
(total_volume / market_cap) × 100

Display:
- Turnover %
- Qualitative label (Healthy / Thin / Illiquid)

---

##### 5. Performance & Range (“The Action”)
AI REQUIRED: NO

Purpose:
Show current price position within daily range.

Data:
- low_24h
- high_24h
- current_price

Visual:
- Horizontal progress bar
- Marker indicates current price

---

## 6. PROJECT STRUCTURE
- app/layout.tsx — Root layout
- app/page.tsx — Dashboard
- app/api/tokens/route.ts
- app/api/tokens/[id]/chart/route.ts
- app/api/ai/sentinel/route.ts
- components/SidebarTokenList.tsx
- components/TokenChart.tsx
- components/IntelGrid.tsx
- components/MetricCard.tsx
- components/AIMarketSentinel.tsx
- lib/normalize.ts
- lib/format.ts
- lib/fetcher.ts
- styles/globals.css

---

## 7. CACHING & RATE LIMITS
- CoinGecko FREE tier respected
- Server-side caching only
- No per-user client calls
- Graceful handling of 429 errors

---

## 8. BUILD & DEPLOY
### 8.1 Local
npm install  
npm run dev  
npm run build  
npm run start  

### 8.2 Vercel
- Framework: Next.js
- Environment variables:
  - GEMINI_API_KEY (server-only)
- No CoinGecko Pro key
- No client-exposed secrets

---

## 9. QUALITY GATES
1. Sidebar always shows exactly 10 tokens.
2. Chart always renders 7-day timeline.
3. All 5 intelligence containers update on selection.
4. No NaN, undefined, or empty UI states.
5. Dark mode default.
6. No console errors in production.

---

## 10. FINAL DECLARATION
This document is the **single authoritative blueprint** for the KR Gold Token Monitor. The app uses **CoinGecko FREE API only** for market data and **Google Gemini (via Vercel environment variable)** exclusively for AI analysis. The UI layout, data sources, calculations, and AI scope defined here must not be altered without updating this blueprint.
