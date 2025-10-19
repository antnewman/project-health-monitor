/**
 * KPI Card Component
 * Displays a key performance indicator with optional trend
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  loading?: boolean;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200'
};

const getTrendIcon = (direction?: 'up' | 'down' | 'stable') => {
  if (direction === 'up') return <TrendingUp className="w-4 h-4" />;
  if (direction === 'down') return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

const getTrendColor = (direction?: 'up' | 'down' | 'stable') => {
  if (direction === 'up') return 'text-green-600';
  if (direction === 'down') return 'text-red-600';
  return 'text-gray-500';
};

/**
 * KPI Card Component
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  icon,
  color = 'blue',
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      <div className="flex items-center justify-between text-sm">
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 ${getTrendColor(trendDirection)}`}>
            {getTrendIcon(trendDirection)}
            <span className="font-medium">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
