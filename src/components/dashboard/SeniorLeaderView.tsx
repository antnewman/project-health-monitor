/**
 * Senior Leader Dashboard View
 * Portfolio-level KPIs, manager performance, and systemic issues
 */

import type { Task, PortfolioMetrics, BehaviouralPattern, Insight } from '@/types';
import { KPICard } from '@/components/common/KPICard';
import { ManagerScorecard } from '@/components/charts/ManagerScorecard';
import { RAGDistribution } from '@/components/charts/RAGDistribution';
import { AIRecommendations } from '@/components/insights/AIRecommendations';
import { InsightCard } from '@/components/insights/InsightCard';
import { Target, Users, TrendingUp, AlertTriangle, BarChart3, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import {
  calculatePortfolioMetrics,
  detectBehaviouralPatterns,
  generateInsights
} from '@/lib/calculations';
import {
  generateExecutiveSummary,
  identifyBehavioralPatterns,
  isClaudeConfigured,
  getErrorMessage
} from '@/lib/claudeAPI';
import { useMemo, useState } from 'react';

interface SeniorLeaderViewProps {
  tasks: Task[];
}

/**
 * Senior Leader View Component
 */
export const SeniorLeaderView: React.FC<SeniorLeaderViewProps> = ({ tasks }) => {
  const portfolioMetrics: PortfolioMetrics = useMemo(() => calculatePortfolioMetrics(tasks), [tasks]);
  const patterns: BehaviouralPattern[] = useMemo(
    () => detectBehaviouralPatterns(tasks, portfolioMetrics.managerMetrics),
    [tasks, portfolioMetrics]
  );
  const insights: Insight[] = useMemo(
    () => generateInsights(tasks, portfolioMetrics),
    [tasks, portfolioMetrics]
  );

  // AI Insights state
  const [executiveSummary, setExecutiveSummary] = useState<string>('');
  const [behavioralInsights, setBehavioralInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string>('');

  // Prepare data for charts
  const managerChartData = portfolioMetrics.managerMetrics.map(m => ({
    manager: m.manager,
    score: m.performanceScore,
    forecastAccuracy: m.forecastAccuracy
  }));

  // Calculate RAG health score
  const totalRAG = portfolioMetrics.ragDistribution.Red +
                   portfolioMetrics.ragDistribution.Amber +
                   portfolioMetrics.ragDistribution.Green;
  const ragHealthScore = totalRAG > 0
    ? Math.round(
        ((portfolioMetrics.ragDistribution.Green * 100) +
          (portfolioMetrics.ragDistribution.Amber * 50)) /
        totalRAG
      )
    : 0;

  // Load AI insights
  const loadAIInsights = async () => {
    if (!isClaudeConfigured()) {
      setInsightsError('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      return;
    }

    setIsLoadingInsights(true);
    setInsightsError('');

    try {
      const [summary, patternsAnalysis] = await Promise.all([
        generateExecutiveSummary(portfolioMetrics, tasks),
        identifyBehavioralPatterns(portfolioMetrics, tasks)
      ]);

      setExecutiveSummary(summary);
      setBehavioralInsights(patternsAnalysis);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
      setInsightsError(getErrorMessage(error));
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Portfolio Health Overview</h1>
        <p className="text-blue-100">
          Executive dashboard for portfolio-wide performance and planning behaviours
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"
          value={portfolioMetrics.totalProjects}
          subtitle={`${portfolioMetrics.totalTasks} total tasks`}
          icon={<Briefcase className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Portfolio Forecast Accuracy"
          value={`${portfolioMetrics.avgForecastAccuracy.toFixed(1)}%`}
          subtitle="Target: 70%"
          icon={<Target className="w-5 h-5" />}
          color={portfolioMetrics.avgForecastAccuracy >= 70 ? 'green' : portfolioMetrics.avgForecastAccuracy >= 50 ? 'amber' : 'red'}
          trend={portfolioMetrics.avgForecastAccuracy - 70}
          trendDirection={portfolioMetrics.avgForecastAccuracy >= 70 ? 'up' : 'down'}
        />
        <KPICard
          title="Generic Resource Usage"
          value={`${portfolioMetrics.genericResourcePct.toFixed(1)}%`}
          subtitle="Target: <30%"
          icon={<Users className="w-5 h-5" />}
          color={portfolioMetrics.genericResourcePct <= 30 ? 'green' : portfolioMetrics.genericResourcePct <= 50 ? 'amber' : 'red'}
          trend={30 - portfolioMetrics.genericResourcePct}
          trendDirection={portfolioMetrics.genericResourcePct <= 30 ? 'up' : 'down'}
        />
        <KPICard
          title="RAG Health Score"
          value={`${ragHealthScore}%`}
          subtitle={`${portfolioMetrics.ragDistribution.Red} Red, ${portfolioMetrics.ragDistribution.Amber} Amber, ${portfolioMetrics.ragDistribution.Green} Green`}
          icon={<TrendingUp className="w-5 h-5" />}
          color={ragHealthScore >= 70 ? 'green' : ragHealthScore >= 50 ? 'amber' : 'red'}
        />
      </div>

      {/* Critical Insights */}
      {insights.filter(i => i.priority === 'high').length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Critical Issues Detected</h3>
              <p className="text-sm text-red-800">
                {insights.filter(i => i.priority === 'high').length} high-priority issue(s) require immediate attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI-Powered Executive Insights</h3>
              <p className="text-sm text-gray-600">Deep analysis powered by Claude AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full font-medium">
              Powered by Claude
            </span>
            {!executiveSummary && !isLoadingInsights && (
              <button
                onClick={loadAIInsights}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Generate Insights
              </button>
            )}
            {executiveSummary && !isLoadingInsights && (
              <button
                onClick={loadAIInsights}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Regenerate
              </button>
            )}
          </div>
        </div>

        {isLoadingInsights && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-purple-300">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-3" />
            <p className="text-gray-700 font-medium">Analyzing portfolio patterns with AI...</p>
            <p className="text-sm text-gray-500 mt-1">This may take 10-15 seconds</p>
          </div>
        )}

        {insightsError && !isLoadingInsights && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium mb-1">Unable to Generate Insights</p>
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

        {executiveSummary && !isLoadingInsights && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-white rounded-lg p-5 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-1 bg-purple-600 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 text-lg">Executive Summary</h4>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {executiveSummary.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Behavioral Patterns Analysis */}
            <div className="bg-white rounded-lg p-5 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-1 bg-purple-600 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 text-lg">Organizational Behavioral Patterns</h4>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {behavioralInsights.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
              <Sparkles className="w-3 h-3" />
              <span>AI-generated insights based on current portfolio data</span>
            </div>
          </div>
        )}

        {!executiveSummary && !isLoadingInsights && !insightsError && (
          <div className="bg-white rounded-lg p-8 border-2 border-dashed border-purple-300 text-center">
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">Get AI-Powered Executive Insights</p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Click "Generate Insights" to receive a comprehensive executive summary and behavioral pattern analysis
              powered by Claude AI. Analysis typically takes 10-15 seconds.
            </p>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager Performance League Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Manager Performance</h2>
          </div>
          <ManagerScorecard data={managerChartData} height={400} maxManagers={10} />
          <div className="mt-4 text-xs text-gray-600">
            <p>Performance score based on forecast accuracy, duration variance, resource planning, and RAG status</p>
          </div>
        </div>

        {/* RAG Distribution */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">RAG Status Distribution</h2>
          <RAGDistribution data={portfolioMetrics.ragDistribution} type="pie" height={400} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-red-50 rounded">
              <p className="font-bold text-red-600">{portfolioMetrics.ragDistribution.Red}</p>
              <p className="text-xs text-gray-600">Red</p>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded">
              <p className="font-bold text-amber-600">{portfolioMetrics.ragDistribution.Amber}</p>
              <p className="text-xs text-gray-600">Amber</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="font-bold text-green-600">{portfolioMetrics.ragDistribution.Green}</p>
              <p className="text-xs text-gray-600">Green</p>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioural Patterns - AI Analysis */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Systemic Behavioural Issues</h2>
        <AIRecommendations patterns={patterns} />
      </div>

      {/* Portfolio Insights */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 6).map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
        {insights.length === 0 && (
          <p className="text-gray-500 text-center py-8">No insights available</p>
        )}
      </div>

      {/* Manager Details Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Manager Metrics</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast Acc.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generic %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critical Path</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolioMetrics.managerMetrics.map(manager => (
              <tr key={manager.manager} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{manager.manager}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{manager.totalTasks}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-medium ${
                    manager.forecastAccuracy >= 70 ? 'text-green-600' :
                    manager.forecastAccuracy >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {manager.forecastAccuracy.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-medium ${
                    manager.genericResourcePct <= 30 ? 'text-green-600' :
                    manager.genericResourcePct <= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {manager.genericResourcePct.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{manager.criticalPathTasks}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    manager.performanceScore >= 80 ? 'bg-green-100 text-green-800' :
                    manager.performanceScore >= 60 ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {manager.performanceScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeniorLeaderView;
