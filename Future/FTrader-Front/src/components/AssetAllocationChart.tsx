import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Define types for asset allocation data
export interface AssetAllocation {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

interface AssetAllocationChartProps {
  data: AssetAllocation[];
  nameField?: string;
  valueField?: string;
  colorField?: string;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ 
  data,
  nameField = "category",
  valueField = "value",
  colorField = "color"
}) => {
  // Create a chart config for the ChartContainer
  const chartConfig = data.reduce((config, asset) => {
    return {
      ...config,
      [asset[nameField]]: {
        label: asset[nameField],
        color: asset[colorField]
      }
    };
  }, {});

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey={valueField}
          nameKey={nameField}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry[colorField]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
        />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

export default AssetAllocationChart;
