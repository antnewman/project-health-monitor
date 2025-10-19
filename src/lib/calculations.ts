/**
 * Calculation Functions for Metrics and Analytics
 * Implements all behavioural metric calculations for the dashboard
 */

import type { Task, ManagerMetrics, ProjectMetrics, PortfolioMetrics, BehaviouralPattern, Insight } from '@/types';

/**
 * Calculates forecast accuracy as percentage of tasks completed on time
 * @param tasks - Array of tasks to analyze
 * @param manager - Optional manager filter
 * @returns Forecast accuracy percentage (0-100)
 */
export const calculateForecastAccuracy = (tasks: Task[], manager?: string): number => {
  const filteredTasks = manager
    ? tasks.filter(t => t.functionalManager === manager && t.status === 'Completed')
    : tasks.filter(t => t.status === 'Completed');

  if (filteredTasks.length === 0) return 0;

  const onTime = filteredTasks.filter(t => {
    if (!t.plannedEnd || !t.actualEnd) return false;
    return new Date(t.actualEnd) <= new Date(t.plannedEnd);
  }).length;

  return (onTime / filteredTasks.length) * 100;
};

/**
 * Calculates average duration variance as percentage
 * Positive means tasks took longer than planned, negative means shorter
 * @param tasks - Array of tasks to analyze
 * @param manager - Optional manager filter
 * @returns Average duration variance percentage
 */
export const calculateDurationVariance = (tasks: Task[], manager?: string): number => {
  const filteredTasks = manager
    ? tasks.filter(t => t.functionalManager === manager && t.status === 'Completed')
    : tasks.filter(t => t.status === 'Completed');

  const validTasks = filteredTasks.filter(t => t.plannedDuration > 0 && t.actualDuration > 0);
  if (validTasks.length === 0) return 0;

  const variances = validTasks.map(t =>
    ((t.actualDuration - t.plannedDuration) / t.plannedDuration) * 100
  );

  return variances.reduce((sum, v) => sum + v, 0) / variances.length;
};

/**
 * Calculates percentage of tasks using generic resources
 * Generic resources are identified by patterns like "Resource_", "TBD", "Generic", etc.
 * @param tasks - Array of tasks to analyze
 * @param manager - Optional manager filter
 * @returns Generic resource percentage (0-100)
 */
export const calculateGenericResourcePercentage = (tasks: Task[], manager?: string): number => {
  const filteredTasks = manager
    ? tasks.filter(t => t.functionalManager === manager)
    : tasks;

  if (filteredTasks.length === 0) return 0;

  const genericPatterns = /resource_|generic|tbd|unassigned|placeholder|to be determined/i;
  const generic = filteredTasks.filter(t =>
    t.assignedResource && genericPatterns.test(t.assignedResource)
  ).length;

  return (generic / filteredTasks.length) * 100;
};

/**
 * Calculates critical path health score (0-100)
 * Higher score = healthier (lower volatility and appropriate critical path size)
 * @param tasks - Array of tasks to analyze
 * @returns Critical path health score (0-100)
 */
export const calculateCriticalPathHealth = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;

  const criticalTasks = tasks.filter(t => t.criticalPathRisk);
  if (criticalTasks.length === 0) return 100; // No critical path risks

  const avgVolatility = criticalTasks.reduce((sum, t) => sum + t.criticalPathVolatility, 0) / criticalTasks.length;
  const criticalPct = (criticalTasks.length / tasks.length) * 100;

  // Volatility score (0-50): lower volatility is better
  const maxVolatility = 10;
  const volatilityScore = Math.max(0, Math.min(50, (1 - avgVolatility / maxVolatility) * 50));

  // Concentration score (0-50): critical path should be 15-25% of tasks
  const idealCriticalPct = 20;
  const concentrationScore = Math.max(0, Math.min(50, 50 - Math.abs(criticalPct - idealCriticalPct) * 2));

  return Math.round(volatilityScore + concentrationScore);
};

/**
 * Calculates resource utilisation percentage
 * @param tasks - Array of tasks to analyze
 * @param manager - Optional manager filter
 * @returns Average resource utilisation percentage
 */
export const calculateResourceUtilisation = (tasks: Task[], manager?: string): number => {
  const filteredTasks = manager
    ? tasks.filter(t => t.functionalManager === manager)
    : tasks;

  const validTasks = filteredTasks.filter(t => t.resourceUtilisation > 0);
  if (validTasks.length === 0) return 0;

  const totalUtilisation = validTasks.reduce((sum, t) => sum + t.resourceUtilisation, 0);
  return totalUtilisation / validTasks.length;
};

/**
 * Calculates performance score for a manager (0-100)
 * Weighted combination of multiple metrics
 * @param tasks - Array of tasks for this manager
 * @returns Performance score (0-100)
 */
const calculatePerformanceScore = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;

  // Weights for different metrics
  const weights = {
    forecastAccuracy: 0.35,
    durationVariance: 0.25,
    genericResource: 0.20,
    criticalPath: 0.10,
    ragStatus: 0.10
  };

  // Forecast accuracy (higher is better)
  const forecastScore = calculateForecastAccuracy(tasks);

  // Duration variance (closer to 0 is better)
  const varianceScore = Math.max(0, 100 - Math.abs(calculateDurationVariance(tasks)));

  // Generic resource usage (lower is better)
  const genericScore = Math.max(0, 100 - calculateGenericResourcePercentage(tasks));

  // Critical path health
  const criticalScore = calculateCriticalPathHealth(tasks);

  // RAG status (more green is better)
  const greenPct = (tasks.filter(t => t.projectHealthRAG === 'Green').length / tasks.length) * 100;
  const amberPct = (tasks.filter(t => t.projectHealthRAG === 'Amber').length / tasks.length) * 100;
  const ragScore = greenPct + (amberPct * 0.5);

  // Weighted average
  const score =
    forecastScore * weights.forecastAccuracy +
    varianceScore * weights.durationVariance +
    genericScore * weights.genericResource +
    criticalScore * weights.criticalPath +
    ragScore * weights.ragStatus;

  return Math.round(score);
};

/**
 * Calculates metrics for each functional manager
 * @param tasks - Array of all tasks
 * @returns Array of ManagerMetrics sorted by performance score (descending)
 */
export const calculateManagerMetrics = (tasks: Task[]): ManagerMetrics[] => {
  if (tasks.length === 0) return [];

  // Group tasks by manager
  const tasksByManager = tasks.reduce((acc, task) => {
    const manager = task.functionalManager || 'Unassigned';
    if (!acc[manager]) {
      acc[manager] = [];
    }
    acc[manager].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Calculate metrics for each manager
  const managerMetrics: ManagerMetrics[] = Object.entries(tasksByManager).map(([manager, managerTasks]) => {
    const completedTasks = managerTasks.filter(t => t.status === 'Completed');
    const onTimeStarts = completedTasks.filter(t =>
      t.plannedStart && t.actualStart && new Date(t.actualStart) <= new Date(t.plannedStart)
    ).length;
    const onTimeEnds = completedTasks.filter(t =>
      t.plannedEnd && t.actualEnd && new Date(t.actualEnd) <= new Date(t.plannedEnd)
    ).length;

    return {
      manager,
      totalTasks: managerTasks.length,
      completedTasks: completedTasks.length,
      onTimeStartCount: onTimeStarts,
      onTimeEndCount: onTimeEnds,
      forecastAccuracy: calculateForecastAccuracy(managerTasks),
      avgDurationVariance: calculateDurationVariance(managerTasks),
      genericResourcePct: calculateGenericResourcePercentage(managerTasks),
      criticalPathTasks: managerTasks.filter(t => t.criticalPathRisk).length,
      redRAGCount: managerTasks.filter(t => t.projectHealthRAG === 'Red').length,
      amberRAGCount: managerTasks.filter(t => t.projectHealthRAG === 'Amber').length,
      greenRAGCount: managerTasks.filter(t => t.projectHealthRAG === 'Green').length,
      performanceScore: calculatePerformanceScore(managerTasks)
    };
  });

  // Sort by performance score descending
  return managerMetrics.sort((a, b) => b.performanceScore - a.performanceScore);
};

/**
 * Predicts RAG status based on project metrics
 * @param metrics - Project metrics object
 * @returns Predicted RAG status
 */
export const predictRAGStatus = (metrics: ProjectMetrics): 'Red' | 'Amber' | 'Green' => {
  // Red conditions (high risk)
  if (
    metrics.forecastAccuracy < 50 ||
    metrics.genericResourcePct > 80 ||
    metrics.avgDurationVariance > 25 ||
    metrics.criticalPathTasksPct > 40
  ) {
    return 'Red';
  }

  // Amber conditions (medium risk)
  if (
    metrics.forecastAccuracy < 70 ||
    metrics.genericResourcePct > 50 ||
    metrics.avgDurationVariance > 15 ||
    metrics.criticalPathTasksPct > 30
  ) {
    return 'Amber';
  }

  // Green (low risk)
  return 'Green';
};

/**
 * Identifies top risks for a project based on metrics
 * @param projectTasks - Tasks for this project
 * @param metrics - Project metrics
 * @returns Array of risk descriptions
 */
const identifyProjectRisks = (projectTasks: Task[], metrics: ProjectMetrics): string[] => {
  const risks: string[] = [];

  if (metrics.forecastAccuracy < 60) {
    risks.push(`Low forecast accuracy (${metrics.forecastAccuracy.toFixed(1)}%)`);
  }

  if (metrics.genericResourcePct > 60) {
    risks.push(`High generic resource usage (${metrics.genericResourcePct.toFixed(1)}%)`);
  }

  if (metrics.avgDurationVariance > 20) {
    risks.push(`Large duration variance (+${metrics.avgDurationVariance.toFixed(1)}%)`);
  }

  if (metrics.criticalPathTasksPct > 35) {
    risks.push(`Oversized critical path (${metrics.criticalPathTasksPct.toFixed(1)}%)`);
  }

  const highVolatilityTasks = projectTasks.filter(t => t.criticalPathVolatility > 5);
  if (highVolatilityTasks.length > 0) {
    risks.push(`${highVolatilityTasks.length} tasks with high critical path volatility`);
  }

  const overBudgetTasks = projectTasks.filter(t => t.totalSpent > t.plannedBudget * 1.1);
  if (overBudgetTasks.length > 0) {
    risks.push(`${overBudgetTasks.length} tasks over budget by >10%`);
  }

  return risks.slice(0, 5); // Top 5 risks
};

/**
 * Calculates metrics for each project
 * @param tasks - Array of all tasks
 * @returns Array of ProjectMetrics
 */
export const calculateProjectMetrics = (tasks: Task[]): ProjectMetrics[] => {
  if (tasks.length === 0) return [];

  // Group tasks by project
  const tasksByProject = tasks.reduce((acc, task) => {
    const project = task.projectName || 'Unnamed Project';
    if (!acc[project]) {
      acc[project] = [];
    }
    acc[project].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Calculate metrics for each project
  const projectMetrics: ProjectMetrics[] = Object.entries(tasksByProject).map(([projectName, projectTasks]) => {
    const completedPct = (projectTasks.filter(t => t.status === 'Completed').length / projectTasks.length) * 100;
    const criticalPathTasksPct = (projectTasks.filter(t => t.criticalPathRisk).length / projectTasks.length) * 100;

    // Determine current RAG status (most common RAG in tasks)
    const ragCounts = {
      Red: projectTasks.filter(t => t.projectHealthRAG === 'Red').length,
      Amber: projectTasks.filter(t => t.projectHealthRAG === 'Amber').length,
      Green: projectTasks.filter(t => t.projectHealthRAG === 'Green').length
    };
    const ragStatus = (Object.keys(ragCounts) as Array<'Red' | 'Amber' | 'Green'>)
      .reduce((a, b) => ragCounts[a] > ragCounts[b] ? a : b);

    const metrics: ProjectMetrics = {
      projectName,
      totalTasks: projectTasks.length,
      completedPct,
      forecastAccuracy: calculateForecastAccuracy(projectTasks),
      avgDurationVariance: calculateDurationVariance(projectTasks),
      genericResourcePct: calculateGenericResourcePercentage(projectTasks),
      criticalPathTasksPct,
      ragStatus,
      predictedRAG: 'Green' as 'Red' | 'Amber' | 'Green', // Will be set below
      topRisks: []
    };

    // Predict future RAG status
    metrics.predictedRAG = predictRAGStatus(metrics);

    // Identify top risks
    metrics.topRisks = identifyProjectRisks(projectTasks, metrics);

    return metrics;
  });

  return projectMetrics;
};

/**
 * Calculates portfolio-level aggregated metrics
 * @param tasks - Array of all tasks
 * @returns PortfolioMetrics object
 */
export const calculatePortfolioMetrics = (tasks: Task[]): PortfolioMetrics => {
  if (tasks.length === 0) {
    return {
      totalProjects: 0,
      totalTasks: 0,
      avgForecastAccuracy: 0,
      genericResourcePct: 0,
      criticalPathTasksPct: 0,
      ragDistribution: { Red: 0, Amber: 0, Green: 0 },
      managerMetrics: []
    };
  }

  // Calculate unique projects
  const uniqueProjects = new Set(tasks.map(t => t.projectName));

  // Calculate RAG distribution
  const ragDistribution = {
    Red: tasks.filter(t => t.projectHealthRAG === 'Red').length,
    Amber: tasks.filter(t => t.projectHealthRAG === 'Amber').length,
    Green: tasks.filter(t => t.projectHealthRAG === 'Green').length
  };

  // Calculate manager metrics
  const managerMetrics = calculateManagerMetrics(tasks);

  return {
    totalProjects: uniqueProjects.size,
    totalTasks: tasks.length,
    avgForecastAccuracy: calculateForecastAccuracy(tasks),
    genericResourcePct: calculateGenericResourcePercentage(tasks),
    criticalPathTasksPct: (tasks.filter(t => t.criticalPathRisk).length / tasks.length) * 100,
    ragDistribution,
    managerMetrics
  };
};

/**
 * Detects behavioural patterns across the portfolio
 * @param tasks - Array of all tasks
 * @param managerMetrics - Manager metrics array
 * @returns Array of detected behavioural patterns
 */
export const detectBehaviouralPatterns = (
  tasks: Task[],
  managerMetrics: ManagerMetrics[]
): BehaviouralPattern[] => {
  const patterns: BehaviouralPattern[] = [];

  // Chronic Optimism: Consistently underestimating task duration
  const optimists = managerMetrics.filter(m => m.avgDurationVariance > 15 && m.forecastAccuracy < 60);
  if (optimists.length > 0) {
    patterns.push({
      patternType: 'chronic_optimism',
      severity: optimists.length > managerMetrics.length * 0.5 ? 'high' : 'medium',
      description: `${optimists.length} manager(s) consistently underestimate task duration by ${optimists[0].avgDurationVariance.toFixed(1)}% on average`,
      affectedManagers: optimists.map(m => m.manager),
      recommendation: 'Implement historical data analysis and add buffer time based on past performance. Consider planning poker sessions with the team.'
    });
  }

  // Generic Resource Overuse
  const genericAbusers = managerMetrics.filter(m => m.genericResourcePct > 70);
  if (genericAbusers.length > 0) {
    patterns.push({
      patternType: 'generic_resource_overuse',
      severity: genericAbusers.length > managerMetrics.length * 0.3 ? 'high' : 'medium',
      description: `${genericAbusers.length} manager(s) use generic resources for ${genericAbusers[0].genericResourcePct.toFixed(1)}% of tasks`,
      affectedManagers: genericAbusers.map(m => m.manager),
      recommendation: 'Require named resource assignments 4+ weeks before task start. Implement resource booking system with advance planning incentives.'
    });
  }

  // Critical Path Instability
  const highVolatility = tasks.filter(t => t.criticalPathVolatility > 5).length;
  if (highVolatility > tasks.length * 0.2) {
    const affectedManagers = [...new Set(
      tasks.filter(t => t.criticalPathVolatility > 5).map(t => t.functionalManager)
    )];
    patterns.push({
      patternType: 'critical_path_instability',
      severity: highVolatility > tasks.length * 0.3 ? 'high' : 'medium',
      description: `${highVolatility} tasks (${((highVolatility / tasks.length) * 100).toFixed(1)}%) show high critical path volatility`,
      affectedManagers,
      recommendation: 'Stabilize critical path through dependency review, buffer management, and reducing multitasking on critical tasks.'
    });
  }

  // Resource Hoarding: Low resource utilisation
  const hoarders = managerMetrics.filter(m => {
    const managerTasks = tasks.filter(t => t.functionalManager === m.manager);
    const avgUtil = calculateResourceUtilisation(managerTasks);
    return avgUtil < 60 && m.totalTasks > 5;
  });
  if (hoarders.length > 0) {
    patterns.push({
      patternType: 'resource_hoarding',
      severity: hoarders.length > managerMetrics.length * 0.3 ? 'high' : 'low',
      description: `${hoarders.length} manager(s) showing low resource utilisation (<60%)`,
      affectedManagers: hoarders.map(m => m.manager),
      recommendation: 'Review resource allocation and capacity. Consider resource sharing across teams and reduce resource hoarding.'
    });
  }

  return patterns.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};

/**
 * Generates insights based on portfolio analysis
 * @param _tasks - Array of all tasks (unused but kept for API consistency)
 * @param portfolioMetrics - Portfolio metrics
 * @returns Array of insights
 */
export const generateInsights = (
  _tasks: Task[],
  portfolioMetrics: PortfolioMetrics
): Insight[] => {
  const insights: Insight[] = [];

  // Portfolio-level insights
  if (portfolioMetrics.avgForecastAccuracy < 60) {
    insights.push({
      id: 'portfolio-forecast-low',
      type: 'danger',
      priority: 'high',
      title: 'Low Portfolio Forecast Accuracy',
      description: `Portfolio forecast accuracy is ${portfolioMetrics.avgForecastAccuracy.toFixed(1)}%, below the 60% threshold`,
      recommendation: 'Implement mandatory historical analysis before planning. Train managers on realistic estimation techniques.',
      affectedEntity: 'Portfolio'
    });
  }

  if (portfolioMetrics.genericResourcePct > 50) {
    insights.push({
      id: 'portfolio-generic-high',
      type: 'warning',
      priority: 'high',
      title: 'High Generic Resource Usage',
      description: `${portfolioMetrics.genericResourcePct.toFixed(1)}% of tasks use generic resources`,
      recommendation: 'Enforce named resource assignments at least 4 weeks before task start dates.',
      affectedEntity: 'Portfolio'
    });
  }

  // RAG distribution insights
  const totalRAG = portfolioMetrics.ragDistribution.Red + portfolioMetrics.ragDistribution.Amber + portfolioMetrics.ragDistribution.Green;
  const redPct = (portfolioMetrics.ragDistribution.Red / totalRAG) * 100;
  if (redPct > 30) {
    insights.push({
      id: 'portfolio-rag-red',
      type: 'danger',
      priority: 'high',
      title: 'High Number of Red RAG Projects',
      description: `${redPct.toFixed(1)}% of tasks are in Red RAG status`,
      recommendation: 'Immediate intervention required. Review project plans, resources, and dependencies.',
      affectedEntity: 'Portfolio'
    });
  }

  // Manager-specific insights
  const poorPerformers = portfolioMetrics.managerMetrics.filter(m => m.performanceScore < 40);
  if (poorPerformers.length > 0) {
    poorPerformers.forEach(manager => {
      insights.push({
        id: `manager-${manager.manager}-low-score`,
        type: 'warning',
        priority: 'medium',
        title: `${manager.manager}: Low Performance Score`,
        description: `Performance score of ${manager.performanceScore} indicates planning issues`,
        recommendation: 'Provide coaching on realistic planning, resource allocation, and dependency management.',
        affectedEntity: manager.manager
      });
    });
  }

  // Success stories
  const topPerformers = portfolioMetrics.managerMetrics.filter(m => m.performanceScore > 80);
  if (topPerformers.length > 0) {
    insights.push({
      id: 'portfolio-top-performers',
      type: 'success',
      priority: 'low',
      title: 'Strong Performance from Top Managers',
      description: `${topPerformers.length} manager(s) achieving >80% performance score`,
      recommendation: 'Share best practices from these managers across the organization.',
      affectedEntity: 'Portfolio'
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};
