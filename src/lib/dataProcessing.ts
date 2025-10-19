/**
 * Data Processing Utilities
 * Handles file parsing, data transformation, and validation
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { Task, ValidationResult } from '@/types';

/**
 * Parses an Excel file and returns raw data as array of objects
 * @param file - The Excel file to parse
 * @returns Promise resolving to array of raw data objects
 */
export const parseExcelFile = async (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('No data read from file');
        }

        const workbook = XLSX.read(data, {
          type: 'binary',
          cellDates: true,
          dateNF: 'yyyy-mm-dd'
        });

        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error('No sheets found in Excel file');
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: null
        });

        resolve(jsonData as Record<string, unknown>[]);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

/**
 * Parses a CSV file and returns raw data as array of objects
 * @param file - The CSV file to parse
 * @returns Promise resolving to array of raw data objects
 */
export const parseCSVFile = async (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          resolve(results.data as Record<string, unknown>[]);
        }
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};

/**
 * Parses a file (CSV or Excel) based on its type
 * @param file - The file to parse
 * @returns Promise resolving to array of raw data objects
 */
export const parseFile = async (file: File): Promise<Record<string, unknown>[]> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'csv') {
    return parseCSVFile(file);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    return parseExcelFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
  }
};

/**
 * Parses a date string or Date object into a Date
 * Handles various date formats and returns null for invalid dates
 * @param value - The value to parse as a date
 * @returns Date object or null
 */
const parseDate = (value: unknown): Date | null => {
  if (!value) return null;

  // Already a Date object
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // String date
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a') {
      return null;
    }

    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // Number (Excel serial date)
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return new Date(date.y, date.m - 1, date.d);
    }
  }

  return null;
};

/**
 * Parses a boolean value from various input types
 * @param value - The value to parse as boolean
 * @returns Boolean value
 */
const parseBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1';
  }
  if (typeof value === 'number') return value !== 0;
  return false;
};

/**
 * Parses a number value, returning 0 for invalid inputs
 * @param value - The value to parse as number
 * @returns Number value
 */
const parseNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.trim().replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Parses a string value, handling null/undefined
 * @param value - The value to parse as string
 * @returns String value
 */
const parseString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

/**
 * Maps common column name variations to standardized field names
 * @param columnName - The column name from the file
 * @returns Standardized field name
 */
const normalizeColumnName = (columnName: string): string => {
  const normalized = columnName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const mappings: Record<string, string> = {
    'portfolioname': 'portfolioName',
    'portfolio': 'portfolioName',
    'projectname': 'projectName',
    'project': 'projectName',
    'typeofproject': 'typeOfProject',
    'projecttype': 'typeOfProject',
    'workpackagename': 'workPackageName',
    'workpackage': 'workPackageName',
    'taskid': 'taskId',
    'id': 'taskId',
    'taskname': 'taskName',
    'task': 'taskName',
    'functionalmanager': 'functionalManager',
    'manager': 'functionalManager',
    'plannedduration': 'plannedDuration',
    'actualduration': 'actualDuration',
    'assignedresource': 'assignedResource',
    'resource': 'assignedResource',
    'plannedbudget': 'plannedBudget',
    'budget': 'plannedBudget',
    'totalspent': 'totalSpent',
    'spent': 'totalSpent',
    'status': 'status',
    'baselinestart': 'baselineStart',
    'baselineend': 'baselineEnd',
    'plannedstart': 'plannedStart',
    'actualstart': 'actualStart',
    'plannedend': 'plannedEnd',
    'actualend': 'actualEnd',
    'ignoreddependencies': 'ignoredDependencies',
    'resourceutilisation': 'resourceUtilisation',
    'resourceutilization': 'resourceUtilisation',
    'utilisation': 'resourceUtilisation',
    'projecthealthrag': 'projectHealthRAG',
    'healthrag': 'projectHealthRAG',
    'rag': 'projectHealthRAG',
    'totalreassessments': 'totalReassessments',
    'reassessments': 'totalReassessments',
    'criticalpathvolatility': 'criticalPathVolatility',
    'volatility': 'criticalPathVolatility',
    'criticalpathrisk': 'criticalPathRisk',
    'forecasthours': 'forecastHours',
    'actualhours': 'actualHours',
    'etchours': 'etcHours',
    'eachours': 'eacHours'
  };

  return mappings[normalized] || columnName;
};

/**
 * Transforms raw data object into a Task object
 * @param rawData - Raw data object from CSV/Excel
 * @returns Task object
 */
const transformToTask = (rawData: Record<string, unknown>): Task => {
  // Normalize column names
  const normalized: Record<string, unknown> = {};
  Object.keys(rawData).forEach(key => {
    const normalizedKey = normalizeColumnName(key);
    normalized[normalizedKey] = rawData[key];
  });

  return {
    portfolioName: parseString(normalized.portfolioName),
    projectName: parseString(normalized.projectName),
    typeOfProject: (parseString(normalized.typeOfProject) || 'PM') as 'BL' | 'PC' | 'PM' | 'WPM',
    workPackageName: parseString(normalized.workPackageName),
    taskId: parseString(normalized.taskId),
    taskName: parseString(normalized.taskName),
    functionalManager: parseString(normalized.functionalManager),
    plannedDuration: parseNumber(normalized.plannedDuration),
    actualDuration: parseNumber(normalized.actualDuration),
    assignedResource: parseString(normalized.assignedResource),
    plannedBudget: parseNumber(normalized.plannedBudget),
    totalSpent: parseNumber(normalized.totalSpent),
    status: (parseString(normalized.status) || 'Not Started') as 'Completed' | 'In Progress' | 'Not Started',
    baselineStart: parseDate(normalized.baselineStart),
    baselineEnd: parseDate(normalized.baselineEnd),
    plannedStart: parseDate(normalized.plannedStart),
    actualStart: parseDate(normalized.actualStart),
    plannedEnd: parseDate(normalized.plannedEnd),
    actualEnd: parseDate(normalized.actualEnd),
    ignoredDependencies: parseBoolean(normalized.ignoredDependencies),
    resourceUtilisation: parseNumber(normalized.resourceUtilisation),
    projectHealthRAG: (parseString(normalized.projectHealthRAG) || 'Amber') as 'Red' | 'Amber' | 'Green',
    totalReassessments: parseNumber(normalized.totalReassessments),
    criticalPathVolatility: parseNumber(normalized.criticalPathVolatility),
    criticalPathRisk: parseBoolean(normalized.criticalPathRisk),
    forecastHours: parseNumber(normalized.forecastHours),
    actualHours: parseNumber(normalized.actualHours),
    etcHours: parseNumber(normalized.etcHours),
    eacHours: parseNumber(normalized.eacHours)
  };
};

/**
 * Transforms array of raw data into array of Task objects
 * @param rawData - Array of raw data objects
 * @returns Array of Task objects
 */
export const transformTaskData = (rawData: Record<string, unknown>[]): Task[] => {
  return rawData.map((item, index) => {
    try {
      return transformToTask(item);
    } catch (error) {
      console.error(`Error transforming row ${index + 1}:`, error);
      throw new Error(`Failed to transform row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};

/**
 * Validates a single Task object
 * @param task - The task to validate
 * @param index - The task index (for error messages)
 * @returns Array of error messages (empty if valid)
 */
const validateTask = (task: Task, index: number): string[] => {
  const errors: string[] = [];

  // Required fields
  if (!task.taskId) errors.push(`Row ${index + 1}: Missing taskId`);
  if (!task.taskName) errors.push(`Row ${index + 1}: Missing taskName`);
  if (!task.projectName) errors.push(`Row ${index + 1}: Missing projectName`);

  // Valid enum values
  const validProjectTypes = ['BL', 'PC', 'PM', 'WPM'];
  if (!validProjectTypes.includes(task.typeOfProject)) {
    errors.push(`Row ${index + 1}: Invalid typeOfProject (must be BL, PC, PM, or WPM)`);
  }

  const validStatuses = ['Completed', 'In Progress', 'Not Started'];
  if (!validStatuses.includes(task.status)) {
    errors.push(`Row ${index + 1}: Invalid status (must be Completed, In Progress, or Not Started)`);
  }

  const validRAG = ['Red', 'Amber', 'Green'];
  if (!validRAG.includes(task.projectHealthRAG)) {
    errors.push(`Row ${index + 1}: Invalid projectHealthRAG (must be Red, Amber, or Green)`);
  }

  // Logical validations
  if (task.plannedDuration < 0) {
    errors.push(`Row ${index + 1}: Planned duration cannot be negative`);
  }

  if (task.actualDuration < 0) {
    errors.push(`Row ${index + 1}: Actual duration cannot be negative`);
  }

  if (task.plannedBudget < 0) {
    errors.push(`Row ${index + 1}: Planned budget cannot be negative`);
  }

  if (task.totalSpent < 0) {
    errors.push(`Row ${index + 1}: Total spent cannot be negative`);
  }

  // Date range validations
  if (task.plannedStart && task.plannedEnd && task.plannedStart > task.plannedEnd) {
    errors.push(`Row ${index + 1}: Planned start date is after planned end date`);
  }

  if (task.actualStart && task.actualEnd && task.actualStart > task.actualEnd) {
    errors.push(`Row ${index + 1}: Actual start date is after actual end date`);
  }

  return errors;
};

/**
 * Validates an array of Task objects
 * @param tasks - Array of tasks to validate
 * @returns ValidationResult object
 */
export const validateTaskData = (tasks: Task[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (tasks.length === 0) {
    return {
      valid: false,
      errors: ['No data to validate'],
      warnings: [],
      recordsProcessed: 0,
      recordsValid: 0
    };
  }

  // Validate each task
  tasks.forEach((task, index) => {
    const taskErrors = validateTask(task, index);
    errors.push(...taskErrors);
  });

  // Check for warnings
  const taskIds = tasks.map(t => t.taskId);
  const duplicateIds = taskIds.filter((id, index) => taskIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    warnings.push(`Duplicate task IDs found: ${[...new Set(duplicateIds)].join(', ')}`);
  }

  // Check for missing critical data
  const tasksWithoutManager = tasks.filter(t => !t.functionalManager).length;
  if (tasksWithoutManager > 0) {
    warnings.push(`${tasksWithoutManager} tasks missing functional manager`);
  }

  const tasksWithoutResource = tasks.filter(t => !t.assignedResource).length;
  if (tasksWithoutResource > 0) {
    warnings.push(`${tasksWithoutResource} tasks missing assigned resource`);
  }

  const tasksWithoutDates = tasks.filter(t => !t.plannedStart || !t.plannedEnd).length;
  if (tasksWithoutDates > 0) {
    warnings.push(`${tasksWithoutDates} tasks missing planned dates`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    recordsProcessed: tasks.length,
    recordsValid: tasks.length - errors.length
  };
};

/**
 * Processes an uploaded file: parses, transforms, and validates
 * @param file - The file to process
 * @returns Promise resolving to object with tasks and validation results
 */
export const processUploadedFile = async (file: File): Promise<{
  tasks: Task[];
  validation: ValidationResult;
}> => {
  try {
    // Parse file
    const rawData = await parseFile(file);

    // Transform data
    const tasks = transformTaskData(rawData);

    // Validate data
    const validation = validateTaskData(tasks);

    return { tasks, validation };
  } catch (error) {
    throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
