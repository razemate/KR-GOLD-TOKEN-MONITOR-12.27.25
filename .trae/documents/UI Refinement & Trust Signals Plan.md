
## Phase 1: Performance Optimization
1.  **Create `vercel.json`**: Configure a 10-minute cron schedule to keep the cache warm (`/api/snapshot`).
2.  **Update `lib/gemini.ts`**: Lower the AI request timeout from 30s to 12s to prevent long blocking waits.

## Phase 2: UI Enhancements
3.  **Update `SevenDayChart.tsx`**: Add a visual "Spot Gold" reference line to the chart.
4.  **Update `RedemptionTrustCard.tsx`**: Enhance the card with icons (Shield, Lock, Bank) for better visual hierarchy.
5.  **Update `page.tsx`**: Pass the spot price data to the chart component.

## Phase 3: Verification & Deployment
6.  **Verify**: Run the build locally to ensure no type errors.
7.  **Deploy**: Commit changes to GitHub, which will automatically trigger the Vercel redeployment.
