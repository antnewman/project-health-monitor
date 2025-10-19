/**
 * Resource Manager Dashboard View
 * Resource utilisation, capacity planning, allocation recommendations
 */

import type { Task } from '@/types';
import { KPICard } from '@/components/common/KPICard';
import { Badge } from '@/components/common/Badge';
import { ResourceHeatmap } from '@/components/charts/ResourceHeatmap';
import { Users, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

interface ResourceManagerViewProps {
  tasks: Task[];
}

/**
 * Resource Manager View Component
 */
export const ResourceManagerView: React.FC<ResourceManagerViewProps> = ({ tasks }) => {
  // Calculate resource metrics
  const resourceMetrics = useMemo(() => {
    const resourceMap = new Map<string, {
      totalHours: number;
      plannedHours: number;
      projects: Set<string>;
      managers: Set<string>;
      utilisationPct: number;
    }>();

    tasks.forEach(task => {
      if (!task.assignedResource) return;

      if (!resourceMap.has(task.assignedResource)) {
        resourceMap.set(task.assignedResource, {
          totalHours: 0,
          plannedHours: 0,
          projects: new Set(),
          managers: new Set(),
          utilisationPct: 0
        });
      }

      const resource = resourceMap.get(task.assignedResource)!;
      resource.totalHours += task.actualHours || 0;
      resource.plannedHours += task.forecastHours || 0;
      resource.projects.add(task.projectName);
      resource.managers.add(task.functionalManager);
      resource.utilisationPct = task.resourceUtilisation || 0;
    });

    return Array.from(resourceMap.entries()).map(([name, data]) => ({
      resource: name,
      totalHours: data.totalHours,
      plannedHours: data.plannedHours,
      projectCount: data.projects.size,
      managerCount: data.managers.size,
      utilisationPct: data.utilisationPct,
      overAllocated: data.utilisationPct > 100,
      isGeneric: /resource_|generic|tbd|unassigned|placeholder/i.test(name)
    }));
  }, [tasks]);

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    const data: Array<{
      resource: string;
      manager: string;
      utilisation: number;
      overAllocated: boolean;
    }> = [];

    const managers = [...new Set(tasks.map(t => t.functionalManager))];
    const resources = [...new Set(tasks.map(t => t.assignedResource))].filter(r => r);

    resources.forEach(resource => {
      managers.forEach(manager => {
        const managerTasks = tasks.filter(
          t => t.assignedResource === resource && t.functionalManager === manager
        );

        if (managerTasks.length > 0) {
          const avgUtil = managerTasks.reduce((sum, t) => sum + (t.resourceUtilisation || 0), 0) / managerTasks.length;
          data.push({
            resource,
            manager,
            utilisation: avgUtil,
            overAllocated: avgUtil > 100
          });
        }
      });
    });

    return data;
  }, [tasks]);

  const totalResources = resourceMetrics.length;
  const genericResources = resourceMetrics.filter(r => r.isGeneric).length;
  const overAllocated = resourceMetrics.filter(r => r.overAllocated).length;
  const underUtilised = resourceMetrics.filter(r => r.utilisationPct < 60).length;
  const avgUtilisation = resourceMetrics.length > 0
    ? resourceMetrics.reduce((sum, r) => sum + r.utilisationPct, 0) / resourceMetrics.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Resource Management Dashboard</h1>
        <p className="text-green-100">
          Resource allocation, capacity planning, and utilisation analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Resources"
          value={totalResources}
          subtitle={`${genericResources} generic (${((genericResources / totalResources) * 100).toFixed(0)}%)`}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Average Utilisation"
          value={`${avgUtilisation.toFixed(1)}%`}
          subtitle="Target: 70-85%"
          icon={<UserCheck className="w-5 h-5" />}
          color={avgUtilisation >= 70 && avgUtilisation <= 85 ? 'green' : avgUtilisation < 70 ? 'amber' : 'red'}
        />
        <KPICard
          title="Over-Allocated"
          value={overAllocated}
          subtitle={`${((overAllocated / totalResources) * 100).toFixed(0)}% of resources`}
          icon={<AlertCircle className="w-5 h-5" />}
          color={overAllocated === 0 ? 'green' : overAllocated <= 3 ? 'amber' : 'red'}
        />
        <KPICard
          title="Under-Utilised"
          value={underUtilised}
          subtitle="<60% utilisation"
          icon={<UserX className="w-5 h-5" />}
          color={underUtilised === 0 ? 'green' : underUtilised <= 3 ? 'amber' : 'red'}
        />
      </div>

      {/* Alerts */}
      {(overAllocated > 0 || genericResources > totalResources * 0.5) && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Resource Allocation Issues Detected</h3>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                {overAllocated > 0 && (
                  <li>{overAllocated} resource(s) over-allocated (&gt;100% utilisation)</li>
                )}
                {genericResources > totalResources * 0.5 && (
                  <li>High generic resource usage: {((genericResources / totalResources) * 100).toFixed(0)}% of resources are generic placeholders</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Resource Utilisation Heatmap */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resource Utilisation Heatmap</h2>
        <p className="text-sm text-gray-600 mb-4">
          Shows resource allocation across managers. Darker colors indicate higher utilisation.
        </p>
        <ResourceHeatmap data={heatmapData} height={500} />
      </div>

      {/* Generic Resources Alert */}
      {genericResources > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generic Resource Assignments</h2>
          <p className="text-sm text-gray-600 mb-4">
            {genericResources} generic resource placeholder(s) detected. These should be replaced with named resources.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Managers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resourceMetrics.filter(r => r.isGeneric).slice(0, 20).map((resource, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{resource.resource}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{resource.projectCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{resource.managerCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{resource.totalHours.toFixed(0)}h</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="warning" size="sm">Assign Named Resource</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Over-Allocated Resources */}
      {overAllocated > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Over-Allocated Resources</h2>
          <p className="text-sm text-gray-600 mb-4">
            Resources with &gt;100% utilisation require immediate attention
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resourceMetrics.filter(r => r.overAllocated).map((resource, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{resource.resource}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-bold text-red-600">{resource.utilisationPct.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{resource.projectCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{resource.totalHours.toFixed(0)}h</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="danger" size="sm">Over-Allocated</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Resources Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resource Capacity Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours (Actual)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours (Planned)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resourceMetrics.slice(0, 50).map((resource, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{resource.resource}</td>
                  <td className="px-4 py-3 text-sm">
                    {resource.isGeneric ? (
                      <Badge variant="warning" size="sm">Generic</Badge>
                    ) : (
                      <Badge variant="success" size="sm">Named</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            resource.utilisationPct > 100 ? 'bg-red-600' :
                            resource.utilisationPct >= 85 ? 'bg-amber-500' :
                            resource.utilisationPct >= 70 ? 'bg-green-500' :
                            resource.utilisationPct >= 50 ? 'bg-blue-400' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(resource.utilisationPct, 100)}%` }}
                        />
                      </div>
                      <span className={`font-medium ${
                        resource.utilisationPct > 100 ? 'text-red-600' :
                        resource.utilisationPct >= 85 ? 'text-amber-600' :
                        resource.utilisationPct >= 70 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {resource.utilisationPct.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resource.projectCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resource.totalHours.toFixed(0)}h</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resource.plannedHours.toFixed(0)}h</td>
                  <td className="px-4 py-3 text-sm">
                    {resource.overAllocated ? (
                      <Badge variant="danger" size="sm">Over</Badge>
                    ) : resource.utilisationPct < 60 ? (
                      <Badge variant="info" size="sm">Under</Badge>
                    ) : (
                      <Badge variant="success" size="sm">Optimal</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resource Planning Recommendations</h2>
        <div className="space-y-3">
          {genericResources > totalResources * 0.3 && (
            <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">High Generic Resource Usage</p>
                <p className="text-sm text-amber-800">
                  {((genericResources / totalResources) * 100).toFixed(0)}% of resources are generic. Require named resource assignments at least 4 weeks before task start.
                </p>
              </div>
            </div>
          )}
          {overAllocated > 0 && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Over-Allocated Resources Detected</p>
                <p className="text-sm text-red-800">
                  {overAllocated} resource(s) over-allocated. Review workload distribution and consider resource sharing or hiring.
                </p>
              </div>
            </div>
          )}
          {underUtilised > totalResources * 0.3 && (
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Under-Utilised Resources</p>
                <p className="text-sm text-blue-800">
                  {underUtilised} resource(s) under-utilised (&lt;60%). Consider resource sharing across teams or workload rebalancing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceManagerView;
