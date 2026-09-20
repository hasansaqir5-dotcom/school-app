'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TrendPoint = {
  month: string;
  score: number;
};

type TrendProps = {
  trend: TrendPoint[];
};

export default function Trend({ trend }: TrendProps) {
  return (
    <div className="mt-6 rounded-2xl bg-white p-5">
      <p className="font-black">روند تحصیلی (نمودار خط شکسته)</p>
      {trend.length ? (
        <div
          data-testid="trend-chart"
          className="mt-5 h-64 w-full"
          dir="ltr"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trend}
              margin={{ top: 12, right: 14, left: -20, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#dbeafe" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <YAxis
                domain={[1, 4]}
                ticks={[1, 2, 3, 4]}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(2)} از ۴`, 'معدل کل']}
                labelFormatter={(l) => `ماه ${l}`}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0e7490"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0e7490', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          هنوز داده‌ای برای نمودار وجود ندارد.
        </p>
      )}
    </div>
  );
}