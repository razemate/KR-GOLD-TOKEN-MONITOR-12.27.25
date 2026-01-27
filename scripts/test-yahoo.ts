
import yahooFinance from 'yahoo-finance2';

async function testYahoo() {
  try {
    console.log("Type of export:", typeof yahooFinance);
    // @ts-ignore
    const yf = new yahooFinance();
    console.log("Instantiated!");
    const quote = await yf.quote('GC=F');
    console.log("Quote:", quote.regularMarketPrice);
  } catch (e) {
    console.error("Error:", e);
  }
}

testYahoo();
