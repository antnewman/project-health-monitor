# Project Health & Behaviour Monitor

> **Built for:** Projecting Success Hackathon
> **Sponsored by:** Thales
> **Developed by:** [TortoiseAI](https://tortoiseai.co.uk)
> **Challenge:** Challenge 5 - Risky Resource Routines: Pinpointing Patterns for Preventing Poor Practices

---

*Steady progress. Lasting results.* - TortoiseAI

## Overview

An AI-powered React + TypeScript dashboard for detecting poor planning behaviours in project management data through advanced metrics and behavioural analytics. This tool helps teams identify risky planning patterns and prevent project delivery failures before they happen.

## Key Features

### 🎯 Four Persona-Specific Dashboards

1. **Senior Leader View** - Portfolio-wide health overview with manager performance metrics
2. **Project Manager View** - Project-level health monitoring with risk identification
3. **Resource Manager View** - Resource allocation & capacity planning insights
4. **Planner View** - Personal performance scorecard with peer comparison

### 📊 Behavioural Metrics

- **Forecast Accuracy**: Percentage of tasks completed on time
- **Duration Variance**: Average deviation from planned duration
- **Generic Resource Usage**: Percentage of placeholder resources
- **Critical Path Health**: Stability and size of critical path
- **Resource Utilisation**: Allocation efficiency metrics

### 🤖 AI-Powered Pattern Detection

Automatically detects four key anti-patterns:
- Chronic Optimism (underestimating duration)
- Generic Resource Overuse
- Critical Path Instability
- Resource Hoarding

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3
- **Icons**: Lucide React
- **Data Processing**: xlsx, PapaParse

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Uploading Data

1. Click "Select File" or drag & drop a CSV/Excel file
2. Supported formats: CSV (.csv), Excel (.xlsx, .xls)
3. Maximum file size: 50MB

### Expected File Format

Your file should contain these columns (names will be auto-detected):
- Portfolio Name, Project Name, Type of Project
- Work Package Name, Task ID & Name
- Functional Manager, Assigned Resource
- Planned/Actual Duration, Budget Information
- Status, Date fields, RAG Status
- Resource Utilisation %, Critical Path indicators

See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for detailed documentation.

## Hackathon Challenge

**Challenge 5: Risky Resource Routines**

This solution addresses the challenge of identifying and preventing poor planning practices in project management by:

- Analyzing historical task data to detect behavioural patterns
- Providing persona-specific insights for different stakeholder roles
- Offering actionable recommendations to improve planning quality
- Highlighting systemic issues before they impact delivery

## About TortoiseAI

[TortoiseAI](https://tortoiseai.co.uk) demystifies AI adoption through patient, expert guidance. We believe in steady progress and lasting results.

**Steady progress. Lasting results.**

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── charts/      # Recharts visualizations
│   │   ├── common/      # Reusable UI components
│   │   ├── dashboard/   # Persona-specific views
│   │   ├── insights/    # AI recommendations
│   │   └── upload/      # File upload
│   ├── lib/            # Core logic
│   │   ├── calculations.ts    # Metric calculations
│   │   └── dataProcessing.ts  # File parsing
│   ├── types/          # TypeScript definitions
│   └── App.tsx         # Main application
├── tailwind.config.js  # Tailwind configuration
└── vite.config.ts      # Vite configuration
```

## Build Stats

- **Bundle Size**: ~993 KB (minified), ~307 KB (gzipped)
- **Components**: 25+ production-ready components
- **Lines of Code**: 3000+
- **TypeScript**: Strict mode, 100% type coverage

## License

Built for Projecting Success Hackathon 2025 - Educational and demonstration purposes.

## Contact

For more information about TortoiseAI's services and solutions, visit [tortoiseai.co.uk](https://tortoiseai.co.uk)

---

© 2025 TortoiseAI | Projecting Success Hackathon | Sponsored by Thales
