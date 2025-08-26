"use client";
import { memo } from "react";
import { EarningsData } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Earnings_CardProps {
  data: EarningsData;
}

const Earnings_Card = memo(({ data }: Earnings_CardProps) => {
  const chartData = [
    { month: 'Ene', value: 1500 },
    { month: 'Feb', value: 1800 },
    { month: 'Mar', value: 2200 },
    { month: 'Abr', value: 1900 },
    { month: 'May', value: 2800 },
    { month: 'Jun', value: 2400 },
    { month: 'Jul', value: 3200 },
    { month: 'Ago', value: 3800 },
    { month: 'Sep', value: 4200 },
    { month: 'Oct', value: 4800 },
    { month: 'Nov', value: 5200 },
    { month: 'Dic', value: 5800 }
  ];

  const totalEarnings = chartData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1.5">
          <p className="text-xs font-medium text-gray-600">{`${label}`}</p>
          <p className="text-xs font-bold text-gray-800">{`$${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="dashboard-card bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-teal-400"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-semibold text-white">
            Tus ganancias
          </h3>
          <p className="text-xs sm:text-sm text-white">
            Últimos 12 meses
          </p>
          <p className="text-lg sm:text-xl font-bold text-white">
            ${totalEarnings.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="h-32 sm:h-40 lg:h-48 bg-teal-600/10 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.6}/>
                <stop offset="50%" stopColor="#14B8A6" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#0F766E" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="transparent" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              hide={true}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax + 1000']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="natural" 
              dataKey="value" 
              stroke="#FFFFFF" 
              strokeWidth={2.5}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{ r: 1.5, stroke: '#5EEAD4', strokeWidth: 0.5, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-xs sm:text-sm text-white mt-1">
        {chartData.map((point, index) => (
          <span key={index} className="font-medium">{point.month}</span>
        ))}
      </div>
    </div>
  );
});

Earnings_Card.displayName = 'Earnings_Card';

export default Earnings_Card; 