/**
 * AI Recommendations Component
 * Displays AI-generated recommendations and insights
 */

import { Sparkles, TrendingUp, Users, Target } from 'lucide-react';
import type { BehaviouralPattern } from '@/types';

interface AIRecommendationsProps {
  patterns: BehaviouralPattern[];
  loading?: boolean;
}

const getPatternIcon = (patternType: BehaviouralPattern['patternType']) => {
  switch (patternType) {
    case 'chronic_optimism':
      return TrendingUp;
    case 'generic_resource_overuse':
      return Users;
    case 'critical_path_instability':
      return Target;
    case 'resource_hoarding':
      return Users;
    default:
      return Sparkles;
  }
};

const getPatternTitle = (patternType: BehaviouralPattern['patternType']) => {
  switch (patternType) {
    case 'chronic_optimism':
      return 'Chronic Optimism Detected';
    case 'generic_resource_overuse':
      return 'Generic Resource Overuse';
    case 'critical_path_instability':
      return 'Critical Path Instability';
    case 'resource_hoarding':
      return 'Resource Hoarding';
    default:
      return 'Behavioural Pattern';
  }
};

const getSeverityColor = (severity: BehaviouralPattern['severity']) => {
  switch (severity) {
    case 'high':
      return 'border-red-300 bg-red-50';
    case 'medium':
      return 'border-amber-300 bg-amber-50';
    case 'low':
      return 'border-blue-300 bg-blue-50';
  }
};

/**
 * AI Recommendations Component
 */
export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ patterns, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (patterns.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-3">
          <Sparkles className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="font-semibold text-green-900 mb-2">No Major Issues Detected</h3>
        <p className="text-sm text-green-700">
          The portfolio shows healthy planning behaviours. Continue monitoring for any emerging patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Detected Patterns</h3>
      </div>

      {patterns.map((pattern, index) => {
        const Icon = getPatternIcon(pattern.patternType);

        return (
          <div
            key={index}
            className={`border-l-4 rounded-lg p-4 ${getSeverityColor(pattern.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {getPatternTitle(pattern.patternType)}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      pattern.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : pattern.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {pattern.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{pattern.description}</p>

                <div className="bg-white rounded p-3 mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    AI Recommendation:
                  </p>
                  <p className="text-sm text-gray-700">{pattern.recommendation}</p>
                </div>

                {pattern.affectedManagers.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-600 mr-1">Affected Managers:</span>
                    {pattern.affectedManagers.slice(0, 5).map((manager, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-xs rounded border border-gray-300 text-gray-700"
                      >
                        {manager}
                      </span>
                    ))}
                    {pattern.affectedManagers.length > 5 && (
                      <span className="px-2 py-0.5 text-xs text-gray-600">
                        +{pattern.affectedManagers.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AIRecommendations;
