// Test script to verify the CoinGecko API endpoint for tokenized gold
async function testCoinGeckoAPI() {
  try {
    console.log('Testing CoinGecko API for top 10 tokenized gold tokens...');
    
    // The URL we're using in the updated function
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=tokenized-gold&order=market_cap_desc&per_page=10&sparkline=true&price_change_percentage=24h';
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`\nSuccessfully fetched ${data.length} tokens from CoinGecko:`);
    console.log('=========================================');
    
    data.forEach((token, index) => {
      console.log(`${index + 1}. ${token.name} (${token.symbol.toUpperCase()})`);
      console.log(`   Price: $${token.current_price?.toLocaleString()}`);
      console.log(`   Market Cap: $${(token.market_cap / 1e9).toFixed(2)}B`);
      console.log(`   24h Change: ${token.price_change_percentage_24h > 0 ? '+' : ''}${token.price_change_percentage_24h?.toFixed(2)}%`);
      console.log('');
    });
    
    console.log('API call successful! The updated function should return these 10 tokens.');
    
  } catch (error) {
    console.error('Error testing CoinGecko API:', error.message);
  }
}

// Run the test
testCoinGeckoAPI();