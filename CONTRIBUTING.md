# 🤝 Contributing to Project Health Monitor

Thank you for considering contributing to the Project Health Monitor! This project was built as a learning resource for the hackathon community, and we welcome contributions from developers of all skill levels.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes**:
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

---

## Getting Started

### Prerequisites

1. **Read the documentation**:
   - [README.md](README.md) - Project overview
   - [SETUP.md](docs/SETUP.md) - Local development setup
   - [DATA_FORMAT.md](docs/DATA_FORMAT.md) - Data specifications

2. **Set up your development environment**:
   ```bash
   git clone https://github.com/tortoiseai/project-health-monitor.git
   cd project-health-monitor
   npm install
   npm run dev
   ```

3. **Find an issue to work on**:
   - Check [Good First Issues](https://github.com/tortoiseai/project-health-monitor/labels/good%20first%20issue)
   - Look for issues labeled `help wanted`
   - Or propose a new feature via [Discussions](https://github.com/tortoiseai/project-health-monitor/discussions)

---

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 🐛 Bug Reports

Found a bug? Help us fix it!

**Before submitting**:
- Check if the issue already exists
- Try to reproduce it in a clean environment
- Gather as much information as possible

**What to include**:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser/OS information
- Error messages from console

**Template**:
```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Version: [e.g., 1.0.0]
```

#### ✨ Feature Requests

Have an idea for a new feature?

**Before submitting**:
- Check if it's already requested
- Discuss in [GitHub Discussions](https://github.com/tortoiseai/project-health-monitor/discussions) first
- Consider if it aligns with project goals

**What to include**:
- Problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Mockups/wireframes (if applicable)
- Impact on existing users

#### 📖 Documentation

Improvements to docs are always welcome!

**Ideas**:
- Fix typos or unclear explanations
- Add examples or tutorials
- Translate documentation
- Create video guides
- Add diagrams or screenshots

#### 🎨 Code Contributions

Ready to code? Here's how:

**Good first contributions**:
- Add new chart types
- Improve error messages
- Add data validation rules
- Enhance mobile responsiveness
- Add keyboard shortcuts
- Improve accessibility
- Write unit tests

**Advanced contributions**:
- New AI prompt templates
- Additional analytics algorithms
- Performance optimizations
- New dashboard views
- Integration with other tools

---

## Development Guidelines

### Branching Strategy

```bash
# Create a feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(dashboard): add timeline chart to project view

fix(upload): handle Excel files with special characters

docs(readme): add installation troubleshooting section

refactor(calculations): optimize forecast accuracy algorithm
```

### Code Style

#### TypeScript

```typescript
// ✅ Good: Explicit types
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

// ❌ Bad: Using 'any'
function greetUser(user: any): any {
  return `Hello, ${user.name}!`;
}
```

#### React Components

```typescript
// ✅ Good: Functional component with TypeScript
interface Props {
  title: string;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ title, onClose }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// ❌ Bad: No type safety
export const Modal = (props) => {
  return <div>{props.title}</div>;
};
```

#### File Organization

```typescript
// ✅ Good: Imports organized
import React, { useState, useEffect } from 'react'; // React
import { KPICard } from '@/components/common/KPICard'; // Internal components
import { calculateMetrics } from '@/lib/calculations'; // Utils
import type { Task } from '@/types'; // Types

// ❌ Bad: Random import order
import type { Task } from '@/types';
import React from 'react';
import { calculateMetrics } from '@/lib/calculations';
```

### Code Quality Checks

Before submitting:

```bash
# Type check
npm run typecheck

# Build to verify no errors
npm run build

# Test in browser
npm run dev
```

---

## Pull Request Process

### 1. Prepare Your PR

**Checklist**:
- [ ] Code follows project conventions
- [ ] TypeScript types are defined (no `any`)
- [ ] Code builds without errors (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Self-reviewed the changes
- [ ] Tested in browser

### 2. Create Pull Request

**Title format**:
```
feat: Add timeline chart to project view
fix: Handle Excel files with special characters
docs: Update installation guide
```

**Description template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How did you test this?

## Screenshots
If applicable

## Checklist
- [ ] TypeScript types defined
- [ ] Builds without errors
- [ ] Documentation updated
- [ ] Self-reviewed
```

### 3. Code Review Process

**What to expect**:
- Maintainer will review within 3-5 business days
- May request changes or clarifications
- Be responsive to feedback
- Once approved, PR will be merged

**Review criteria**:
- Code quality and readability
- Adherence to project conventions
- Performance impact
- Breaking changes (if any)
- Documentation completeness

### 4. After Merge

- Your contribution will be included in the next release
- You'll be added to CONTRIBUTORS.md
- Celebrate! 🎉

---

## Coding Standards

### TypeScript

**Rules**:
- ✅ Use explicit types for all functions
- ✅ Define interfaces for objects
- ✅ Use `const` instead of `let` when possible
- ✅ Avoid `any` type
- ✅ Use optional chaining (`?.`) and nullish coalescing (`??`)

**Example**:
```typescript
// ✅ Good
interface Task {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  assignedTo?: string; // Optional property
}

function getTaskStatus(task: Task): string {
  return task.status ?? 'unknown';
}

// ❌ Bad
function getTaskStatus(task: any) {
  return task.status || 'unknown';
}
```

### React

**Rules**:
- ✅ Use functional components
- ✅ Use hooks (useState, useEffect, useMemo, etc.)
- ✅ Memoize expensive calculations
- ✅ Use meaningful component names
- ✅ Extract reusable logic to custom hooks

**Example**:
```typescript
// ✅ Good: Memoized calculation
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => a.name.localeCompare(b.name));
}, [tasks]);

// ❌ Bad: Recalculates on every render
const sortedTasks = tasks.sort((a, b) => a.name.localeCompare(b.name));
```

### CSS/Tailwind

**Rules**:
- ✅ Use Tailwind utility classes
- ✅ Extract repeated patterns to components
- ✅ Use consistent spacing (multiples of 4)
- ✅ Follow mobile-first responsive design

**Example**:
```tsx
// ✅ Good: Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <span className="text-gray-700 font-medium">Hello</span>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '16px', background: 'white' }}>
  <span style={{ color: '#374151' }}>Hello</span>
</div>
```

---

## Testing Guidelines

### Manual Testing

**Before submitting PR**:
1. **Upload test**: Try various Excel/CSV formats
2. **Navigation test**: Click through all 4 views
3. **AI test**: Generate insights (if you have API key)
4. **Responsive test**: Check on mobile/tablet sizes
5. **Error handling**: Test with invalid data

### Browser Compatibility

Test on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ Mobile browsers

### Future: Automated Tests

We're working on adding:
- Unit tests (Jest/Vitest)
- Component tests (React Testing Library)
- E2E tests (Playwright/Cypress)

Contributions to testing infrastructure are highly welcome!

---

## Documentation

### When to Update Docs

Update documentation when you:
- Add a new feature
- Change existing functionality
- Fix a bug that affects usage
- Add/remove dependencies

### What to Update

| Change | Files to Update |
|--------|----------------|
| New feature | README.md, USER_GUIDE.md |
| Data format change | DATA_FORMAT.md |
| Setup change | SETUP.md |
| New dependency | README.md (tech stack), package.json |
| Algorithm change | README.md (if user-facing), code comments |

### Documentation Style

**Clear and concise**:
```markdown
✅ Good:
## Upload a File
1. Click "Select File" or drag & drop
2. Choose an Excel (.xlsx) or CSV file
3. Wait for processing
4. View results in the dashboard

❌ Bad:
## File Upload
You can upload files by clicking the button or using drag and drop functionality.
The system supports multiple formats.
```

**Use examples**:
```markdown
✅ Good:
Column names are flexible. For example:
- "Project Name" = "projectName" = "project"
- "Planned Start" = "plannedStart" = "Start Date"

❌ Bad:
The system uses fuzzy matching for column names.
```

---

## Recognition

All contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Thanked on social media (if you opt-in)
- Part of the open-source community! 🎉

### Hall of Fame

Top contributors may receive:
- Special "Contributor" badge
- Featured in project showcase
- Invitation to maintain the project

---

## Questions?

- 💬 **Discussions**: [GitHub Discussions](https://github.com/tortoiseai/project-health-monitor/discussions)
- 📧 **Email**: support@tortoiseai.co.uk
- 🐛 **Issues**: [GitHub Issues](https://github.com/tortoiseai/project-health-monitor/issues)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Project Health Monitor!** 🐢

Every contribution, no matter how small, helps hackathon teams worldwide build better projects.

*Steady progress. Lasting results.*
