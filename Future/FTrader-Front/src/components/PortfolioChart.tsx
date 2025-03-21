import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define types for portfolio performance data
export interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface PortfolioChartProps {
  data: PerformanceDataPoint[];
  title: string;
  color?: string;
  xField?: string;
  yField?: string;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  data, 
  title, 
  color = "#10b981",
  xField = "date",
  yField = "value"
}) => {
  // Create a chart config for the ChartContainer
  const chartConfig = {
    [yField]: {
      label: title,
      color: color
    }
  };

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xField} 
          tickFormatter={(value) => {
            // Format the date for better display
            const date = new Date(value);
            return `${date.getMonth()+1}/${date.getDate()}`;
          }}
        />
        <YAxis 
          tickFormatter={(value) => {
            // Format currency values
            return `$${value.toLocaleString()}`;
          }}
        />
        <Tooltip 
          formatter={(value) => [`$${Number(value).toLocaleString()}`, title]}
          labelFormatter={(label) => {
            const date = new Date(label);
            return date.toLocaleDateString();
          }}
        />
        <Area 
          type="monotone" 
          dataKey={yField} 
          stroke={color} 
          fill={color}
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default PortfolioChart;
