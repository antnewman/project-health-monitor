# 📊 Data Format Specification

This document provides detailed specifications for the data format required by the Project Health Monitor.

## Table of Contents

- [Overview](#overview)
- [Required Columns](#required-columns)
- [Optional Columns](#optional-columns)
- [Data Types](#data-types)
- [Column Name Variants](#column-name-variants)
- [Example Data](#example-data)
- [Common Issues](#common-issues)

---

## Overview

The Project Health Monitor accepts two file formats:
- **Excel**: `.xlsx` or `.xls` files
- **CSV**: `.csv` files

The tool uses intelligent column detection that matches column names flexibly, so you don't need to rename your existing export columns.

**Maximum file size**: 50MB

---

## Required Columns

These columns are **mandatory** for the tool to function. Without them, the upload will fail or produce incomplete analysis.

| Column Name | Data Type | Example Values | Description | Validation Rules |
|------------|-----------|----------------|-------------|------------------|
| **Project Name** | Text | "Digital Transformation"<br>"Website Redesign"<br>"Cloud Migration" | The name of the project this task belongs to | Cannot be empty |
| **Task Name** | Text | "Design UI Mockups"<br>"Write API Documentation"<br>"Deploy to Production" | Descriptive name of the task | Cannot be empty |
| **Task ID** | Text/Number | "TASK-001"<br>"WP-2024-142"<br>12345 | Unique identifier for the task | Must be unique across all tasks |
| **Status** | Text | "Completed"<br>"In Progress"<br>"Not Started" | Current state of the task | Must be one of: Completed, In Progress, Not Started, Planned, Cancelled |
| **Functional Manager** | Text | "Sarah Johnson"<br>"John Doe"<br>"Team Lead A" | Person responsible for planning this task | Cannot be empty |
| **Assigned Resource** | Text | "John Doe"<br>"Resource_Generic"<br>"Sarah Smith" | Person/resource assigned to execute the task | Can be generic (e.g., "Resource_123") |

---

## Optional Columns

These columns unlock additional features but are not required. The more optional columns you provide, the richer your analysis.

### Date Columns

| Column Name | Data Type | Example | Unlocks Feature | Notes |
|------------|-----------|---------|----------------|-------|
| **Planned Start** | Date | "2025-01-15"<br>44942 (Excel) | Forecast accuracy calculation | Accepts ISO date strings or Excel serial dates |
| **Planned End** | Date | "2025-01-20"<br>44947 (Excel) | Forecast accuracy, on-time completion analysis | Must be >= Planned Start |
| **Actual Start** | Date | "2025-01-16"<br>44943 (Excel) | Duration variance, delay analysis | Should be populated for completed tasks |
| **Actual End** | Date | "2025-01-22"<br>44949 (Excel) | Forecast accuracy, duration variance | Required for "Completed" status tasks |
| **Baseline Start** | Date | "2025-01-10"<br>44937 (Excel) | Baseline comparison, scope creep detection | Original planned date before changes |
| **Baseline End** | Date | "2025-01-18"<br>44945 (Excel) | Baseline drift analysis | Original planned end date |

###Duration & Effort Columns

| Column Name | Data Type | Example | Unlocks Feature | Notes |
|------------|-----------|---------|----------------|-------|
| **Planned Duration** | Number | 5<br>10.5 | Duration variance calculation | In days |
| **Actual Duration** | Number | 7<br>12 | Chronic optimism detection | In days |
| **Forecast Hours** | Number | 40<br>160 | Hour-based tracking | Total hours estimated |
| **Actual Hours** | Number | 48<br>175 | Hour variance analysis | Hours actually worked |
| **ETC Hours** | Number | 20 | Estimate to complete | Remaining hours |
| **EAC Hours** | Number | 68 | Estimate at completion | Actual + ETC |

### Budget Columns

| Column Name | Data Type | Example | Unlocks Feature | Notes |
|------------|-----------|---------|----------------|-------|
| **Planned Budget** | Number | 10000<br>25000.50 | Budget variance analysis | In your currency |
| **Total Spent** | Number | 12000<br>27500 | Over-budget detection | Cumulative spend |

### Risk & Health Columns

| Column Name | Data Type | Example | Unlocks Feature | Notes |
|------------|-----------|---------|----------------|-------|
| **Project Health (RAG)** | Text | "Red"<br>"Amber"<br>"Green" | RAG distribution charts, risk analysis | Must be one of: Red, Amber, Green |
| **Critical Path Risk** | Boolean | TRUE<br>FALSE<br>1<br>0 | Critical path analysis | Identifies tasks on the critical path |
| **Ignored Dependencies** | Boolean | TRUE<br>FALSE<br>1<br>0 | Dependency neglect pattern detection | Tasks with unmet dependencies |
| **Total Reassessments** | Number | 3<br>5<br>0 | Plan stability analysis | Number of times task was replanned |
| **Critical Path Volatility** | Number | 2.5<br>5.8 | Critical path health scoring | Volatility measure (higher = worse) |

### Resource Columns

| Column Name | Data Type | Example | Unlocks Feature | Notes |
|------------|-----------|---------|----------------|-------|
| **Resource Utilisation %** | Number | 75<br>100<br>45.5 | Capacity planning, over-allocation detection | Percentage (0-100+) |

### Portfolio/Hierarchy Columns

| Column Name | Data Type | Example | Unlocks Feature | Notes |
|------------|-----------|---------|----------------|-------|
| **Portfolio Name** | Text | "Digital Services"<br>"Infrastructure" | Portfolio-level aggregation | Optional grouping |
| **Work Package Name** | Text | "Phase 1 - Design"<br>"Backend Development" | Work package level analysis | Sub-project grouping |
| **Type of Project** | Text | "Development"<br>"Research"<br>"Infrastructure" | Project type filtering | Optional categorization |

---

## Data Types

### Text (String)
- **Format**: Any text
- **Max length**: 500 characters recommended
- **Special characters**: Allowed
- **Empty values**: Not allowed for required columns

### Number
- **Format**: Integer or decimal
- **Negative values**: Allowed (e.g., for budget variances)
- **Empty values**: Treated as 0 or null depending on context
- **Thousands separator**: Optional (e.g., "1,000" or "1000")
- **Decimal separator**: Use `.` (e.g., "10.5")

### Date
Supported formats:
1. **ISO 8601**: `2025-01-15` or `2025-01-15T14:30:00`
2. **Excel serial date**: `44942` (days since Jan 1, 1900)
3. **Common formats**: `01/15/2025`, `15-Jan-2025`

### Boolean
Accepted values:
- **TRUE**: `TRUE`, `true`, `1`, `yes`, `Y`
- **FALSE**: `FALSE`, `false`, `0`, `no`, `N`
- **Empty**: Treated as `FALSE`

---

## Column Name Variants

The tool automatically detects column names in various formats. You don't need to rename your columns!

### Examples of Accepted Variants

**Project Name**:
- `Project Name`
- `projectName`
- `project_name`
- `PROJECT NAME`
- `Project`
- `ProjectName`

**Functional Manager**:
- `Functional Manager`
- `functionalManager`
- `functional_manager`
- `Manager`
- `Work Package Manager`
- `WP Manager`

**Planned Start**:
- `Planned Start`
- `plannedStart`
- `Planned Start Date`
- `Start Date (Planned)`
- `Planned_Start_Date`

**Resource Utilisation %**:
- `Resource Utilisation %`
- `resourceUtilisation`
- `Resource Utilization`
- `Utilisation %`
- `Util %`

### Normalization Process

The tool:
1. Removes special characters and spaces
2. Converts to lowercase
3. Matches against known patterns
4. Falls back to partial matching if exact match not found

---

## Example Data

### Minimal Example (Required Columns Only)

```csv
Project Name,Task Name,Task ID,Status,Functional Manager,Assigned Resource
Digital Transformation,Design UI,TASK-001,Completed,Sarah Johnson,John Doe
Digital Transformation,Build API,TASK-002,In Progress,Sarah Johnson,Resource_Generic
Website Redesign,Wireframes,TASK-003,Not Started,Mike Chen,Resource_Designer
```

### Complete Example (All Recommended Columns)

```csv
Portfolio Name,Project Name,Type of Project,Work Package Name,Task ID,Task Name,Functional Manager,Planned Duration (days),Actual Duration (days),Assigned Resource,Planned Budget,Total Spent,Status,Baseline Start,Baseline End,Planned Start,Planned End,Actual Start,Actual End,Ignored Dependencies,Resource Utilisation %,Project Health (RAG),Total Reassessments,Critical Path Volatility,Critical Path Risk,Forecast Hours,Actual Hours,ETC Hours,EAC Hours
Digital Services,Digital Transformation,Development,Phase 1 - Design,TASK-001,Design UI Mockups,Sarah Johnson,5,7,John Doe,10000,12000,Completed,2025-01-10,2025-01-15,2025-01-12,2025-01-17,2025-01-12,2025-01-19,FALSE,85,Amber,2,3.5,FALSE,40,56,0,56
Digital Services,Digital Transformation,Development,Phase 2 - Build,TASK-002,Build REST API,Sarah Johnson,10,0,Resource_Generic,25000,8000,In Progress,2025-01-18,2025-01-28,2025-01-20,2025-01-30,2025-01-20,,FALSE,100,Red,4,6.2,TRUE,80,64,40,104
Infrastructure,Website Redesign,Design,Creative,TASK-003,Create Wireframes,Mike Chen,3,0,Resource_Designer,5000,0,Not Started,2025-02-01,2025-02-04,2025-02-05,2025-02-08,,,FALSE,0,Green,0,0,FALSE,24,0,24,24
```

### Excel Format Notes

- Dates in Excel are automatically converted (e.g., `44942` → `2025-01-15`)
- Percentages can be formatted as numbers (e.g., `85` for 85%)
- Booleans can be TRUE/FALSE or 1/0
- Currency symbols are stripped automatically (e.g., `$10,000` → `10000`)

---

## Common Issues & Solutions

### Issue 1: Upload Fails with "Missing Required Columns"

**Solution**: Ensure all 6 required columns are present and have data. Check for:
- Empty column headers
- Misspelled column names (though tool is flexible)
- Completely empty columns

### Issue 2: Dates Not Parsing Correctly

**Symptoms**: Dates appear as numbers or incorrect dates

**Solutions**:
- Use ISO format: `YYYY-MM-DD`
- Export from Excel as CSV (dates auto-convert)
- Ensure Excel locale matches data format

### Issue 3: Forecast Accuracy Shows 0%

**Cause**: Missing date columns (Planned End, Actual End)

**Solution**: Include both `Planned End` and `Actual End` columns for completed tasks

### Issue 4: Generic Resource % is 0% (but you have generic resources)

**Cause**: Resource names don't match the generic pattern

**Solution**: Ensure generic resources are named:
- `Resource_*` (e.g., `Resource_001`, `Resource_Generic`)
- `Generic*`
- `TBD`
- `Unassigned`
- `Placeholder`

### Issue 5: Critical Path Analysis Not Showing

**Cause**: Missing `Critical Path Risk` column

**Solution**: Add a boolean column indicating which tasks are on the critical path

### Issue 6: RAG Charts Are Empty

**Cause**: `Project Health (RAG)` column missing or incorrect values

**Solution**: Add RAG column with exactly: `Red`, `Amber`, or `Green`

---

## Validation Messages

When you upload a file, the tool validates your data and shows:

### Errors (Upload blocked)
- ❌ "Missing required column: Project Name"
- ❌ "No valid tasks found in file"
- ❌ "File format not supported"

### Warnings (Upload allowed)
- ⚠️ "15 tasks missing Functional Manager (using 'Unknown')"
- ⚠️ "23 tasks have no dates (forecast accuracy unavailable)"
- ⚠️ "45 tasks marked Completed but missing Actual End date"

---

## Best Practices

1. **Include as many columns as possible** - More data = better insights
2. **Use consistent naming** - Don't mix "Resource_001" and "Generic Resource 1"
3. **Populate date fields for completed tasks** - Essential for accuracy metrics
4. **Mark critical path explicitly** - Don't rely on the tool to infer it
5. **Use real numbers** - Don't use placeholders like "TBD" in numeric fields
6. **Update status accurately** - Completed tasks should have Actual End dates
7. **Test with sample data first** - Download our sample and compare formats

---

## Download Sample Data

**Live Sample**: [Fake Dataset 26.05 V2.xlsx](./sample-data/Fake%20Dataset%2026.05%20V2.xlsx)

This file contains:
- 200+ tasks across 5 projects
- All optional columns populated
- Mix of completed, in-progress, and not-started tasks
- Examples of behavioral patterns (chronic optimism, generic resources, etc.)
- Realistic dates, budgets, and resource allocations

Use this as a template for your own data exports!

---

## Need Help?

- 📖 [User Guide](USER_GUIDE.md) - Step-by-step usage instructions
- 🐛 [Report an Issue](https://github.com/tortoiseai/project-health-monitor/issues)
- 💬 [Ask Questions](https://github.com/tortoiseai/project-health-monitor/discussions)
- 📧 [Email Support](mailto:support@tortoiseai.co.uk)

---

**Last Updated**: January 2025
**Version**: 1.0.0
