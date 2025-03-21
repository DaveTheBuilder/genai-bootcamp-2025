import axios from 'axios';
import igAuthService from './igAuthService';

// Define types for IG API responses
export interface Market {
  epic: string;
  instrumentName: string;
  instrumentType: string;
  expiry: string;
  high: number;
  low: number;
  percentageChange: number;
  netChange: number;
  bid: number;
  offer: number;
  updateTime: string;
  delayTime: number;
  streamingPricesAvailable: boolean;
  marketStatus: string;
  scalingFactor: number;
}

export interface MarketDetails {
  instrument: {
    name: string;
    type: string;
    epic: string;
    expiry: string;
    lotSize: number;
    currency: string;
    marginFactor: number;
    marketId: string;
  };
  dealingRules: {
    minDealSize: number;
    maxDealSize: number;
    minControlledRiskStopDistance: number;
    minNormalStopOrLimitDistance: number;
    maxStopOrLimitDistance: number;
    controlledRiskSpacing: number;
    marketOrderPreference: string;
  };
  snapshot: {
    bid: number;
    offer: number;
    high: number;
    low: number;
    percentageChange: number;
    netChange: number;
    updateTime: string;
    marketStatus: string;
    scalingFactor: number;
  };
}

export interface PriceHistory {
  prices: {
    snapshotTime: string;
    openPrice: {
      bid: number;
      ask: number;
      lastTraded: number;
    };
    closePrice: {
      bid: number;
      ask: number;
      lastTraded: number;
    };
    highPrice: {
      bid: number;
      ask: number;
      lastTraded: number;
    };
    lowPrice: {
      bid: number;
      ask: number;
      lastTraded: number;
    };
    lastTradedVolume: number;
  }[];
  instrumentType: string;
  metadata: {
    pageData: {
      pageSize: number;
      pageNumber: number;
      totalPages: number;
    };
  };
}

class IGMarketService {
  private baseUrl: string = 'https://demo-api.ig.com/gateway/deal';
  private apiKey: string = '55fbe8c5d57b0e642ddf6b4b34cc5414dc55c952'; // Replace with your actual API key

  // Get headers for API requests
  private getHeaders() {
    const authData = igAuthService.getAuthData();
    if (!authData) {
      throw new Error('Not authenticated');
    }

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-IG-API-KEY': this.apiKey,
      'CST': authData.cst,
      'X-SECURITY-TOKEN': authData.xSecurityToken,
    };
  }

  // Search for markets
  async searchMarkets(searchTerm: string): Promise<Market[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets?searchTerm=${encodeURIComponent(searchTerm)}`, {
        headers: {
          ...this.getHeaders(),
          'Version': '1',
        },
      });

      return response.data.markets;
    } catch (error) {
      console.error('Failed to search markets:', error);
      throw error;
    }
  }

  // Get market details
  async getMarketDetails(epic: string): Promise<MarketDetails> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/${encodeURIComponent(epic)}`, {
        headers: {
          ...this.getHeaders(),
          'Version': '3',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get market details for ${epic}:`, error);
      throw error;
    }
  }

  // Get price history
  async getPriceHistory(
    epic: string,
    resolution: string = 'MINUTE',
    from: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    to: string = new Date().toISOString(),
    max: number = 1000
  ): Promise<PriceHistory> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/prices/${encodeURIComponent(epic)}?resolution=${resolution}&from=${from}&to=${to}&max=${max}`,
        {
          headers: {
            ...this.getHeaders(),
            'Version': '3',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to get price history for ${epic}:`, error);
      throw error;
    }
  }

  // Get watchlists
  async getWatchlists(): Promise<{ id: string; name: string; editable: boolean; deleteable: boolean; defaultSystemWatchlist: boolean }[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/watchlists`, {
        headers: {
          ...this.getHeaders(),
          'Version': '1',
        },
      });

      return response.data.watchlists;
    } catch (error) {
      console.error('Failed to get watchlists:', error);
      throw error;
    }
  }

  // Get watchlist markets
  async getWatchlistMarkets(watchlistId: string): Promise<Market[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/watchlists/${watchlistId}`, {
        headers: {
          ...this.getHeaders(),
          'Version': '1',
        },
      });

      return response.data.markets;
    } catch (error) {
      console.error(`Failed to get markets for watchlist ${watchlistId}:`, error);
      throw error;
    }
  }

  // Get popular markets
  async getPopularMarkets(): Promise<Market[]> {
    try {
      // This is a workaround as there's no direct "popular markets" endpoint
      // We'll use a predefined watchlist that typically contains popular markets
      const watchlists = await this.getWatchlists();
      const popularWatchlist = watchlists.find(w => w.name.toLowerCase().includes('popular'));
      
      if (popularWatchlist) {
        return this.getWatchlistMarkets(popularWatchlist.id);
      }
      
      // Fallback to the first available watchlist
      if (watchlists.length > 0) {
        return this.getWatchlistMarkets(watchlists[0].id);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get popular markets:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const igMarketService = new IGMarketService();
export default igMarketService;
