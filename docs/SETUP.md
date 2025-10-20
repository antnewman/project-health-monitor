# 🔧 Setup Guide

Complete guide to setting up the Project Health Monitor for local development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Recommended | Download Link |
|----------|----------------|-------------|---------------|
| **Node.js** | 18.x | 20.x or later | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x | 10.x or later | Comes with Node.js |
| **Git** | 2.x | Latest | [git-scm.com](https://git-scm.com/) |

### Optional Tools

- **VS Code** - Recommended IDE ([code.visualstudio.com](https://code.visualstudio.com/))
- **Claude API Key** - For AI insights ([console.anthropic.com](https://console.anthropic.com/))

### Verify Installation

```bash
# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check npm version
npm --version
# Should show 9.x.x or higher

# Check Git version
git --version
# Should show 2.x.x or higher
```

---

## Installation

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/tortoiseai/project-health-monitor.git

# OR using SSH
git clone git@github.com:tortoiseai/project-health-monitor.git

# Navigate to the project directory
cd project-health-monitor
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - React 19
# - TypeScript
# - Vite 7
# - Tailwind CSS 4
# - Recharts 3
# - @anthropic-ai/sdk
# - xlsx, papaparse
# - And all other dependencies
```

**Expected output**:
```
added 340 packages, and audited 341 packages in 15s

74 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Verify Installation

```bash
# Check if node_modules exists
ls node_modules

# Run type checking
npm run typecheck
# Should complete without errors
```

---

## Environment Configuration

### Step 1: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# OR manually create .env file
touch .env
```

### Step 2: Configure Claude API (Optional)

The AI insights feature requires a Claude API key from Anthropic.

#### Get Your Claude API Key

1. **Sign up**: Visit [console.anthropic.com](https://console.anthropic.com/)
2. **Create API key**: Navigate to API Keys section
3. **Copy key**: Starts with `sk-ant-`
4. **Save key**: You won't be able to see it again!

#### Add API Key to .env

Open `.env` file and add:

```env
VITE_CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
```

**Important Notes**:
- The `VITE_` prefix is **required** for Vite to expose the variable to the browser
- **Never commit** `.env` to version control (it's in `.gitignore`)
- For production, use environment variables in your hosting platform

### Step 3: Optional Configuration

```env
# Claude API Key (required for AI insights)
VITE_CLAUDE_API_KEY=sk-ant-your-key

# Supabase (if you add database functionality in future)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Environment File Example

```env
# .env.example
VITE_CLAUDE_API_KEY=your_claude_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Running the Application

### Development Mode

```bash
# Start the development server
npm run dev
```

**Expected output**:
```
  VITE v7.1.10  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Features in development mode**:
- ⚡ Hot Module Replacement (HMR)
- 🔍 TypeScript type checking
- 🎨 Tailwind CSS auto-compilation
- 📝 Source maps for debugging

### Access the Application

1. **Open browser**: Navigate to [http://localhost:5173](http://localhost:5173)
2. **Upload data**: Drag & drop an Excel/CSV file
3. **Explore views**: Click through the 4 persona dashboards
4. **Test AI**: Click "Generate Insights" (requires API key)

### Development Tips

**Hot Reload**:
- Changes to `.tsx`, `.ts`, `.css` files reload automatically
- No need to restart the server

**Type Checking**:
```bash
# Run TypeScript type checking without building
npm run typecheck
```

**Linting** (if configured):
```bash
# Run ESLint
npm run lint
```

---

## Building for Production

### Step 1: Create Production Build

```bash
# Build the application
npm run build
```

**Expected output**:
```
> frontend@0.0.0 build
> tsc -b && vite build

vite v7.1.10 building for production...
✓ 2540 modules transformed.
dist/index.html                   1.05 kB │ gzip:   0.56 kB
dist/assets/index-XXXXXXXX.css   27.37 kB │ gzip:   5.26 kB
dist/assets/index-XXXXXXXX.js 1,075.15 kB │ gzip: 327.31 kB
✓ built in 41.05s
```

### Step 2: Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

**Access**: [http://localhost:4173](http://localhost:4173)

### Build Output

The build creates a `dist/` folder:

```
dist/
├── index.html           # Entry HTML file
├── assets/
│   ├── index-XXXX.css  # Minified CSS
│   └── index-XXXX.js   # Minified JavaScript bundle
└── _redirects           # Netlify SPA routing (if exists)
```

### Build Optimization

**Current bundle size**:
- JavaScript: ~1,075 KB (minified), ~327 KB (gzipped)
- CSS: ~27 KB (minified), ~5 KB (gzipped)

**Optimization tips**:
1. **Code splitting**: Use dynamic imports for large components
2. **Tree shaking**: Vite automatically removes unused code
3. **Compression**: Enable gzip/brotli on your server

---

## Deployment

### Deploying to Netlify

#### Option 1: Deploy from Git (Recommended)

1. **Push to GitHub**: Commit your code to GitHub
2. **Connect Netlify**: Login to [netlify.com](https://netlify.com)
3. **Import project**: Click "Add new site" → "Import an existing project"
4. **Configure build**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add `VITE_CLAUDE_API_KEY`
5. **Deploy**: Click "Deploy site"

#### Option 2: Deploy from Local

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Deploying to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or link to existing project
vercel --prod
```

### Deploying to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Environment Variables in Production

**Netlify**:
1. Go to Site Settings → Environment variables
2. Add `VITE_CLAUDE_API_KEY` with your key

**Vercel**:
1. Go to Project Settings → Environment Variables
2. Add `VITE_CLAUDE_API_KEY`
3. Select "Production" environment

**GitHub Pages**:
- Use GitHub Secrets for sensitive keys
- Add to workflow YAML file

---

## Troubleshooting

### Common Issues

#### Issue 1: "Cannot find module 'react'"

**Cause**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue 2: "Port 5173 is already in use"

**Cause**: Another process using the port

**Solution**:
```bash
# Kill the process on port 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# OR use a different port
npm run dev -- --port 3000
```

#### Issue 3: TypeScript Errors After Installation

**Cause**: TypeScript cache or version mismatch

**Solution**:
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall TypeScript
npm install -D typescript@latest

# Run type check
npm run typecheck
```

#### Issue 4: "VITE_CLAUDE_API_KEY is not defined"

**Cause**: Environment variable not loaded

**Solution**:
1. Verify `.env` file exists in project root
2. Restart development server (`npm run dev`)
3. Check `.env` has correct format (no quotes around value)
4. Ensure key starts with `VITE_`

#### Issue 5: Build Fails with "Out of memory"

**Cause**: Large bundle, insufficient memory

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

#### Issue 6: AI Insights Not Working

**Symptoms**: Button click does nothing or shows error

**Diagnostics**:
1. **Check API key**: Open browser console, look for API errors
2. **Check network**: Open DevTools → Network tab
3. **Check CORS**: Ensure `dangerouslyAllowBrowser: true` in `claudeAPI.ts`

**Solutions**:
- Verify API key is correct in `.env`
- Check Anthropic console for API key status
- Ensure you have API credits

---

## Development Workflow

### Recommended VS Code Extensions

Install these for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add: New feature XYZ"

# Push to remote
git push origin feature/my-new-feature

# Create pull request on GitHub
```

### Testing Changes

```bash
# Type check
npm run typecheck

# Build to verify no errors
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
project-health-monitor/
├── docs/                    # Documentation
│   ├── DATA_FORMAT.md
│   ├── SETUP.md
│   └── ...
├── public/                  # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── charts/        # Recharts visualizations
│   │   ├── common/        # Reusable UI components
│   │   ├── dashboard/     # 4 persona views
│   │   ├── insights/      # AI recommendations
│   │   └── upload/        # File upload
│   ├── lib/               # Core logic
│   │   ├── calculations.ts     # Metrics algorithms
│   │   ├── claudeAPI.ts        # AI integration
│   │   └── dataProcessing.ts   # File parsing
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Main app component
│   ├── index.css          # Tailwind imports
│   └── main.tsx           # App entry point
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
├── index.html             # HTML entry point
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite configuration
└── README.md              # Main documentation
```

---

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server |
| **build** | `npm run build` | Create production build |
| **preview** | `npm run preview` | Preview production build |
| **typecheck** | `npm run typecheck` | Run TypeScript type checking |
| **lint** | `npm run lint` | Run ESLint (if configured) |

---

## Next Steps

After setup:

1. 📖 **Read**: [USER_GUIDE.md](USER_GUIDE.md) for usage instructions
2. 📊 **Download**: [Sample data](./sample-data) to test the app
3. 🤖 **Get API key**: [console.anthropic.com](https://console.anthropic.com/) for AI features
4. 🚀 **Build**: Start adding your own features!
5. 🤝 **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Getting Help

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/tortoiseai/project-health-monitor/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/tortoiseai/project-health-monitor/discussions)
- 📧 **Email**: support@tortoiseai.co.uk
- 📖 **Documentation**: [docs/](../)

---

**Last Updated**: January 2025
**Version**: 1.0.0
