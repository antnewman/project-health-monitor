/**
 * Forecast Accuracy Trend Chart
 * Line chart showing forecast accuracy over time or by manager
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  accuracy: number;
  target?: number;
}

interface ForecastAccuracyChartProps {
  data: DataPoint[];
  showTarget?: boolean;
  height?: number;
}

/**
 * Custom tooltip for the chart
 */
const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Forecast Accuracy Chart Component
 */
export const ForecastAccuracyChart: React.FC<ForecastAccuracyChartProps> = ({
  data,
  showTarget = true,
  height = 300
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
          label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Forecast Accuracy"
        />
        {showTarget && (
          <Line
            type="monotone"
            dataKey="target"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target (70%)"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ForecastAccuracyChart;
