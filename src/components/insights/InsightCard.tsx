/**
 * Insight Card Component
 * Displays a single insight with priority indicator
 */

import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight } from 'lucide-react';
import type { Insight } from '@/types';

interface InsightCardProps {
  insight: Insight;
  onClick?: () => void;
}

const getTypeConfig = (type: Insight['type']) => {
  switch (type) {
    case 'danger':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-900'
      };
    case 'warning':
      return {
        icon: AlertCircle,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        iconColor: 'text-amber-600',
        titleColor: 'text-amber-900'
      };
    case 'success':
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-900'
      };
    default:
      return {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-900'
      };
  }
};

const getPriorityBadge = (priority: Insight['priority']) => {
  const classes = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${classes[priority]}`}>
      {priority.toUpperCase()}
    </span>
  );
};

/**
 * Insight Card Component
 */
export const InsightCard: React.FC<InsightCardProps> = ({ insight, onClick }) => {
  const config = getTypeConfig(insight.type);
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-semibold text-sm ${config.titleColor}`}>
              {insight.title}
            </h3>
            {getPriorityBadge(insight.priority)}
          </div>

          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>

          <div className="bg-white bg-opacity-50 rounded p-2 mb-2">
            <p className="text-xs font-medium text-gray-600 mb-1">Recommendation:</p>
            <p className="text-xs text-gray-700">{insight.recommendation}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Affected: <span className="font-medium">{insight.affectedEntity}</span>
            </span>
            {onClick && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
