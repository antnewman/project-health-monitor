/**
 * Project Manager Dashboard View
 * Project health, at-risk work packages, timeline, and interventions
 */

import type { Task, ProjectMetrics } from '@/types';
import { KPICard } from '@/components/common/KPICard';
import { Badge } from '@/components/common/Badge';
import { RAGDistribution } from '@/components/charts/RAGDistribution';
import { ForecastAccuracyChart } from '@/components/charts/ForecastAccuracyChart';
import { Target, AlertTriangle, TrendingUp, Package, Sparkles, Loader2 } from 'lucide-react';
import { calculateProjectMetrics } from '@/lib/calculations';
import { generateProjectRecommendations, isClaudeConfigured, getErrorMessage } from '@/lib/claudeAPI';
import { useMemo, useState, useEffect } from 'react';

interface ProjectManagerViewProps {
  tasks: Task[];
}

/**
 * Project Manager View Component
 */
export const ProjectManagerView: React.FC<ProjectManagerViewProps> = ({ tasks }) => {
  const projectMetrics: ProjectMetrics[] = useMemo(() => calculateProjectMetrics(tasks), [tasks]);
  const [selectedProject, setSelectedProject] = useState<string | null>(
    projectMetrics.length > 0 ? projectMetrics[0].projectName : null
  );

  // AI Insights state
  const [projectRecommendations, setProjectRecommendations] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string>('');

  const currentProject = projectMetrics.find(p => p.projectName === selectedProject);
  const projectTasks = tasks.filter(t => t.projectName === selectedProject);

  // Reset insights when project changes
  useEffect(() => {
    setProjectRecommendations('');
    setInsightsError('');
  }, [selectedProject]);

  // Calculate metrics for selected project
  const atRiskTasks = projectTasks.filter(
    t => t.projectHealthRAG === 'Red' || t.criticalPathRisk || t.ignoredDependencies
  );

  const criticalPathTasks = projectTasks.filter(t => t.criticalPathRisk);
  const overBudgetTasks = projectTasks.filter(t => t.totalSpent > t.plannedBudget * 1.1);

  // Prepare chart data
  const accuracyByManager = useMemo(() => {
    const managers = [...new Set(projectTasks.map(t => t.functionalManager))];
    return managers.map(manager => {
      const managerTasks = projectTasks.filter(t => t.functionalManager === manager);
      const completed = managerTasks.filter(t => t.status === 'Completed');
      const onTime = completed.filter(
        t => t.plannedEnd && t.actualEnd && new Date(t.actualEnd) <= new Date(t.plannedEnd)
      );
      return {
        name: manager,
        accuracy: completed.length > 0 ? (onTime.length / completed.length) * 100 : 0,
        target: 70
      };
    });
  }, [projectTasks]);

  // Load AI insights for the selected project
  const loadProjectInsights = async () => {
    if (!currentProject) return;

    if (!isClaudeConfigured()) {
      setInsightsError('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      return;
    }

    setIsLoadingInsights(true);
    setInsightsError('');

    try {
      const recommendations = await generateProjectRecommendations(currentProject, projectTasks);
      setProjectRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load project insights:', error);
      setInsightsError(getErrorMessage(error));
    } finally {
      setIsLoadingInsights(false);
    }
  };

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Project Selector */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-3">Project Health Dashboard</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Select Project:</label>
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white text-gray-900 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {projectMetrics.map(project => (
              <option key={project.projectName} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
          </select>
          <Badge variant={`rag-${currentProject.predictedRAG.toLowerCase()}` as 'rag-red' | 'rag-amber' | 'rag-green'}>
            {currentProject.predictedRAG}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Tasks"
          value={currentProject.totalTasks}
          subtitle={`${currentProject.completedPct.toFixed(0)}% complete`}
          icon={<Package className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Forecast Accuracy"
          value={`${currentProject.forecastAccuracy.toFixed(1)}%`}
          subtitle="Target: 70%"
          icon={<Target className="w-5 h-5" />}
          color={currentProject.forecastAccuracy >= 70 ? 'green' : currentProject.forecastAccuracy >= 50 ? 'amber' : 'red'}
        />
        <KPICard
          title="At-Risk Tasks"
          value={atRiskTasks.length}
          subtitle={`${((atRiskTasks.length / currentProject.totalTasks) * 100).toFixed(1)}% of total`}
          icon={<AlertTriangle className="w-5 h-5" />}
          color={atRiskTasks.length === 0 ? 'green' : atRiskTasks.length <= 5 ? 'amber' : 'red'}
        />
        <KPICard
          title="Critical Path Tasks"
          value={criticalPathTasks.length}
          subtitle={`${currentProject.criticalPathTasksPct.toFixed(1)}% of project`}
          icon={<TrendingUp className="w-5 h-5" />}
          color={currentProject.criticalPathTasksPct <= 25 ? 'green' : currentProject.criticalPathTasksPct <= 35 ? 'amber' : 'red'}
        />
      </div>

      {/* Intervention Alert */}
      {currentProject.predictedRAG === 'Red' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Immediate Intervention Required</h3>
              <p className="text-sm text-red-800 mb-2">This project is predicted to be RED status based on current metrics.</p>
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Recommended Actions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {currentProject.topRisks.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Project Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI-Powered Project Insights</h3>
              <p className="text-sm text-gray-600">Strategic recommendations for {selectedProject}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
              Powered by Claude
            </span>
            {!projectRecommendations && !isLoadingInsights && (
              <button
                onClick={loadProjectInsights}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Get Recommendations
              </button>
            )}
            {projectRecommendations && !isLoadingInsights && (
              <button
                onClick={loadProjectInsights}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>
        </div>

        {isLoadingInsights && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-blue-300">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
            <p className="text-gray-700 font-medium">Analyzing project risks with AI...</p>
            <p className="text-sm text-gray-500 mt-1">This may take 10-15 seconds</p>
          </div>
        )}

        {insightsError && !isLoadingInsights && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium mb-1">Unable to Generate Recommendations</p>
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

        {projectRecommendations && !isLoadingInsights && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Strategic Interventions</h4>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {projectRecommendations.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
              <Sparkles className="w-3 h-3" />
              <span>AI-generated recommendations based on project metrics and risk factors</span>
            </div>
          </div>
        )}

        {!projectRecommendations && !isLoadingInsights && !insightsError && (
          <div className="bg-white rounded-lg p-8 border-2 border-dashed border-blue-300 text-center">
            <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">Get AI-Powered Recommendations</p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Receive specific, actionable interventions you can implement this week to improve
              project outcomes and mitigate risks.
            </p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager Forecast Accuracy */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Forecast Accuracy by Manager</h2>
          <ForecastAccuracyChart data={accuracyByManager} showTarget={true} height={300} />
        </div>

        {/* RAG Distribution */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task RAG Status</h2>
          <RAGDistribution
            data={{
              Red: projectTasks.filter(t => t.projectHealthRAG === 'Red').length,
              Amber: projectTasks.filter(t => t.projectHealthRAG === 'Amber').length,
              Green: projectTasks.filter(t => t.projectHealthRAG === 'Green').length
            }}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* At-Risk Work Packages */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">At-Risk Tasks Requiring Attention</h2>
        {atRiskTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No at-risk tasks identified</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RAG</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Factors</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {atRiskTasks.slice(0, 10).map(task => {
                  const risks: string[] = [];
                  if (task.projectHealthRAG === 'Red') risks.push('Red RAG');
                  if (task.criticalPathRisk) risks.push('Critical Path');
                  if (task.ignoredDependencies) risks.push('Ignored Dependencies');
                  if (task.totalSpent > task.plannedBudget * 1.1) risks.push('Over Budget');
                  if (task.criticalPathVolatility > 5) risks.push('High Volatility');

                  return (
                    <tr key={task.taskId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <div>{task.taskName}</div>
                        <div className="text-xs text-gray-500">{task.workPackageName}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{task.functionalManager}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={`rag-${task.projectHealthRAG.toLowerCase()}` as 'rag-red' | 'rag-amber' | 'rag-green'} size="sm">
                          {task.projectHealthRAG}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {risks.map((risk, idx) => (
                            <Badge key={idx} variant="danger" size="sm">{risk}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical Path Analysis */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Critical Path Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Critical Path Tasks</p>
            <p className="text-2xl font-bold text-blue-600">{criticalPathTasks.length}</p>
            <p className="text-xs text-gray-500">{currentProject.criticalPathTasksPct.toFixed(1)}% of project</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">High Volatility</p>
            <p className="text-2xl font-bold text-amber-600">
              {criticalPathTasks.filter(t => t.criticalPathVolatility > 5).length}
            </p>
            <p className="text-xs text-gray-500">Tasks with volatility &gt;5</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Over Budget Tasks</p>
            <p className="text-2xl font-bold text-red-600">{overBudgetTasks.length}</p>
            <p className="text-xs text-gray-500">&gt;10% over planned budget</p>
          </div>
        </div>

        {criticalPathTasks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volatility</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reassessments</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {criticalPathTasks.slice(0, 10).map(task => (
                  <tr key={task.taskId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.taskName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{task.functionalManager}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-medium ${
                        task.criticalPathVolatility > 5 ? 'text-red-600' :
                        task.criticalPathVolatility > 3 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {task.criticalPathVolatility.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{task.totalReassessments}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'default'} size="sm">
                        {task.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Risks */}
      {currentProject.topRisks.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Project Risks</h2>
          <div className="space-y-3">
            {currentProject.topRisks.map((risk, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerView;
