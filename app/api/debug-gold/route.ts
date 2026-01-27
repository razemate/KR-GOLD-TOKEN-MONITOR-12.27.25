import { NextResponse } from 'next/server';
import { fetchYahooGoldPrice, scrapeGoldPriceOrg } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET() {
  const report: any = {
    timestamp: new Date().toISOString(),
    env: {
      GEMINI_KEY_EXISTS: !!process.env.GEMINI_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    },
    results: {}
  };

  // 1. Yahoo Finance Test
  try {
    const start = Date.now();
    const yahoo = await fetchYahooGoldPrice();
    report.results.yahoo = {
      success: yahoo !== null,
      price: yahoo,
      duration: `${Date.now() - start}ms`
    };
  } catch (e) {
    report.results.yahoo = { success: false, error: e instanceof Error ? e.message : String(e) };
  }

  // 2. GoldPrice.org API Test
  try {
    const start = Date.now();
    const response = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
        cache: "no-store",
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const data = response.ok ? await response.json() : null;
    report.results.goldPriceApi = {
      success: response.ok && !!data?.items?.[0]?.xauPrice,
      status: response.status,
      price: data?.items?.[0]?.xauPrice,
      duration: `${Date.now() - start}ms`
    };
  } catch (e) {
    report.results.goldPriceApi = { success: false, error: e instanceof Error ? e.message : String(e) };
  }

  // 3. Scraper Test
  try {
    const start = Date.now();
    const scrape = await scrapeGoldPriceOrg();
    report.results.scraper = {
      success: scrape !== null,
      price: scrape,
      duration: `${Date.now() - start}ms`
    };
  } catch (e) {
    report.results.scraper = { success: false, error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(report, { status: 200 });
}
