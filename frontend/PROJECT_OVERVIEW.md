# Project Health & Behaviour Monitor

**Hackathon 2025 - AI-Powered Planning Behaviour Detection**

A React + TypeScript dashboard for detecting poor planning behaviours in project management data through advanced metrics and AI-powered insights.

## Overview

This application analyzes project management data to identify problematic planning patterns and behaviours across portfolios, projects, and individual planners. It provides four distinct dashboard views tailored to different stakeholder personas.

## Features

### 🎯 Four Persona-Specific Dashboards

1. **Senior Leader View** - Portfolio-wide health overview
   - Portfolio KPIs and metrics
   - Manager performance league table
   - RAG status distribution
   - Systemic behavioural issue detection
   - AI-generated executive summary

2. **Project Manager View** - Project-level health monitoring
   - Project health metrics
   - At-risk work packages
   - Timeline visualization
   - Intervention recommendations
   - Critical path analysis

3. **Resource Manager View** - Resource allocation & capacity planning
   - Resource utilisation heatmap
   - Generic resource usage tracking
   - Capacity planning insights
   - Over/under-allocation alerts
   - Resource recommendations

4. **Planner View** - Personal performance scorecard
   - Individual forecast accuracy
   - Accuracy trends over time
   - Peer comparison & ranking
   - Improvement suggestions
   - Upcoming task nudges

### 📊 Key Behavioural Metrics

- **Forecast Accuracy**: Percentage of tasks completed on time
- **Duration Variance**: Average deviation from planned duration
- **Generic Resource Usage**: Percentage of placeholder resources
- **Critical Path Health**: Stability and size of critical path
- **Resource Utilisation**: Allocation efficiency metrics

### 🤖 AI-Powered Pattern Detection

Automatically detects four key anti-patterns:
- **Chronic Optimism**: Consistently underestimating task duration
- **Generic Resource Overuse**: Excessive use of placeholder resources
- **Critical Path Instability**: Frequent critical path changes
- **Resource Hoarding**: Low resource utilisation

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3
- **Icons**: Lucide React
- **Data Processing**: xlsx, PapaParse

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── charts/              # Recharts visualizations
│   │   │   ├── ForecastAccuracyChart.tsx
│   │   │   ├── ManagerScorecard.tsx
│   │   │   ├── RAGDistribution.tsx
│   │   │   └── ResourceHeatmap.tsx
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── dashboard/           # Persona-specific views
│   │   │   ├── SeniorLeaderView.tsx
│   │   │   ├── ProjectManagerView.tsx
│   │   │   ├── ResourceManagerView.tsx
│   │   │   └── PlannerView.tsx
│   │   ├── insights/            # Insights & recommendations
│   │   │   ├── AIRecommendations.tsx
│   │   │   └── InsightCard.tsx
│   │   └── upload/              # File upload
│   │       └── FileUploader.tsx
│   ├── lib/                     # Core logic
│   │   ├── calculations.ts      # Metric calculations
│   │   └── dataProcessing.ts    # File parsing & validation
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx                  # Main application
│   └── index.css                # Global styles
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.app.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser to displayed URL (usually http://localhost:5173)

### Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Uploading Data

1. Click "Select File" or drag & drop a CSV/Excel file
2. Supported formats: CSV (.csv), Excel (.xlsx, .xls)
3. Maximum file size: 50MB

### Expected File Format

Your file should contain these columns (names will be auto-detected):
- Portfolio Name
- Project Name
- Type of Project (BL, PC, PM, WPM)
- Work Package Name
- Task ID & Name
- Functional Manager
- Planned/Actual Duration
- Assigned Resource
- Planned Budget / Total Spent
- Status (Completed, In Progress, Not Started)
- Date fields (Baseline Start/End, Planned Start/End, Actual Start/End)
- RAG Status (Red, Amber, Green)
- Resource Utilisation %
- Critical Path indicators
- Reassessment count

### Navigating Dashboards

- Use the navigation bar to switch between persona views
- Upload new data using the "Upload New File" button
- Reset the application with the "Reset" button

## Key Calculations

### Performance Score
Weighted combination of:
- Forecast Accuracy (35%)
- Duration Variance (25%)
- Generic Resource Usage (20%)
- Critical Path Health (10%)
- RAG Status (10%)

### Forecast Accuracy
```
(Tasks completed on or before planned end date / Total completed tasks) × 100
```

### Duration Variance
```
Average of [(Actual Duration - Planned Duration) / Planned Duration × 100]
```

### Critical Path Health
Based on volatility and appropriate sizing (15-25% of tasks)

## Data Validation

The application validates:
- Required fields (Task ID, Name, Project)
- Valid enum values (Project Type, Status, RAG)
- Logical date ranges
- Positive numeric values
- Duplicate detection

Warnings are shown for:
- Missing managers or resources
- Missing date fields
- Duplicate task IDs

## Development

### Code Standards

- TypeScript strict mode enabled
- No `any` types allowed
- JSDoc comments for all functions
- Error boundaries for resilience
- Loading states for async operations
- Mobile-responsive design

### Linting

```bash
npm run lint
```

### Type Checking

Type checking is performed during build. To check manually:
```bash
npx tsc -b
```

## Performance Considerations

- Chart components use React.memo for optimization
- Calculations use useMemo to prevent unnecessary recalculation
- Large datasets are handled efficiently with virtual scrolling where needed
- Bundle size: ~993KB (minified), ~307KB (gzipped)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Known Limitations

- No backend/database (in-memory only)
- Data lost on page refresh
- Client-side processing only
- No real Claude API integration (would require backend)

## Future Enhancements

- Backend API with persistent storage
- Real Claude API integration for AI insights
- Export functionality (PDF reports, Excel)
- Historical trend tracking
- User authentication
- Advanced filtering and drill-down
- Custom metric configuration
- Multi-file comparison

## License

Hackathon Project - 2025

## Support

For issues or questions, please contact the development team.

---

**Built with**: React, TypeScript, Tailwind CSS, Recharts
**Hackathon**: 2025
