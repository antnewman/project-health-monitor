/**
 * RAG Distribution Chart
 * Pie and bar chart showing Red/Amber/Green distribution
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface RAGData {
  Red: number;
  Amber: number;
  Green: number;
}

interface RAGDistributionProps {
  data: RAGData;
  type?: 'pie' | 'bar';
  height?: number;
}

const RAG_COLORS = {
  Red: '#ef4444',
  Amber: '#f59e0b',
  Green: '#10b981'
};

/**
 * Custom label for pie chart
 */
const renderCustomLabel = (props: unknown) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props as {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  };

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show label if less than 5%

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * Custom tooltip
 */
const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { name: string; value: number; percentage: string } }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold" style={{ color: RAG_COLORS[data.name as keyof typeof RAG_COLORS] }}>
          {data.name}
        </p>
        <p className="text-sm text-gray-700">Count: {data.value}</p>
        {data.payload.percentage && (
          <p className="text-sm text-gray-700">{data.payload.percentage}</p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * RAG Distribution Component
 */
export const RAGDistribution: React.FC<RAGDistributionProps> = ({
  data,
  type = 'pie',
  height = 300
}) => {
  const total = data.Red + data.Amber + data.Green;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No RAG data available</p>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Red',
      value: data.Red,
      percentage: `${((data.Red / total) * 100).toFixed(1)}%`
    },
    {
      name: 'Amber',
      value: data.Amber,
      percentage: `${((data.Amber / total) * 100).toFixed(1)}%`
    },
    {
      name: 'Green',
      value: data.Green,
      percentage: `${((data.Green / total) * 100).toFixed(1)}%`
    }
  ].filter(item => item.value > 0);

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={RAG_COLORS[entry.name as keyof typeof RAG_COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={height / 3}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={RAG_COLORS[entry.name as keyof typeof RAG_COLORS]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value: string) => {
            const item = chartData.find(d => d.name === value);
            return item ? `${value} (${item.percentage})` : value;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RAGDistribution;
