
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface PerformanceChartProps {
  title: string;
  data: Array<any>;
  dataKey: string;
  stroke?: string;
  fill?: string;
  gradient?: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
  data,
  dataKey,
  stroke = "#10b981",
  fill = "#10b98133",
  gradient = true,
}) => {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {gradient ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
                <stop offset="95%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis 
              dataKey="name" 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderColor: '#ddd',
                color: '#333'
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              fillOpacity={1}
              fill={`url(#color-${dataKey})`}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis 
              dataKey="name" 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderColor: '#ddd',
                color: '#333'
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
