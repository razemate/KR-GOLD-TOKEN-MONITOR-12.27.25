I have performed a deep review of the codebase against `KR_GOLD_TOKEN_BLUEPRINT.md`.

### Findings
1.  **Project Structure:** The codebase contains legacy folders (`src/components/gold`, `src/components/right-panel`, `src/components/charts`) that are not part of the blueprint and are superseded by the new compliant components (`TokensTable`, `TokenDetail`, `TokenChart`).
2.  **API Key Logic:** The current API routes (`/api/tokens` and `/api/tokens/[id]/chart`) strictly enforce `COINGECKO_API_KEY`, causing 500 errors if missing. The blueprint lists this key as **Optional**.
3.  **Data Compliance:** The core logic in `page.tsx`, `useGoldData.ts`, and `normalize.ts` is compliant with the blueprint (10 tokens, 7-day chart, correct data models).
4.  **UI Compliance:** The new components match the "Institutional" design and functional requirements.

### Execution Plan

#### 1. Cleanup Legacy Code
Delete the following folders and files that violate the blueprint's "Project Structure" or are unused:
- `src/components/gold/` (Legacy components)
- `src/components/right-panel/` (Legacy components)
- `src/components/charts/` (Legacy components)
- `src/app/api/gold-intel/` (Non-compliant placeholder endpoint)

#### 2. Relax API Key Enforcement
Modify `src/app/api/tokens/route.ts` and `src/app/api/tokens/[id]/chart/route.ts` to:
- Make `COINGECKO_API_KEY` optional.
- Only attach the `x-cg-demo-api-key` header if the key is present in environment variables.
- This ensures the app runs on the free tier (without a key) as requested.

#### 3. Final Verification
- Confirm the app builds and runs without the deleted files.
- Verify the "Institutional Grade" dashboard loads with the correct data.
