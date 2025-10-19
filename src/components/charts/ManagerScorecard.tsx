/**
 * Manager Scorecard Chart
 * Horizontal bar chart comparing manager performance scores
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ManagerData {
  manager: string;
  score: number;
  forecastAccuracy: number;
}

interface ManagerScorecardProps {
  data: ManagerData[];
  height?: number;
  maxManagers?: number;
}

/**
 * Custom tooltip for manager scorecard
 */
const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ value: number; payload: ManagerData }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-800">{data.manager}</p>
        <p className="text-sm text-blue-600">Performance Score: {data.score.toFixed(1)}</p>
        <p className="text-sm text-green-600">Forecast Accuracy: {data.forecastAccuracy.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

/**
 * Gets color based on performance score
 */
const getBarColor = (score: number): string => {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 60) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};

/**
 * Manager Scorecard Component
 */
export const ManagerScorecard: React.FC<ManagerScorecardProps> = ({
  data,
  height = 400,
  maxManagers = 10
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No manager data available</p>
      </div>
    );
  }

  // Limit to top N managers and sort by score
  const displayData = [...data]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxManagers);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          label={{ value: 'Performance Score', position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          type="category"
          dataKey="manager"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="score" name="Performance Score" radius={[0, 4, 4, 0]}>
          {displayData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ManagerScorecard;
