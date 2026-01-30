'use client';

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface ProgressCircleProps {
  progress: number;
}

export function ProgressCircle({ progress }: ProgressCircleProps) {
  if (progress === 0) return null;

  const data = [{ name: 'progress', value: progress }];
  
  return (
    <div className="relative h-12 w-12">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="90%"
          barSize={6}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius="50%"
            className="fill-primary"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white" style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}>
          {`${Math.round(progress)}%`}
        </span>
      </div>
    </div>
  );
}
