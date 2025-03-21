
import { create } from 'zustand';

interface MarketState {
  watchlist: string[];
  setWatchlist: (symbols: string[]) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
}

interface PortfolioState {
  holdings: Array<{
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    pnl: string;
    pnlPercentage: string;
  }>;
  setHoldings: (holdings: any[]) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  watchlist: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'BTC-USD', 'ETH-USD'],
  setWatchlist: (symbols) => set({ watchlist: symbols }),
  addToWatchlist: (symbol) => set((state) => ({ 
    watchlist: [...state.watchlist, symbol] 
  })),
  removeFromWatchlist: (symbol) => set((state) => ({ 
    watchlist: state.watchlist.filter(s => s !== symbol) 
  }))
}));

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: [],
  setHoldings: (holdings) => set({ holdings })
}));
