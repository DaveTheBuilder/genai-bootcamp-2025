// Fix script to update the igStreamingService.ts file
const fs = require('fs');
const path = require('path');

// Path to the igStreamingService.ts file
const filePath = path.join(__dirname, 'FTrader-Front', 'src', 'services', 'igStreamingService.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Find the generateMockChartUpdate function and replace it
const mockChartUpdateRegex = /const generateMockChartUpdate = \(epic: string, resolution: string\): ChartUpdate => \{[\s\S]*?\};/;

const newMockChartUpdate = `// Track price trends for each epic
const priceTrends = {};

const generateMockChartUpdate = (epic: string, resolution: string): ChartUpdate => {
  // Get or initialize price trend for this epic
  if (!priceTrends[epic]) {
    // Map epics to consistent base prices
    const priceMap = {
      // Stocks/Indices
      'IX.D.FTSE.DAILY.IP': 7850.25,
      'IX.D.DOW.DAILY.IP': 38750.50,
      'IX.D.NASDAQ.DAILY.IP': 16320.75,
      'IX.D.DAX.DAILY.IP': 17980.30,
      'IX.D.SPTRD.DAILY.IP': 5120.80,
      'IX.D.ASX.DAILY.IP': 7680.40,
      
      // Cryptocurrencies
      'CS.D.BITCOIN.TODAY.IP': 68420.50,
      'CS.D.ETHUSD.TODAY.IP': 3850.25,
      'CS.D.RIPPLE.TODAY.IP': 0.52,
      'CS.D.BCHUSD.TODAY.IP': 380.75,
      'CS.D.LTCUSD.TODAY.IP': 85.60,
      'CS.D.DOTUSD.TODAY.IP': 7.85,
      
      // Forex
      'CS.D.EURUSD.TODAY.IP': 1.0825,
      'CS.D.GBPUSD.TODAY.IP': 1.2650,
      'CS.D.USDJPY.TODAY.IP': 151.25,
      'CS.D.AUDUSD.TODAY.IP': 0.6580,
      'CS.D.USDCAD.TODAY.IP': 1.3620,
      'CS.D.USDCHF.TODAY.IP': 0.9050
    };
    
    const basePrice = priceMap[epic] || 100 + Math.random() * 10;
    
    priceTrends[epic] = {
      currentPrice: basePrice,
      direction: Math.random() > 0.5 ? 1 : -1,
      momentum: 0.001 + Math.random() * 0.003, // 0.1% to 0.4% movement
      lastUpdate: Date.now()
    };
  }
  
  const trend = priceTrends[epic];
  const now = Date.now();
  
  // Occasionally change direction (10% chance)
  if (Math.random() < 0.1) {
    trend.direction *= -1;
    trend.momentum = 0.001 + Math.random() * 0.003;
  }
  
  // Calculate price movement based on time elapsed
  const timeFactor = Math.min((now - trend.lastUpdate) / 1000, 5); // Cap at 5 seconds
  const movement = trend.currentPrice * trend.momentum * trend.direction * timeFactor;
  
  // Update the current price
  trend.currentPrice += movement;
  trend.lastUpdate = now;
  
  // Ensure price doesn't go negative
  trend.currentPrice = Math.max(trend.currentPrice, 0.01);
  
  // Calculate high/low based on current price
  const range = trend.currentPrice * 0.005; // 0.5% range
  const highPrice = trend.currentPrice + range;
  const lowPrice = Math.max(trend.currentPrice - range, 0.01);
  
  return {
    epic,
    chartId: \`\${epic}:\${resolution}\`,
    resolution,
    openPrice: parseFloat((trend.currentPrice - movement).toFixed(4)),
    closePrice: parseFloat(trend.currentPrice.toFixed(4)),
    highPrice: parseFloat(highPrice.toFixed(4)),
    lowPrice: parseFloat(lowPrice.toFixed(4)),
    lastTradedVolume: Math.floor(Math.random() * 10000),
    timestamp: new Date().toISOString()
  };
};`;

// Replace the function
content = content.replace(mockChartUpdateRegex, newMockChartUpdate);

// Find the setupMockChartData function and update the interval
const setupMockChartDataRegex = /private setupMockChartData\(epic: string, resolution: string\): void \{[\s\S]*?this\.chartUpdateIntervals\.set\(chartId, interval\);[\s\S]*?\}/;

const newSetupMockChartData = `private setupMockChartData(epic: string, resolution: string): void {
    const chartId = \`\${epic}:\${resolution}\`;
    console.log(\`Setting up mock chart data for \${chartId}\`);
    
    // Only set up the interval if we don't already have one for this chart
    if (!this.chartUpdateIntervals.has(chartId)) {
      // Initial update to populate the chart immediately
      const initialUpdate = generateMockChartUpdate(epic, resolution);
      const callbacks = this.chartUpdateCallbacks.get(chartId) || [];
      callbacks.forEach(cb => cb(initialUpdate));
      
      // Set up interval for regular updates
      const interval = setInterval(() => {
        const mockUpdate = generateMockChartUpdate(epic, resolution);
        const callbacks = this.chartUpdateCallbacks.get(chartId) || [];
        callbacks.forEach(cb => cb(mockUpdate));
      }, IGStreamingService.getIntervalForResolution(resolution));
      
      this.chartUpdateIntervals.set(chartId, interval);
      console.log(\`Mock chart data interval set up for \${chartId}\`);
    } else {
      console.log(\`Mock chart data already set up for \${chartId}\`);
    }
  }`;

// Replace the function
content = content.replace(setupMockChartDataRegex, newSetupMockChartData);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Successfully updated igStreamingService.ts with improved chart data generation');
