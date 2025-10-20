/**
 * Planner Dashboard View
 * Personal forecast scorecard, accuracy trends, peer comparison
 */

import type { Task, ManagerMetrics } from '@/types';
import { KPICard } from '@/components/common/KPICard';
import { Badge } from '@/components/common/Badge';
import { ForecastAccuracyChart } from '@/components/charts/ForecastAccuracyChart';
import { Target, TrendingUp, Users, Award, AlertCircle, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { calculateManagerMetrics, calculatePortfolioMetrics } from '@/lib/calculations';
import { generateManagerInsights, isClaudeConfigured, getErrorMessage } from '@/lib/claudeAPI';
import { useMemo, useState, useEffect } from 'react';

interface PlannerViewProps {
  tasks: Task[];
}

/**
 * Planner View Component
 */
export const PlannerView: React.FC<PlannerViewProps> = ({ tasks }) => {
  const managerMetrics: ManagerMetrics[] = useMemo(() => calculateManagerMetrics(tasks), [tasks]);
  const portfolioMetrics = useMemo(() => calculatePortfolioMetrics(tasks), [tasks]);
  const [selectedManager, setSelectedManager] = useState<string>(
    managerMetrics.length > 0 ? managerMetrics[0].manager : ''
  );

  // AI Insights state
  const [managerInsights, setManagerInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string>('');

  const currentManagerMetrics = managerMetrics.find(m => m.manager === selectedManager);
  const managerTasks = tasks.filter(t => t.functionalManager === selectedManager);

  // Reset insights when manager changes
  useEffect(() => {
    setManagerInsights('');
    setInsightsError('');
  }, [selectedManager]);

  // Calculate percentile rank
  const percentileRank = useMemo(() => {
    if (!currentManagerMetrics) return 0;
    const sorted = [...managerMetrics].sort((a, b) => b.performanceScore - a.performanceScore);
    const rank = sorted.findIndex(m => m.manager === selectedManager) + 1;
    return ((managerMetrics.length - rank + 1) / managerMetrics.length) * 100;
  }, [managerMetrics, selectedManager]);

  // Prepare trend data (simulated by project)
  const accuracyTrend = useMemo(() => {
    const projects = [...new Set(managerTasks.map(t => t.projectName))];
    return projects.map(project => {
      const projectTasks = managerTasks.filter(t => t.projectName === project);
      const completed = projectTasks.filter(t => t.status === 'Completed');
      const onTime = completed.filter(
        t => t.plannedEnd && t.actualEnd && new Date(t.actualEnd) <= new Date(t.plannedEnd)
      );
      return {
        name: project.substring(0, 20),
        accuracy: completed.length > 0 ? (onTime.length / completed.length) * 100 : 0,
        target: 70
      };
    });
  }, [managerTasks]);

  // Upcoming tasks
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

    return managerTasks
      .filter(t =>
        t.status !== 'Completed' &&
        t.plannedStart &&
        new Date(t.plannedStart) >= today &&
        new Date(t.plannedStart) <= twoWeeksLater
      )
      .sort((a, b) => {
        if (!a.plannedStart || !b.plannedStart) return 0;
        return new Date(a.plannedStart).getTime() - new Date(b.plannedStart).getTime();
      });
  }, [managerTasks]);

  // Planning anti-patterns for this manager
  const antiPatterns = useMemo(() => {
    const patterns: Array<{type: string; description: string; severity: 'high' | 'medium' | 'low'}> = [];

    if (currentManagerMetrics) {
      if (currentManagerMetrics.avgDurationVariance > 20) {
        patterns.push({
          type: 'Chronic Optimism',
          description: `Average ${currentManagerMetrics.avgDurationVariance.toFixed(0)}% over planned duration. Tasks consistently take longer than estimated.`,
          severity: 'high'
        });
      }

      if (currentManagerMetrics.genericResourcePct > 70) {
        patterns.push({
          type: 'Generic Resource Overuse',
          description: `${currentManagerMetrics.genericResourcePct.toFixed(0)}% of tasks use generic resources. Assign named resources earlier.`,
          severity: 'high'
        });
      }

      const avgReassessments = managerTasks.reduce((sum, t) => sum + t.totalReassessments, 0) / managerTasks.length;
      if (avgReassessments > 3) {
        patterns.push({
          type: 'Plan Instability',
          description: `Average ${avgReassessments.toFixed(1)} reassessments per task. Plans are frequently changing.`,
          severity: 'medium'
        });
      }

      const ignoredDepsCount = managerTasks.filter(t => t.ignoredDependencies).length;
      if (ignoredDepsCount > 0) {
        patterns.push({
          type: 'Dependency Neglect',
          description: `${ignoredDepsCount} task(s) have ignored dependencies. Review and respect task dependencies.`,
          severity: 'medium'
        });
      }
    }

    return patterns;
  }, [currentManagerMetrics, managerTasks]);

  // Load AI insights for the selected manager
  const loadManagerInsights = async () => {
    if (!currentManagerMetrics) return;

    if (!isClaudeConfigured()) {
      setInsightsError('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      return;
    }

    setIsLoadingInsights(true);
    setInsightsError('');

    try {
      const insights = await generateManagerInsights(
        currentManagerMetrics,
        portfolioMetrics.avgForecastAccuracy
      );
      setManagerInsights(insights);
    } catch (error) {
      console.error('Failed to load manager insights:', error);
      setInsightsError(getErrorMessage(error));
    } finally {
      setIsLoadingInsights(false);
    }
  };

  if (!currentManagerMetrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No planner data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-3">Planning Performance Dashboard</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Planner/Manager:</label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="bg-white text-gray-900 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {managerMetrics.map(m => (
              <option key={m.manager} value={m.manager}>
                {m.manager}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Personal Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Performance Score"
          value={currentManagerMetrics.performanceScore}
          subtitle={`Top ${(100 - percentileRank).toFixed(0)}%`}
          icon={<Award className="w-5 h-5" />}
          color={currentManagerMetrics.performanceScore >= 80 ? 'green' : currentManagerMetrics.performanceScore >= 60 ? 'amber' : 'red'}
        />
        <KPICard
          title="Forecast Accuracy"
          value={`${currentManagerMetrics.forecastAccuracy.toFixed(1)}%`}
          subtitle={`${currentManagerMetrics.onTimeEndCount}/${currentManagerMetrics.completedTasks} on time`}
          icon={<Target className="w-5 h-5" />}
          color={currentManagerMetrics.forecastAccuracy >= 70 ? 'green' : currentManagerMetrics.forecastAccuracy >= 50 ? 'amber' : 'red'}
        />
        <KPICard
          title="Total Tasks"
          value={currentManagerMetrics.totalTasks}
          subtitle={`${currentManagerMetrics.completedTasks} completed`}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Duration Variance"
          value={`${currentManagerMetrics.avgDurationVariance > 0 ? '+' : ''}${currentManagerMetrics.avgDurationVariance.toFixed(1)}%`}
          subtitle="Avg variance from plan"
          icon={<TrendingUp className="w-5 h-5" />}
          color={Math.abs(currentManagerMetrics.avgDurationVariance) <= 10 ? 'green' : Math.abs(currentManagerMetrics.avgDurationVariance) <= 20 ? 'amber' : 'red'}
        />
      </div>

      {/* Performance Alert */}
      {currentManagerMetrics.performanceScore < 60 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Performance Below Target</h3>
              <p className="text-sm text-amber-800 mb-2">
                Your planning performance score is below the 60% threshold. Review the recommendations below to improve.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentManagerMetrics.performanceScore >= 80 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Excellent Performance!</h3>
              <p className="text-sm text-green-800">
                You're in the top {(100 - percentileRank).toFixed(0)}% of planners. Keep up the great work!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Personalized Coaching */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Personalized Coaching</h3>
              <p className="text-sm text-gray-600">AI-powered feedback for {selectedManager}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-medium">
              Powered by Claude
            </span>
            {!managerInsights && !isLoadingInsights && (
              <button
                onClick={loadManagerInsights}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Get Coaching
              </button>
            )}
            {managerInsights && !isLoadingInsights && (
              <button
                onClick={loadManagerInsights}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>
        </div>

        {isLoadingInsights && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-indigo-300">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
            <p className="text-gray-700 font-medium">Analyzing your performance with AI...</p>
            <p className="text-sm text-gray-500 mt-1">This may take 10-15 seconds</p>
          </div>
        )}

        {insightsError && !isLoadingInsights && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium mb-1">Unable to Generate Coaching</p>
                <p className="text-red-700 text-sm">{insightsError}</p>
                {!isClaudeConfigured() && (
                  <p className="text-red-600 text-xs mt-2">
                    Add your Claude API key to .env file: VITE_CLAUDE_API_KEY=sk-ant-your-key
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {managerInsights && !isLoadingInsights && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Your Performance Analysis</h4>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {managerInsights.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
              <Sparkles className="w-3 h-3" />
              <span>AI-generated coaching based on your performance metrics</span>
            </div>
          </div>
        )}

        {!managerInsights && !isLoadingInsights && !insightsError && (
          <div className="bg-white rounded-lg p-8 border-2 border-dashed border-indigo-300 text-center">
            <Sparkles className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">Get Personalized Coaching</p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Receive AI-powered feedback on your strengths, areas for improvement, and actionable
              suggestions tailored to your performance metrics.
            </p>
          </div>
        )}
      </div>

      {/* Accuracy Trend */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Forecast Accuracy by Project</h2>
        <ForecastAccuracyChart data={accuracyTrend} showTarget={true} height={300} />
      </div>

      {/* Peer Comparison */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Peer Comparison</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Your Rank</p>
              <p className="text-2xl font-bold text-gray-900">
                #{managerMetrics.findIndex(m => m.manager === selectedManager) + 1}
              </p>
              <p className="text-xs text-gray-500">out of {managerMetrics.length} planners</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentile</p>
              <p className="text-2xl font-bold text-blue-600">{percentileRank.toFixed(0)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Top Performer</p>
              <p className="font-semibold text-gray-900">{managerMetrics[0].manager}</p>
              <p className="text-sm text-green-600">Score: {managerMetrics[0].performanceScore}</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {(managerMetrics.reduce((sum, m) => sum + m.performanceScore, 0) / managerMetrics.length).toFixed(0)}
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Your Score</p>
              <p className="text-2xl font-bold text-purple-600">{currentManagerMetrics.performanceScore}</p>
              <p className={`text-sm ${currentManagerMetrics.performanceScore >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                {currentManagerMetrics.performanceScore >= 70 ? 'Above Average' : 'Below Average'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Planning Anti-Patterns */}
      {antiPatterns.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Areas for Improvement</h2>
          <div className="space-y-3">
            {antiPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className={`flex gap-3 p-3 border rounded-lg ${
                  pattern.severity === 'high' ? 'bg-red-50 border-red-200' :
                  pattern.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  pattern.severity === 'high' ? 'text-red-600' :
                  pattern.severity === 'medium' ? 'text-amber-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <p className={`font-semibold mb-1 ${
                    pattern.severity === 'high' ? 'text-red-900' :
                    pattern.severity === 'medium' ? 'text-amber-900' :
                    'text-blue-900'
                  }`}>
                    {pattern.type}
                  </p>
                  <p className={`text-sm ${
                    pattern.severity === 'high' ? 'text-red-800' :
                    pattern.severity === 'medium' ? 'text-amber-800' :
                    'text-blue-800'
                  }`}>
                    {pattern.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks Nudges */}
      {upcomingTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Tasks (Next 2 Weeks)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Review these tasks to ensure realistic planning and proper resource assignment
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned Start</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alerts</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingTasks.slice(0, 10).map(task => {
                  const alerts: string[] = [];
                  const isGeneric = /resource_|generic|tbd|unassigned|placeholder/i.test(task.assignedResource);
                  if (isGeneric) alerts.push('Generic Resource');
                  if (task.ignoredDependencies) alerts.push('Ignored Dependencies');
                  if (task.criticalPathRisk) alerts.push('Critical Path');

                  return (
                    <tr key={task.taskId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <div>{task.taskName}</div>
                        <div className="text-xs text-gray-500">{task.projectName}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {task.plannedStart ? new Date(task.plannedStart).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{task.plannedDuration}d</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={isGeneric ? 'text-amber-600 font-medium' : 'text-gray-600'}>
                          {task.assignedResource || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {alerts.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {alerts.map((alert, idx) => (
                              <Badge key={idx} variant="warning" size="sm">{alert}</Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="success" size="sm">Ready</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
        <div className="space-y-3">
          {currentManagerMetrics.forecastAccuracy < 70 && (
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Improve Forecast Accuracy</p>
                <p className="text-sm text-blue-800">
                  Review historical data before estimating. Add 20-30% buffer to initial estimates based on past performance.
                </p>
              </div>
            </div>
          )}

          {currentManagerMetrics.genericResourcePct > 50 && (
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Reduce Generic Resource Usage</p>
                <p className="text-sm text-blue-800">
                  Assign named resources at least 4 weeks before task start. Work with resource managers for early allocation.
                </p>
              </div>
            </div>
          )}

          {currentManagerMetrics.avgDurationVariance > 15 && (
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Better Duration Estimates</p>
                <p className="text-sm text-blue-800">
                  Tasks are averaging {currentManagerMetrics.avgDurationVariance.toFixed(0)}% over estimate. Use planning poker and historical data for more realistic estimates.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Continue Best Practices</p>
              <p className="text-sm text-green-800">
                Learn from top performers: {managerMetrics[0].manager} (Score: {managerMetrics[0].performanceScore})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerView;
