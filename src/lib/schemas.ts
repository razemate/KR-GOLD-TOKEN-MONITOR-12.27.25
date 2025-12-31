// lib/schemas.ts
// Validation schemas for API responses

import { z } from 'zod';

// Token schema based on blueprint
export const TokenSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().optional().nullable(),
  priceUsd: z.number().nullable(),
  change24hPct: z.number().nullable(),
  marketCapUsd: z.number().nullable(),
  volume24hUsd: z.number().nullable(),
  circulatingSupply: z.number().nullable(),
  totalSupply: z.number().nullable(),
  lastUpdatedIso: z.string(),
});

// ChartPoint schema based on blueprint
export const ChartPointSchema = z.object({
  t: z.number(), // timestamp
  price: z.number(),
});

// Response schemas
export const TokensResponseSchema = z.object({
  tokens: z.array(TokenSchema),
  goldPrice: z.number().nullable(),
  aggregateCap: z.number(),
  lastUpdated: z.string(),
  analyses: z.record(z.any()).optional(),
});

export const ChartResponseSchema = z.object({
  points: z.array(ChartPointSchema),
  token_id: z.string(),
  days: z.number(),
});

// Type inference
export type Token = z.infer<typeof TokenSchema>;
export type ChartPoint = z.infer<typeof ChartPointSchema>;
export type TokensResponse = z.infer<typeof TokensResponseSchema>;
export type ChartResponse = z.infer<typeof ChartResponseSchema>;

// Validation functions
export function validateToken(data: unknown): Token {
  return TokenSchema.parse(data);
}

export function validateTokensResponse(data: unknown): TokensResponse {
  return TokensResponseSchema.parse(data);
}

export function validateChartPoint(data: unknown): ChartPoint {
  return ChartPointSchema.parse(data);
}

export function validateChartResponse(data: unknown): ChartResponse {
  return ChartResponseSchema.parse(data);
}