# KR Gold Token Monitor

## Overview
KR Gold Token Monitor is a **token intelligence dashboard** focused exclusively on **Tokenized Gold assets**. It tracks, analyzes, and explains the behavior of the **Top 10 Tokenized Gold tokens** using **CoinGecko FREE market data** and **Google Gemini AI** for qualitative analysis. The app is designed to be analyst-grade, deterministic, rebuildable, free-tier compliant, and production-ready on Vercel.

## Core Principles (Non-Negotiable)
- CoinGecko **FREE API only** (no Pro endpoints, no Pro keys, no Pro headers)
- **Google Gemini API only** for AI analysis
- Gemini API key is stored **server-side in Vercel environment variables**
- No user-entered API keys
- No Docker
- No native build tools
- Node.js **20 LTS**
- Single source of truth: `BLUEPRINT.md`

## What This App Does
1. Displays the **Top 10 Tokenized Gold tokens** as defined by CoinGecko’s Tokenized Gold category.
2. Allows the user to select a token from the **left sidebar**.
3. Renders a **7-day price chart** for the selected token.
4. Displays **five intelligence containers** that analyze peg accuracy, liquidity, asset backing, and market behavior.
5. Uses **Gemini AI** to generate a concise qualitative explanation of market conditions.

## UI Layout (High-Level)
- Left Sidebar: Top 10 Tokenized Gold tokens (asset selector)
- Right Main Panel:
  - 7-day price chart (top)
  - Five intelligence containers (grid):
    1. AI Market Sentinel
    2. Peg Efficiency
    3. Asset Depth
    4. Liquidity Health
    5. Performance & Range

## Data Sources
### Market Data
- Provider: CoinGecko
- Tier: **FREE ONLY**
- Endpoint used:
  https://api.coingecko.com/api/v3/coins/markets
- Category:
  tokenized-gold
- The app never uses CoinGecko Pro endpoints or keys.

### AI Analysis
- Provider: Google Gemini
- Scope: AI Market Sentinel container only
- API key: Stored in Vercel environment variables
- Never exposed to the client
- No OpenAI, Claude, or other AI providers are used

## Intelligence Containers
### 1. AI Market Sentinel (The Brain)
- Uses Gemini AI
- Outputs:
  - Sentiment label (e.g., Bullish Accumulation, Bearish Divergence)
  - Short narrative explanation
- Inputs include volume, volatility, trend, and peg behavior
- Deterministic fallback logic may be used if AI is unavailable

### 2. Peg Efficiency (The Accuracy)
- Pure mathematical calculation
- Formula:
  ((Token Price − Spot Gold Price) / Spot Gold Price) × 100
- Displays percentage deviation with color-coded status

### 3. Asset Depth (The Vault)
- Converts digital supply to physical gold
- Formula:
  circulating_supply / 32,150.7 = tonnes of gold
- Displays tonnes of gold backing circulation

### 4. Liquidity Health (The Exit Strategy)
- Measures trading activity
- Formula:
  (total_volume / market_cap) × 100
- Displays turnover percentage with qualitative label

### 5. Performance & Range (The Action)
- Shows where current price sits within daily range
- Uses:
  low_24h, high_24h, current_price
- Visualized as a horizontal progress bar or slider

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS
- Charts: Recharts
- Deployment: Vercel
- Runtime: Node.js 20 LTS

## Environment Variables (Vercel)
Required:
GEMINI_API_KEY=your_gemini_api_key
Not used:
- CoinGecko Pro API key
- Any client-side API secrets

## Local Development
npm install
npm run dev

## Production Build
npm run build
npm run start

## Project Files
- BLUEPRINT.md: Authoritative architecture, logic, and UI specification
- app/: Next.js App Router
- components/: UI components
- lib/: Data normalization, formatting, and utilities

## Guardrails
- Exactly 10 tokens displayed at all times
- Sidebar controls all state changes
- No NaN or undefined UI values
- No layout shifts
- Dark mode by default
- All external API calls are server-side only

## Using With AI Tools
This repository is designed to work with:
- Byterover (`brv`) for long-term project memory
- Qwen CLI for code generation and fixes
All AI tools must read and respect `BLUEPRINT.md` before making changes.

## Final Note
This is not a generic crypto tracker. It is a **gold-focused intelligence system** combining quantitative rigor with AI-assisted interpretation, built to remain **free, stable, and auditable**. Any change to data sources, AI provider, calculations, or UI layout must be reflected in `BLUEPRINT.md` first.
