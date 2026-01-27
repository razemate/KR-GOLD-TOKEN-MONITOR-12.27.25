
import * as cheerio from 'cheerio';

async function debugScraper() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://goldprice.org/spot-gold.html", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Dump some potential candidates
    console.log("Title:", $('title').text());
    
    // Search for price-like strings
    const bodyText = $('body').text();
    // Look for "$2," or "2," followed by digits
    const matches = bodyText.match(/\$2,\d{3}\.\d{2}/g);
    console.log("Regex matches in body:", matches?.slice(0, 5));

    // Check specific IDs
    console.log("#gold_price text:", $('#gold_price').text());
    console.log(".price-card .price text:", $('.price-card .price').first().text());
    
    // Dump IDs containing "price"
    $('*[id*="price"]').each((i, el) => {
      if (i < 5) console.log("ID match:", $(el).attr('id'), $(el).text().trim().substring(0, 20));
    });

  } catch (e) {
    console.error("Scraper Error:", e);
  }
}

debugScraper();
