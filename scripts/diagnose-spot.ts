
import { getFallbackGoldSpotPrice, fetchYahooGoldPrice, scrapeGoldPriceOrg } from '../lib/gemini';
import yahooFinance from 'yahoo-finance2';
import * as cheerio from 'cheerio';

async function runDiagnostics() {
  console.log("Diagnosing Spot Price Sources...");

  // 1. Yahoo Finance
  console.log("\n--- Yahoo Finance ---");
  const symbols = ['GC=F', 'XAU=X', 'XAUUSD=X', 'GC=X']; // Test likely symbols
  for (const symbol of symbols) {
      try {
        // @ts-ignore
        const yf = new yahooFinance({ suppressNotices: ['yahooSurvey'] });
        const quote = await yf.quote(symbol);
        console.log(`[${symbol}] Price: ${quote.regularMarketPrice}, Currency: ${quote.currency}`);
      } catch (e) {
        console.log(`[${symbol}] Failed: ${e.message}`);
      }
  }

  // 2. Test GoldPrice.org API
  console.log("\n--- Testing GoldPrice.org API ---");
  try {
    const response = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (response.ok) {
      const data = await response.json();
      console.log("GoldPrice API Result:", data?.items?.[0]?.xauPrice);
    } else {
      console.error("GoldPrice API HTTP Error:", response.status);
    }
  } catch (e) {
    console.error("GoldPrice API Failed:", e);
  }

  // 3. Test Scraper
  console.log("\n--- Testing GoldPrice.org Scraper ---");
  try {
    const scrape = await scrapeGoldPriceOrg();
    console.log("Scrape Result:", scrape);
  } catch (e) {
    console.error("Scrape Failed:", e);
  }

  // 4. Test Combined Fallback
  console.log("\n--- Testing Combined Fallback ---");
  try {
    const fallback = await getFallbackGoldSpotPrice();
    console.log("Combined Fallback Result:", fallback);
  } catch (e) {
    console.error("Combined Fallback Failed:", e);
  }
}

runDiagnostics();
