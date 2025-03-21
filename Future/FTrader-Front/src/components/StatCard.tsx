
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changePercent?: string;
  isPositive?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changePercent, 
  isPositive = true,
  delay = 0
}) => {
  const animationDelay = {
    animationDelay: `${delay}ms`
  };

  return (
    <div 
      className="neumorph-card animate-fade-in opacity-0"
      style={animationDelay}
    >
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      
      {(change || changePercent) && (
        <div className="mt-2 flex items-center gap-1.5">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-profit" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-loss" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-profit' : 'text-loss'}`}>
            {change} {changePercent && <span className="text-xs">({changePercent})</span>}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
