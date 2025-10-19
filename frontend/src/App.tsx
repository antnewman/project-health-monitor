/**
 * Project Health & Behaviour Monitor - Main Application
 * Hackathon Project for detecting poor planning behaviours in project management data
 */

import { useState } from 'react';
import type { Task, ValidationResult, PersonaType } from '@/types';
import { FileUploader } from '@/components/upload/FileUploader';
import { SeniorLeaderView } from '@/components/dashboard/SeniorLeaderView';
import { ProjectManagerView } from '@/components/dashboard/ProjectManagerView';
import { ResourceManagerView } from '@/components/dashboard/ResourceManagerView';
import { PlannerView } from '@/components/dashboard/PlannerView';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Badge } from '@/components/common/Badge';
import { LayoutDashboard, Upload, Users, Target, BarChart3, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [currentView, setCurrentView] = useState<PersonaType>('senior-leader');
  const [showUploader, setShowUploader] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcessed = (newTasks: Task[], validationResult: ValidationResult) => {
    setTasks(newTasks);
    setValidation(validationResult);
    setShowUploader(false);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleReset = () => {
    setTasks([]);
    setValidation(null);
    setShowUploader(true);
    setError(null);
  };

  const navItems: Array<{ id: PersonaType; label: string; icon: React.ReactNode }> = [
    { id: 'senior-leader', label: 'Senior Leader', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'project-manager', label: 'Project Manager', icon: <Target className="w-5 h-5" /> },
    { id: 'resource-manager', label: 'Resource Manager', icon: <Users className="w-5 h-5" /> },
    { id: 'planner', label: 'Planner', icon: <BarChart3 className="w-5 h-5" /> }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-tortoise-fuchsia to-accent-green rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-deep-slate">
                    Project Health & Behaviour Monitor
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm ml-14">
                  <span className="text-gray-600">
                    Built for <span className="font-semibold text-tortoise-fuchsia">Projecting Success Hackathon</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Sponsored by <span className="font-semibold text-deep-slate">Thales</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Developed by <a href="https://tortoiseai.co.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-tortoise-fuchsia hover:underline">TortoiseAI</a>
                  </span>
                </div>
                <p className="text-sm text-gray-500 italic mt-1 ml-14">Steady progress. Lasting results.</p>
              </div>

              <div className="flex items-center gap-3">
                {tasks.length > 0 && (
                  <>
                    <Badge variant="info">
                      {tasks.length} tasks loaded
                    </Badge>
                    <button
                      onClick={() => setShowUploader(!showUploader)}
                      className="px-4 py-2 bg-tortoise-fuchsia text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload New File
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        {tasks.length > 0 && !showUploader && (
          <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-1 overflow-x-auto py-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Error Alert */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validation && validation.warnings.length > 0 && !showUploader && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">Data Quality Warnings</h3>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Success */}
        {validation && validation.valid && !showUploader && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Data Loaded Successfully</h3>
                <p className="text-sm text-green-800">
                  {validation.recordsProcessed} records processed, all validations passed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {showUploader || tasks.length === 0 ? (
            <div className="max-w-3xl mx-auto">
              {/* Hackathon Context Banner */}
              <div className="bg-gradient-to-br from-tortoise-fuchsia/5 to-accent-green/5 border border-tortoise-fuchsia/20 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-deep-slate mb-3">
                  Hackathon Challenge: Risky Resource Routines
                </h2>
                <p className="text-gray-700 mb-2">
                  <strong>Sponsor:</strong> Thales | <strong>Event:</strong> Projecting Success Hackathon
                </p>
                <p className="text-gray-600 text-sm">
                  This tool identifies poor planning behaviours in project management through behavioural analytics,
                  helping teams prevent delivery failures before they happen.
                </p>
              </div>

              <FileUploader onFileProcessed={handleFileProcessed} onError={handleError} />
            </div>
          ) : (
            <ErrorBoundary>
              {currentView === 'senior-leader' && <SeniorLeaderView tasks={tasks} />}
              {currentView === 'project-manager' && <ProjectManagerView tasks={tasks} />}
              {currentView === 'resource-manager' && <ResourceManagerView tasks={tasks} />}
              {currentView === 'planner' && <PlannerView tasks={tasks} />}
            </ErrorBoundary>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="font-semibold text-deep-slate mb-2">Hackathon</h3>
                <p className="text-sm text-gray-600">Projecting Success Hackathon</p>
                <p className="text-xs text-gray-500 mt-1">Challenge 5: Risky Resource Routines</p>
              </div>
              <div>
                <h3 className="font-semibold text-deep-slate mb-2">Sponsor</h3>
                <p className="text-sm text-gray-600">Thales</p>
                <p className="text-xs text-gray-500 mt-1">Innovation in Project Management</p>
              </div>
              <div>
                <h3 className="font-semibold text-deep-slate mb-2">Developer</h3>
                <p className="text-sm text-gray-600">
                  <a href="https://tortoiseai.co.uk" target="_blank" rel="noopener noreferrer" className="text-tortoise-fuchsia hover:underline font-semibold">
                    TortoiseAI
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-1">Demystifying AI adoption through patient, expert guidance</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              © 2025 TortoiseAI. Built for educational and demonstration purposes.
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
