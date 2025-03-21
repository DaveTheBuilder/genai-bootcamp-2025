
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: string;
}

interface TradeActivityCardProps {
  trades: Trade[];
}

const TradeActivityCard: React.FC<TradeActivityCardProps> = ({ trades }) => {
  return (
    <div className="neumorph-container animate-fade-in opacity-0 animate-stagger-3">
      <div className="neumorph-header">
        <h3 className="text-lg font-semibold tracking-tight">Recent Trade Activity</h3>
        <Link to="/trades" className="neumorph-link">
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-hidden">
        <table className="neumorph-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Side</th>
              <th className="text-right">Price</th>
              <th className="text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td className="font-medium">{trade.symbol}</td>
                <td>
                  <span className={`neumorph-badge ${
                    trade.side === 'buy' 
                      ? 'neumorph-badge-buy' 
                      : 'neumorph-badge-sell'
                  }`}>
                    {trade.side.toUpperCase()}
                  </span>
                </td>
                <td className="text-right">${trade.price.toLocaleString()}</td>
                <td className="text-right">{trade.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeActivityCard;
