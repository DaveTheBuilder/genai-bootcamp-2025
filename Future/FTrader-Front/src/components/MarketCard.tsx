import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

interface MarketItem {
  symbol: string;
  displayName?: string;
  price: number;
  change: string;
  changeDirection: 'up' | 'down';
}

interface MarketCardProps {
  marketData: MarketItem[];
}

const MarketCard: React.FC<MarketCardProps> = ({ marketData }) => {
  return (
    <div className="neumorph-container animate-fade-in opacity-0 animate-stagger-2">
      <div className="neumorph-header">
        <h3 className="text-lg font-semibold tracking-tight">Market Watchlist</h3>
        <Link to="/market" className="neumorph-link">
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-hidden">
        <table className="neumorph-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Price</th>
              <th className="text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr key={item.symbol}>
                <td className="font-medium">{item.displayName || item.symbol}</td>
                <td className="text-right">${item.price.toLocaleString()}</td>
                <td className="text-right">
                  <span className={`inline-flex items-center gap-1 ${
                    item.changeDirection === 'up' 
                      ? 'text-profit' 
                      : 'text-loss'
                  }`}>
                    {item.changeDirection === 'up' ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )}
                    {item.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketCard;
