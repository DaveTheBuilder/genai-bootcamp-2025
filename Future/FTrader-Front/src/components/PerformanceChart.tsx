
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    equity: number;
  }>;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="neumorph-container animate-fade-in opacity-0 animate-stagger-1">
      <div className="p-5 border-b border-border/30">
        <h3 className="text-lg font-semibold tracking-tight">Portfolio Performance</h3>
      </div>
      <div className="p-5">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border)/30)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={{ stroke: 'hsl(var(--border)/30)' }}
                axisLine={{ stroke: 'hsl(var(--border)/30)' }}
                dy={10}
                tickMargin={8}
                minTickGap={30}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={{ stroke: 'hsl(var(--border)/30)' }}
                axisLine={{ stroke: 'hsl(var(--border)/30)' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--neumorph-bg))',
                  borderColor: 'hsl(var(--border)/20)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEquity)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
