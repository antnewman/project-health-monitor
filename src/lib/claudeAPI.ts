/**
 * Claude AI Integration for Project Health Monitor
 * Generates natural language insights and recommendations using Claude AI
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ManagerMetrics, PortfolioMetrics, ProjectMetrics, Task } from '@/types';

// Initialize Claude client
const getAnthropicClient = () => {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_CLAUDE_API_KEY is not configured in environment variables');
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Only for demo/hackathon purposes
  });
};

/**
 * Generate executive summary for senior leaders
 * Provides high-level insights about portfolio health and systemic issues
 */
export async function generateExecutiveSummary(
  portfolioMetrics: PortfolioMetrics,
  tasks: Task[]
): Promise<string> {
  const anthropic = getAnthropicClient();

  // Calculate additional metrics for context
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

  const prompt = `You are an expert project management consultant analyzing portfolio health data for senior leadership.

PORTFOLIO DATA:
- Total Projects: ${portfolioMetrics.totalProjects}
- Total Tasks: ${portfolioMetrics.totalTasks} (${completedTasks} completed, ${inProgressTasks} in progress)
- Average Forecast Accuracy: ${portfolioMetrics.avgForecastAccuracy.toFixed(1)}%
- Generic Resource Usage: ${portfolioMetrics.genericResourcePct.toFixed(1)}%
- Critical Path Tasks: ${portfolioMetrics.criticalPathTasksPct.toFixed(1)}% of portfolio
- RAG Distribution: ${portfolioMetrics.ragDistribution.Red} Red, ${portfolioMetrics.ragDistribution.Amber} Amber, ${portfolioMetrics.ragDistribution.Green} Green

TOP 3 MANAGERS BY FORECAST ACCURACY:
${portfolioMetrics.managerMetrics.slice(0, 3).map((m, i) =>
  `${i + 1}. ${m.manager}: ${m.forecastAccuracy.toFixed(1)}% accuracy (${m.completedTasks} completed tasks)`
).join('\n')}

BOTTOM 3 MANAGERS BY FORECAST ACCURACY:
${portfolioMetrics.managerMetrics.slice(-3).reverse().map((m, i) =>
  `${i + 1}. ${m.manager}: ${m.forecastAccuracy.toFixed(1)}% accuracy (${m.completedTasks} completed tasks)`
).join('\n')}

Generate a concise executive summary (3-4 paragraphs) that:
1. Identifies the top 2-3 most critical systemic issues affecting portfolio delivery
2. Explains what these patterns mean for delivery risk and business outcomes
3. Provides 2-3 specific, actionable strategic recommendations that leadership can implement
4. Uses a professional, authoritative tone suitable for executives

Do not use bullet points. Write in clear, direct prose suitable for C-suite executives. Focus on business impact, not technical details.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

/**
 * Generate personalized insights for a specific manager/planner
 * Provides coaching feedback and improvement suggestions
 */
export async function generateManagerInsights(
  managerMetrics: ManagerMetrics,
  portfolioAverage: number
): Promise<string> {
  const anthropic = getAnthropicClient();

  const completionRate = managerMetrics.totalTasks > 0
    ? (managerMetrics.completedTasks / managerMetrics.totalTasks * 100).toFixed(1)
    : 0;

  const prompt = `You are a supportive project management coach providing feedback to a Work Package Manager.

MANAGER PERFORMANCE DATA:
- Manager: ${managerMetrics.manager}
- Total Tasks: ${managerMetrics.totalTasks}
- Completed Tasks: ${managerMetrics.completedTasks} (${completionRate}% completion rate)
- Forecast Accuracy: ${managerMetrics.forecastAccuracy.toFixed(1)}%
- Portfolio Average Forecast Accuracy: ${portfolioAverage.toFixed(1)}%
- Performance Relative to Portfolio: ${(managerMetrics.forecastAccuracy - portfolioAverage).toFixed(1)} percentage points ${managerMetrics.forecastAccuracy >= portfolioAverage ? 'above' : 'below'} average
- Average Duration Variance: ${managerMetrics.avgDurationVariance > 0 ? '+' : ''}${managerMetrics.avgDurationVariance.toFixed(1)}% (tasks taking ${Math.abs(managerMetrics.avgDurationVariance).toFixed(1)}% ${managerMetrics.avgDurationVariance > 0 ? 'longer' : 'shorter'} than planned)
- Generic Resource Usage: ${managerMetrics.genericResourcePct.toFixed(1)}%
- Critical Path Tasks: ${managerMetrics.criticalPathTasks}
- RAG Status Distribution: ${managerMetrics.redRAGCount} Red, ${managerMetrics.amberRAGCount} Amber, ${managerMetrics.greenRAGCount} Green

Generate a supportive, actionable analysis (2-3 paragraphs) that:
1. Acknowledges their strengths objectively based on the data
2. Identifies 1-2 specific areas for improvement (focus on the biggest impact items)
3. Provides concrete, actionable suggestions they can implement immediately (be specific about what to do differently)
4. Uses an encouraging, educational tone (not judgmental or critical)

Focus on behaviors and processes they can change, not just outcomes. Make recommendations practical and achievable.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

/**
 * Generate project-specific recommendations for project managers
 * Identifies urgent risks and provides actionable interventions
 */
export async function generateProjectRecommendations(
  projectMetrics: ProjectMetrics,
  projectTasks: Task[]
): Promise<string> {
  const anthropic = getAnthropicClient();

  const criticalPathTasks = projectTasks.filter(t => t.criticalPathRisk);
  const redTasks = projectTasks.filter(t => t.projectHealthRAG === 'Red');
  const amberTasks = projectTasks.filter(t => t.projectHealthRAG === 'Amber');
  const ignoredDepsCount = projectTasks.filter(t => t.ignoredDependencies).length;
  const avgReassessments = projectTasks.length > 0
    ? projectTasks.reduce((sum, t) => sum + t.totalReassessments, 0) / projectTasks.length
    : 0;

  const prompt = `You are a project management consultant analyzing a specific project for a Project Manager.

PROJECT DATA:
- Project: ${projectMetrics.projectName}
- Total Tasks: ${projectMetrics.totalTasks}
- Completion Rate: ${projectMetrics.completedPct.toFixed(1)}%
- Forecast Accuracy: ${projectMetrics.forecastAccuracy.toFixed(1)}%
- Duration Variance: ${projectMetrics.avgDurationVariance > 0 ? '+' : ''}${projectMetrics.avgDurationVariance.toFixed(1)}%
- Generic Resource Usage: ${projectMetrics.genericResourcePct.toFixed(1)}%
- Critical Path Tasks: ${projectMetrics.criticalPathTasksPct.toFixed(1)}% (${criticalPathTasks.length} tasks)
- Current RAG Status: ${projectMetrics.ragStatus}
- Predicted RAG Status: ${projectMetrics.predictedRAG}
- Tasks at Risk: ${redTasks.length} Red, ${amberTasks.length} Amber
- Tasks with Ignored Dependencies: ${ignoredDepsCount}
- Average Reassessments per Task: ${avgReassessments.toFixed(1)}

TOP RISKS IDENTIFIED:
${projectMetrics.topRisks.length > 0 ? projectMetrics.topRisks.map((risk, i) => `${i + 1}. ${risk}`).join('\n') : 'No major risks identified'}

Generate actionable recommendations (2-3 paragraphs) that:
1. Highlight the most urgent risk requiring immediate attention this week
2. Explain the specific impact on delivery if this risk is not addressed
3. Provide 2-3 specific interventions the PM can take in the next 5 business days
4. Use clear, direct language focused on action

Be specific and practical, not theoretical. Recommendations should be achievable within a week.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

/**
 * Identify behavioral patterns across the portfolio
 * Analyzes planning culture and systemic issues
 */
export async function identifyBehavioralPatterns(
  portfolioMetrics: PortfolioMetrics,
  _tasks: Task[]
): Promise<string> {
  const anthropic = getAnthropicClient();

  // Calculate additional pattern indicators
  const forecastAccuracies = portfolioMetrics.managerMetrics.map(m => m.forecastAccuracy);
  const minAccuracy = Math.min(...forecastAccuracies);
  const maxAccuracy = Math.max(...forecastAccuracies);
  const accuracySpread = maxAccuracy - minAccuracy;

  const managersWithHighGenericUsage = portfolioMetrics.managerMetrics.filter(
    m => m.genericResourcePct > 70
  ).length;

  const avgDurationVariance = portfolioMetrics.managerMetrics.reduce(
    (sum, m) => sum + m.avgDurationVariance, 0
  ) / portfolioMetrics.managerMetrics.length;

  const prompt = `You are a behavioral analytics expert analyzing project management patterns across an organization.

PATTERN INDICATORS:
- Generic Resource Usage: ${portfolioMetrics.genericResourcePct.toFixed(1)}% across portfolio (${portfolioMetrics.genericResourcePct > 70 ? 'CRITICAL' : portfolioMetrics.genericResourcePct > 40 ? 'HIGH' : 'MODERATE'})
- Managers with >70% Generic Usage: ${managersWithHighGenericUsage} out of ${portfolioMetrics.managerMetrics.length}
- Forecast Accuracy Range: ${minAccuracy.toFixed(1)}% to ${maxAccuracy.toFixed(1)}%
- Forecast Accuracy Spread: ${accuracySpread.toFixed(1)} percentage points (indicates ${accuracySpread > 40 ? 'high' : accuracySpread > 20 ? 'moderate' : 'low'} variability in planning maturity)
- Average Duration Variance: ${avgDurationVariance > 0 ? '+' : ''}${avgDurationVariance.toFixed(1)}%
- Critical Path Concentration: ${portfolioMetrics.criticalPathTasksPct.toFixed(1)}% of all tasks

MANAGER PERFORMANCE DISTRIBUTION:
- Top Performers (>80 score): ${portfolioMetrics.managerMetrics.filter(m => m.performanceScore >= 80).length}
- Mid Performers (60-80 score): ${portfolioMetrics.managerMetrics.filter(m => m.performanceScore >= 60 && m.performanceScore < 80).length}
- Low Performers (<60 score): ${portfolioMetrics.managerMetrics.filter(m => m.performanceScore < 60).length}

Analyze these patterns and generate insights (2-3 paragraphs) that:
1. Identify what these patterns reveal about the organization's planning culture and maturity
2. Explain which pattern is the biggest risk multiplier (i.e., which issue creates cascading problems)
3. Recommend one systemic intervention that would address multiple issues simultaneously
4. Use a strategic, analytical tone appropriate for organizational leadership

Focus on culture, processes, and systems - not individual performance. Think about root causes and systemic solutions.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

/**
 * Generate resource management recommendations
 * Focuses on capacity planning and resource allocation improvements
 */
export async function generateResourceInsights(
  portfolioMetrics: PortfolioMetrics
): Promise<string> {
  const anthropic = getAnthropicClient();

  // Calculate resource-specific metrics
  const topResourceHeavyManagers = portfolioMetrics.managerMetrics
    .sort((a, b) => b.totalTasks - a.totalTasks)
    .slice(0, 5);

  const managersWithHighGenericPct = portfolioMetrics.managerMetrics
    .filter(m => m.genericResourcePct > 50)
    .sort((a, b) => b.genericResourcePct - a.genericResourcePct)
    .slice(0, 3);

  const prompt = `You are a resource management expert analyzing capacity planning and allocation data.

RESOURCE DATA:
- Portfolio Generic Resource Usage: ${portfolioMetrics.genericResourcePct.toFixed(1)}%
- Total Tasks Requiring Resources: ${portfolioMetrics.totalTasks}
- Number of Functional Managers: ${portfolioMetrics.managerMetrics.length}

TOP RESOURCE-CONSUMING MANAGERS:
${topResourceHeavyManagers.map((m, i) =>
  `${i + 1}. ${m.manager}: ${m.totalTasks} tasks, ${m.genericResourcePct.toFixed(1)}% generic resources`
).join('\n')}

MANAGERS WITH HIGHEST GENERIC RESOURCE USAGE:
${managersWithHighGenericPct.length > 0
  ? managersWithHighGenericPct.map((m, i) =>
      `${i + 1}. ${m.manager}: ${m.genericResourcePct.toFixed(1)}% generic (${m.totalTasks} tasks)`
    ).join('\n')
  : 'No managers with >50% generic usage'}

Generate practical resource management advice (2-3 paragraphs) that:
1. Explain the specific business risks of high generic resource usage (be concrete about what goes wrong)
2. Provide a concrete, step-by-step action plan to convert generic to named resources over the next 4 weeks
3. Suggest specific capacity planning process improvements
4. Use a practical, solution-focused tone

Be specific about what Resource Managers should do starting next week. Focus on processes and workflows, not just policy changes.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

/**
 * Check if Claude API is configured
 */
export function isClaudeConfigured(): boolean {
  return !!import.meta.env.VITE_CLAUDE_API_KEY;
}

/**
 * Get a user-friendly error message from an API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return 'Claude API key is not configured. Please add VITE_CLAUDE_API_KEY to your .env file.';
    }
    if (error.message.includes('rate limit')) {
      return 'API rate limit exceeded. Please try again in a few minutes.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred while generating insights. Please try again.';
}
