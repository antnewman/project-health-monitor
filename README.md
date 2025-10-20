# 🐢 Project Health & Behaviour Monitor

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://projecthealthmonitor.tortoiseai.co.uk)
[![Build Status](https://img.shields.io/badge/build-passing-success?style=for-the-badge)](https://github.com/tortoiseai/project-health-monitor)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Made for Hackathons](https://img.shields.io/badge/Made%20for-Hackathons-orange?style=for-the-badge)](https://projecthealthmonitor.tortoiseai.co.uk)

> **AI-Powered Behavioral Analytics for Project Management Excellence**
>
> Instantly identify poor planning patterns, predict project failures before they happen, and get personalized coaching—all powered by Claude AI. Built for the Projecting Success Hackathon, now available as an open-source tool for teams worldwide.

**🚀 [Try Live Demo](https://projecthealthmonitor.tortoiseai.co.uk) | 📊 [View Sample Data](docs/sample-data) | 📖 [Read Full Docs](docs/)**

---

## 📸 Preview

<img width="861" height="641" alt="image" src="https://github.com/user-attachments/assets/063e9549-b46f-46e8-98f9-cace4c5be43c" />

<img width="909" height="629" alt="image" src="https://github.com/user-attachments/assets/71692740-c826-4a42-956c-79cd6de99011" />

---

## 🎯 The Problem

Project failures don't happen overnight—they're the result of **systematic planning behaviors** that accumulate over time:

- 📉 **Chronic Optimism**: Teams consistently underestimate task duration by 20-30%
- 🎭 **Generic Resource Overuse**: 70%+ of tasks assigned to "Resource_Generic" instead of named people
- 🌊 **Critical Path Instability**: Plans change 5+ times per task, creating delivery chaos
- 💼 **Resource Hoarding**: Managers claim resources but utilize them at <60%

Traditional project management tools show you **what went wrong**. This tool shows you **why it's going wrong** and **how to fix it**.

---

## ✨ The Solution

**Project Health Monitor** is an AI-powered behavioral analytics platform that:

1. **📤 Ingests** your project management data (Excel, CSV) in seconds
2. **🔍 Analyzes** behavioral patterns using advanced algorithms
3. **🤖 Generates** personalized insights with Claude AI
4. **📊 Visualizes** risks across 4 role-specific dashboards
5. **🎓 Coaches** teams with actionable, time-bound recommendations

### Why This Tool Stands Out

- ✅ **AI-Powered**: Uses Claude Sonnet 4 for natural language insights
- ✅ **Persona-Based**: 4 specialized views (Senior Leader, Project Manager, Resource Manager, Planner)
- ✅ **Behavioral Focus**: Detects patterns, not just outcomes
- ✅ **Actionable**: Every insight includes specific next steps
- ✅ **Zero Setup**: Works instantly in your browser
- ✅ **Privacy First**: Your data never leaves your browser (client-side only)

---

## 🏆 Built for Hackathons

### Projecting Success Hackathon - Challenge 5

**Sponsor**: Thales
**Challenge**: Risky Resource Routines
**Developer**: [TortoiseAI](https://tortoiseai.co.uk)
**Purpose**: Demonstrate behavioral analytics in project management

This tool was built as a **demonstration and learning resource** for hackathon participants. It's now open-sourced so other teams can:

- 🎓 Learn modern web development patterns (React, TypeScript, AI integration)
- 🔧 Use it in their own projects
- 🚀 Build upon it for future hackathons
- 📚 Study real-world AI implementation

---

## 🚀 Quick Start (60 Seconds)

### Option 1: Use the Live Demo (Fastest)

1. **Visit** → [projecthealthmonitor.tortoiseai.co.uk](https://projecthealthmonitor.tortoiseai.co.uk)
2. **Download** → [Sample Excel Data](docs/sample-data/Fake%20Dataset%2026.05%20V2.xlsx)
3. **Upload** → Drag & drop the file or click "Select File"
4. **Explore** → Navigate through the 4 persona views
5. **Generate AI Insights** → Click "Generate Insights" in any view (requires Claude API key)

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/tortoiseai/project-health-monitor.git
cd project-health-monitor

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Claude API key to .env

# Start development server
npm run dev

# Open http://localhost:5173
```

See [SETUP.md](docs/SETUP.md) for detailed installation instructions.

---

## 📊 Features in Detail

### 1. 📤 Intelligent File Upload

**What it does**: Drag & drop Excel/CSV files with automatic column detection

**Why it matters**: No data transformation needed—works with your existing exports

**Key Features**:
- Smart column name normalization ("Portfolio Name" = "portfolioName" = "portfolio")
- Validates data quality and shows warnings
- Handles date formats automatically (Excel serial dates, ISO strings, etc.)
- Supports files up to 50MB

**Use Case**: Export from Microsoft Project, Jira, or any PM tool → Upload → Instant analysis

---

### 2. 🎯 Senior Leader View

**For**: C-suite executives, PMO directors, portfolio managers

**What you see**:
- Portfolio KPIs (forecast accuracy, generic resource %, RAG distribution)
- Manager performance league table
- Systemic behavioral patterns
- AI-generated executive summary

**AI Insights**:
- Top 2-3 critical issues affecting delivery
- Business impact analysis
- Strategic recommendations

*[Screenshot placeholder: Senior Leader dashboard with AI insights panel]*

**Example Insight**:
> "The portfolio exhibits chronic optimism with 72% generic resource usage creating a significant delivery risk multiplier. Three managers account for 80% of the problem. Recommend implementing mandatory named resource assignments 4+ weeks before task start, beginning with the Digital Transformation portfolio where the impact will be highest."

---

### 3. 🎯 Project Manager View

**For**: Project managers, work package leads

**What you see**:
- Project selector (analyze any project)
- At-risk tasks with risk factors
- Critical path health analysis
- Manager forecast accuracy comparison

**AI Insights**:
- Urgent interventions needed this week
- Specific actions for the next 5 business days
- Risk mitigation strategies

*[Screenshot placeholder: Project Manager view with risk table]*

**Example Insight**:
> "Project Phoenix shows 23 tasks at Red status with 67% on the critical path. Immediate action required: (1) Convert 15 generic resources to named by Friday, (2) Review dependencies on tasks CRT-001 through CRT-005 with high volatility, (3) Schedule emergency stakeholder alignment on scope creep affecting 8 tasks."

---

### 4. 👥 Resource Manager View

**For**: Resource managers, capacity planners

**What you see**:
- Resource utilization heatmap
- Generic vs. named resource breakdown
- Over-allocated and under-utilized resources
- Capacity planning insights

**AI Insights**:
- 4-week conversion plan for generic resources
- Capacity optimization strategies
- Resource allocation improvements

*[Screenshot placeholder: Resource heatmap visualization]*

**Example Insight**:
> "Your 87% generic resource usage creates planning fiction—teams think resources are allocated when they're not. Week 1: Identify top 10 most-used generic resources and find named replacements. Week 2: Implement soft booking system. Week 3: Require resource manager approval for any generic assignment >2 weeks out. Week 4: Measure and celebrate improvements."

---

### 5. 📈 Planner View

**For**: Individual planners, work package managers

**What you see**:
- Personal performance scorecard
- Peer comparison (anonymized)
- Forecast accuracy by project
- Planning anti-patterns detection

**AI Insights**:
- Personalized coaching on strengths
- Specific improvement areas
- Actionable suggestions

*[Screenshot placeholder: Planner scorecard with coaching panel]*

**Example Insight**:
> "Your forecast accuracy of 63% is below the 70% portfolio average, driven primarily by duration variance (+24%). You excel at resource planning (only 12% generic, vs 72% portfolio average)—leverage this strength. To improve: Add 25% buffer to initial estimates based on your historical data, and implement weekly checkpoint reviews for tasks >5 days."

---

### 6. 🤖 AI-Powered Insights

**Powered by**: Claude Sonnet 4 (Anthropic)

**What makes it special**:
- Natural language analysis (not just charts)
- Context-aware (understands your specific situation)
- Persona-tailored (different insights for different roles)
- Actionable (specific next steps, not generic advice)

**5 Specialized AI Functions**:

1. **Executive Summary**: Portfolio-wide systemic issues for leadership
2. **Manager Coaching**: Personalized feedback for individual planners
3. **Project Recommendations**: Urgent interventions for at-risk projects
4. **Behavioral Patterns**: Organizational culture analysis
5. **Resource Strategy**: Capacity planning and allocation optimization

**Example Usage**:
```typescript
// Senior Leader requests insights
const summary = await generateExecutiveSummary(portfolioMetrics, tasks);
// Returns 3-4 paragraphs of C-suite appropriate analysis
```

---

## 💡 For Hackathon Participants

### How to Use This Tool in Your Hackathon

#### Scenario 1: Project Management Challenge
**Your Goal**: Analyze project data and present findings

1. **Prepare Data**: Export your project data to Excel/CSV ([see format guide](docs/DATA_FORMAT.md))
2. **Upload**: Use this tool to analyze it instantly
3. **Generate Insights**: Click AI buttons to get professional analysis
4. **Present**: Use the dashboards in your demo (they look impressive!)
5. **Explain**: "We used behavioral analytics to identify that 78% of delays stem from generic resource usage..."

#### Scenario 2: Learning AI Integration
**Your Goal**: Understand how to integrate AI into web apps

1. **Study**: Review `src/lib/claudeAPI.ts` to see how we call Claude
2. **Learn**: Understand prompt engineering in our AI functions
3. **Experiment**: Modify prompts to generate different insights
4. **Build**: Use this as a template for your own AI features

#### Scenario 3: Building a Competitor Tool
**Your Goal**: Create your own version with unique features

1. **Fork**: Clone this repository as your starting point
2. **Customize**: Change the analytics algorithms
3. **Extend**: Add new visualizations or data sources
4. **Differentiate**: Focus on a specific industry or use case

### Tips for Impressive Demos

✅ **Use Real Data**: Even synthetic data from this tool looks professional
✅ **Tell Stories**: "This red spike shows when the team switched to generic resources..."
✅ **Show AI**: Generate insights live during your demo
✅ **Explain Impact**: "This would save 3 weeks per project by identifying risks early"
✅ **Compare Before/After**: Show how implementing recommendations improves metrics

---

## 📋 Data Format Guide

### Required Columns

Your Excel/CSV file must include these columns:

| Column Name | Data Type | Example | Description |
|------------|-----------|---------|-------------|
| **Project Name** | Text | "Digital Transformation" | Name of the project |
| **Task Name** | Text | "Design UI Mockups" | Name of the task |
| **Task ID** | Text | "TASK-001" | Unique identifier |
| **Status** | Text | "Completed" | One of: Completed, In Progress, Not Started |
| **Functional Manager** | Text | "Sarah Johnson" | Person responsible for planning |
| **Assigned Resource** | Text | "John Doe" or "Resource_Generic" | Who's doing the work |

### Optional Columns (Unlock More Features)

| Column Name | Data Type | Example | Unlocks |
|------------|-----------|---------|---------|
| Planned Start/End | Date | "2025-01-15" | Forecast accuracy calculation |
| Actual Start/End | Date | "2025-01-18" | Duration variance analysis |
| Planned Duration | Number | 5 | Duration analysis |
| Actual Duration | Number | 7 | Duration variance |
| Project Health (RAG) | Text | "Red", "Amber", "Green" | RAG distribution charts |
| Critical Path Risk | Boolean | TRUE/FALSE | Critical path analysis |
| Planned Budget | Number | 10000 | Budget variance |
| Total Spent | Number | 12000 | Over-budget detection |

### Column Name Flexibility

The tool auto-detects variations:
- "Portfolio Name" = "portfolioName" = "portfolio" = "Portfolio"
- "Planned Start Date" = "plannedStart" = "Planned Start" = "Start Date (Planned)"

**Full specification**: [DATA_FORMAT.md](docs/DATA_FORMAT.md)

**Download sample**: [Fake Dataset 26.05 V2.xlsx](docs/sample-data/Fake%20Dataset%2026.05%20V2.xlsx)

---

## 🏗️ Architecture & Technology Stack

### Frontend
- ⚛️ **React 19** - UI framework
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool & dev server
- 🎨 **Tailwind CSS** - Styling
- 📊 **Recharts** - Data visualization

### AI Integration
- 🤖 **Claude Sonnet 4** (Anthropic) - Natural language insights
- 🔗 **@anthropic-ai/sdk** - Official Anthropic SDK

### Data Processing
- 📄 **xlsx** - Excel file parsing
- 📊 **papaparse** - CSV parsing
- 🧮 **Custom algorithms** - Behavioral analytics

### Deployment
- 🌐 **Netlify** - Hosting & CDN
- 🔒 **Client-side only** - No backend, your data stays private

---

## 🤝 Contributing

We welcome contributions from the community! This project is designed to be:

- 📚 **Educational**: Learn by contributing
- 🌍 **Open**: All skill levels welcome
- 🚀 **Impactful**: Help hackathon teams worldwide

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Ideas

- 🎨 New visualizations (timeline charts, heatmaps, etc.)
- 🤖 Additional AI prompt templates
- 📊 New analytics algorithms
- 🌍 Internationalization (i18n)
- 📱 Mobile responsiveness improvements
- 📖 Documentation enhancements
- 🧪 Test coverage
- ♿ Accessibility improvements

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use, modify, and distribute this project freely, even commercially. Just keep the copyright notice.

---

## 🙏 Acknowledgments

### Built For
- **Projecting Success Hackathon** - Challenge 5: Risky Resource Routines
- **Thales** - Hackathon sponsor

### Powered By
- **Anthropic** - Claude AI for natural language insights
- **React** - UI framework
- **Vite** - Build tooling
- **Netlify** - Hosting
- **Open Source Community** - All the amazing libraries we use

### Developed By
**TortoiseAI** - [tortoiseai.co.uk](https://tortoiseai.co.uk)

> *"Steady progress. Lasting results."*
> Demystifying AI adoption through patient, expert guidance.

---

## 📞 Support & Contact

### For Hackathon Participants

- 💬 **Discord**: [Join our community](#) (coming soon)
- 📧 **Email**: support@tortoiseai.co.uk
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/tortoiseai/project-health-monitor/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/tortoiseai/project-health-monitor/discussions)

### For General Inquiries

- 🌐 **Website**: [tortoiseai.co.uk](https://tortoiseai.co.uk)
- 🐦 **Twitter**: [@TortoiseAI](#) (coming soon)
- 💼 **LinkedIn**: [TortoiseAI](#) (coming soon)

---

## ⭐ Star History

If you find this tool useful, please consider:

1. ⭐ **Starring** the repository
2. 🍴 **Forking** to use in your projects
3. 📢 **Sharing** with your network
4. 🐛 **Reporting** issues or bugs
5. 💡 **Suggesting** new features

Every star helps other hackathon participants find this tool!

---

<div align="center">

**Made with ❤️ by [TortoiseAI](https://tortoiseai.co.uk) for the hackathon community**

🐢 *Steady progress. Lasting results.*

[Live Demo](https://projecthealthmonitor.tortoiseai.co.uk) • [Documentation](docs/) • [Report Bug](https://github.com/tortoiseai/project-health-monitor/issues) • [Request Feature](https://github.com/tortoiseai/project-health-monitor/discussions)

</div>
