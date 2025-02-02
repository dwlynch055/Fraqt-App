import React, { useState, useEffect, useRef } from 'react';
import { LineChart } from 'lucide-react';

const gradientStops = [
  { offset: '0%', color: 'rgb(59, 130, 246)', opacity: 0.2 },
  { offset: '50%', color: 'rgb(59, 130, 246)', opacity: 0.1 },
  { offset: '100%', color: 'rgb(59, 130, 246)', opacity: 0 }
];

const mockData = [
  { day: 'Mon', scans: 450 },
  { day: 'Tue', scans: 680 },
  { day: 'Wed', scans: 520 },
  { day: 'Thu', scans: 750 },
  { day: 'Fri', scans: 890 },
  { day: 'Sat', scans: 680 },
  { day: 'Sun', scans: 420 },
];

export function EngagementChart() {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const maxScans = Math.max(...mockData.map(d => d.scans));
  const minScans = Math.min(...mockData.map(d => d.scans));
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getY = (value: number) => {
    const height = 200;
    const padding = 40;
    const availableHeight = height - padding * 2;
    return padding + (1 - (value - minScans) / (maxScans - minScans)) * availableHeight;
  };

  const getX = (index: number) => {
    const width = 100;
    const totalWidth = svgRef.current?.clientWidth || 700;
    return (index * (totalWidth - width)) / (mockData.length - 1) + width / 2;
  };

  const points = mockData.map((d, i) => ({
    x: getX(i),
    y: getY(d.scans),
    ...d,
  }));

  const pathD = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = points[i - 1];
    const controlX = (prev.x + point.x) / 2;
    return `${path} C ${controlX},${prev.y} ${controlX},${point.y} ${point.x},${point.y}`;
  }, '');

  return (
    <div className="rounded-lg p-4 sm:p-6 overflow-hidden bg-black border border-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-base font-semibold text-white">Weekly Engagement</h2>
          <p className="text-[13px] text-gray-400 mt-1">Pass usage analytics</p>
        </div>
        <LineChart className="w-5 h-5 text-gray-400" />
      </div>

      <div className="relative w-full h-[275px] overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full overflow-visible"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.1))',
          }}
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1="80"
              y1={getY(minScans + ((maxScans - minScans) * i) / 4)}
              x2="100%"
              y2={getY(minScans + ((maxScans - minScans) * i) / 4)}
              stroke="#1f2937"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Y-axis labels */}
          {Array.from({ length: 5 }).map((_, i) => (
            <text
              key={i}
              x="60"
              y={getY(minScans + ((maxScans - minScans) * i) / 4)}
              className="text-[11px] fill-gray-400"
              dominantBaseline="middle"
              textAnchor="end"
            >
              {Math.round(minScans + ((maxScans - minScans) * i) / 4).toLocaleString()}
            </text>
          ))}

          {/* Line path with gradient */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              {gradientStops.map(({ offset, color, opacity }) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={color}
                  stopOpacity={opacity}
                />
              ))}
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={`${pathD} L ${points[points.length - 1].x},${getY(minScans)} L ${points[0].x},${getY(minScans)} Z`}
            fill="url(#areaGradient)"
            className={`transition-all duration-1000 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))"
            className={`transition-all duration-1000 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              strokeDasharray: isAnimating ? '0 2000' : '2000 2000',
            }}
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g
              key={i}
              className="transition-transform cursor-pointer"
              onMouseEnter={() => setSelectedPoint(i)}
              onMouseLeave={() => setSelectedPoint(null)}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r={selectedPoint === i ? 7 : 5}
                className={`fill-white stroke-blue-500 stroke-2 transition-all duration-200 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {selectedPoint === i && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  className="fill-blue-500 opacity-20"
                />
              )}
              
              {/* X-axis labels */}
              <text
                x={point.x}
                y="260"
                className="text-[11px] fill-gray-400"
                textAnchor="middle"
              >
                {point.day}
              </text>

              {/* Tooltip */}
              {selectedPoint === i && (
                <g>
                  <rect
                    x={point.x - 40}
                    y={point.y - 40}
                    width="80"
                    height="32"
                    rx="6"
                    className="fill-gray-900 stroke-gray-700"
                    filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                  />
                  <text
                    x={point.x}
                    y={point.y - 20}
                    textAnchor="middle"
                    className="text-[11px] font-medium fill-white"
                  >
                    {point.scans.toLocaleString()}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}