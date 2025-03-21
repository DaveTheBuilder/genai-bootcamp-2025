# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/05e10069-fced-4982-98cd-a513858211f0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/05e10069-fced-4982-98cd-a513858211f0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## FTrader Application Overview

FTrader is a sophisticated trading platform designed for professional traders, providing advanced market analysis tools, real-time data streaming, and comprehensive trading capabilities.

### Key Features

#### Market Data
- Real-time market data streaming via IG API
- Support for multiple asset classes (stocks, forex, commodities, indices)
- Custom watchlists and market monitoring
- Robust error handling with offline mode fallback

#### Basic Analysis Tools
- Technical Indicators with customizable parameters
- Backtesting for strategy validation
- Multi-Timeframe Analysis for comprehensive market views
- Statistical Arbitrage for pair trading opportunities
- Machine Learning models for price prediction

#### Advanced Analysis Tools
All advanced analysis components have been fully implemented and integrated:

1. **Pattern Recognition**
   - AI-powered detection of chart patterns with confidence scoring
   - Pattern visualization and trading recommendations

2. **Strategy Builder**
   - Drag-and-drop interface for building custom trading strategies
   - Component library with indicators and rules

3. **Correlation Matrix**
   - Visual heatmap showing correlations between different assets
   - Pairs trading suggestions and diversification recommendations

4. **Risk Analytics**
   - Value at Risk (VaR) calculations with multiple methodologies
   - Stress testing scenarios and position risk analysis
   - Advanced risk visualization and reporting

5. **Market Regime Detection**
   - Multi-factor regime identification (trend, volatility, liquidity)
   - Strategy recommendations based on current market regime
   - Historical regime analysis and transition probabilities

6. **Order Flow Analysis**
   - Market depth visualization with bid/ask imbalances
   - Volume profile analysis and institutional activity tracking
   - Advanced order flow indicators and footprint charts

7. **Sentiment Analysis**
   - News and social media sentiment integration
   - Entity recognition for asset mentions
   - Sentiment visualization and trading signals

8. **Portfolio Optimization**
   - Efficient frontier calculation and visualization
   - Optimal portfolio allocation based on risk/return preferences
   - Scenario analysis and rebalancing tools

### Technical Implementation

- Frontend: React, TypeScript, Tailwind CSS, shadcn-ui
- Data Streaming: IG API with Lightstreamer client
- State Management: React Context API and custom hooks
- Visualization: Custom chart components with responsive design

### Current Status

All planned advanced analysis components have been implemented with mock data integration. The next phase of development will focus on connecting these components to live market data through the IG API, enhancing the user experience with saved configurations, and optimizing performance for real-time analysis.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/05e10069-fced-4982-98cd-a513858211f0) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
