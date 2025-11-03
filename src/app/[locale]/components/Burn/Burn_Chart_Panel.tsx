"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const mockChartData = [
  { time: '00:00', value: 1200 },
  { time: '04:00', value: 1350 },
  { time: '08:00', value: 1500 },
  { time: '12:00', value: 1450 },
  { time: '16:00', value: 1300 },
  { time: '20:00', value: 1400 },
  { time: '24:00', value: 1380 },
];

const timeframes = ['24h', '3d', '1w', '2w', '1m'];

export default function Burn_Chart_Panel() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1w');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div>
          <div className="text-white font-semibold text-base sm:text-lg">Tokens Quemados</div>
          <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
            <span className="text-white text-xl sm:text-2xl font-bold">0000</span>
            <span className="text-[#5EEAD4] text-xs sm:text-sm">+0.00%</span>
          </div>
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectedTimeframe === timeframe
                  ? 'bg-white text-teal-900 font-semibold'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockChartData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
            <YAxis
              domain={['dataMin - 200', 'dataMax + 200']}
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              height={20}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#5EEAD4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#5EEAD4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

