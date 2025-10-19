/**
 * Core type definitions for Project Health & Behaviour Monitor
 */

/**
 * Represents a single task in the project management system
 */
export interface Task {
  portfolioName: string;
  projectName: string;
  typeOfProject: 'BL' | 'PC' | 'PM' | 'WPM';
  workPackageName: string;
  taskId: string;
  taskName: string;
  functionalManager: string;
  plannedDuration: number;
  actualDuration: number;
  assignedResource: string;
  plannedBudget: number;
  totalSpent: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  baselineStart: Date | null;
  baselineEnd: Date | null;
  plannedStart: Date | null;
  actualStart: Date | null;
  plannedEnd: Date | null;
  actualEnd: Date | null;
  ignoredDependencies: boolean;
  resourceUtilisation: number;
  projectHealthRAG: 'Red' | 'Amber' | 'Green';
  totalReassessments: number;
  criticalPathVolatility: number;
  criticalPathRisk: boolean;
  forecastHours: number;
  actualHours: number;
  etcHours: number;
  eacHours: number;
}

/**
 * Performance metrics for a functional manager
 */
export interface ManagerMetrics {
  manager: string;
  totalTasks: number;
  completedTasks: number;
  onTimeStartCount: number;
  onTimeEndCount: number;
  forecastAccuracy: number;
  avgDurationVariance: number;
  genericResourcePct: number;
  criticalPathTasks: number;
  redRAGCount: number;
  amberRAGCount: number;
  greenRAGCount: number;
  performanceScore: number;
}

/**
 * Metrics for a specific project
 */
export interface ProjectMetrics {
  projectName: string;
  totalTasks: number;
  completedPct: number;
  forecastAccuracy: number;
  avgDurationVariance: number;
  genericResourcePct: number;
  criticalPathTasksPct: number;
  ragStatus: 'Red' | 'Amber' | 'Green';
  predictedRAG: 'Red' | 'Amber' | 'Green';
  topRisks: string[];
}

/**
 * Portfolio-level aggregated metrics
 */
export interface PortfolioMetrics {
  totalProjects: number;
  totalTasks: number;
  avgForecastAccuracy: number;
  genericResourcePct: number;
  criticalPathTasksPct: number;
  ragDistribution: {
    Red: number;
    Amber: number;
    Green: number;
  };
  managerMetrics: ManagerMetrics[];
}

/**
 * AI-generated or system-generated insight
 */
export interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'danger';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  affectedEntity: string;
}

/**
 * Detected behavioural pattern in project planning
 */
export interface BehaviouralPattern {
  patternType: 'chronic_optimism' | 'generic_resource_overuse' | 'critical_path_instability' | 'resource_hoarding';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedManagers: string[];
  recommendation: string;
}

/**
 * Resource utilisation data point for heatmap visualization
 */
export interface ResourceUtilisation {
  resource: string;
  manager: string;
  utilisationPct: number;
  totalHours: number;
  projectCount: number;
  overAllocated: boolean;
}

/**
 * Time-series data point for trend analysis
 */
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * Risk item for a project or work package
 */
export interface RiskItem {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  impact: string;
  mitigation: string;
}

/**
 * Persona type for dashboard views
 */
export type PersonaType = 'senior-leader' | 'project-manager' | 'resource-manager' | 'planner';

/**
 * Filter options for data views
 */
export interface FilterOptions {
  portfolios: string[];
  projects: string[];
  managers: string[];
  status: ('Completed' | 'In Progress' | 'Not Started')[];
  ragStatus: ('Red' | 'Amber' | 'Green')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Upload file metadata
 */
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  recordCount: number;
}

/**
 * Data validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recordsProcessed: number;
  recordsValid: number;
}

/**
 * Chart data configuration
 */
export interface ChartConfig {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'heatmap' | 'scatter';
  data: unknown[];
  xKey?: string;
  yKey?: string;
  colorScheme?: string[];
}

/**
 * Dashboard card configuration
 */
export interface DashboardCard {
  id: string;
  title: string;
  value: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  icon?: string;
  color?: string;
}

/**
 * Notification/Alert item
 */
export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

/**
 * User preferences (for future use)
 */
export interface UserPreferences {
  defaultPersona: PersonaType;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoRefresh: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
