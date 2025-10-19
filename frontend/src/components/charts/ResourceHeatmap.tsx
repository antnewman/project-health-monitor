/**
 * Resource Heatmap
 * Visualizes resource utilisation across managers and resources
 */

import React from 'react';

interface ResourceData {
  resource: string;
  manager: string;
  utilisation: number;
  overAllocated: boolean;
}

interface ResourceHeatmapProps {
  data: ResourceData[];
  height?: number;
}

/**
 * Gets color based on utilisation percentage
 */
const getUtilisationColor = (utilisation: number, overAllocated: boolean): string => {
  if (overAllocated || utilisation > 100) return 'bg-red-600';
  if (utilisation >= 90) return 'bg-orange-500';
  if (utilisation >= 70) return 'bg-green-500';
  if (utilisation >= 50) return 'bg-blue-400';
  if (utilisation >= 30) return 'bg-blue-300';
  return 'bg-gray-200';
};

/**
 * Gets text color for contrast
 */
const getTextColor = (utilisation: number): string => {
  return utilisation >= 30 ? 'text-white' : 'text-gray-700';
};

/**
 * Resource Heatmap Component
 */
export const ResourceHeatmap: React.FC<ResourceHeatmapProps> = ({
  data,
  height = 400
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No resource data available</p>
      </div>
    );
  }

  // Get unique managers and resources
  const managers = [...new Set(data.map(d => d.manager))].sort();
  const resources = [...new Set(data.map(d => d.resource))].sort();

  // Create a map for quick lookup
  const dataMap = new Map<string, ResourceData>();
  data.forEach(item => {
    dataMap.set(`${item.manager}-${item.resource}`, item);
  });

  return (
    <div className="w-full overflow-auto" style={{ maxHeight: height }}>
      <div className="inline-block min-w-full">
        <div className="grid gap-1" style={{ gridTemplateColumns: `150px repeat(${resources.length}, 80px)` }}>
          {/* Header row */}
          <div className="sticky left-0 bg-white z-10 p-2 font-semibold text-sm border-b-2 border-gray-300">
            Manager / Resource
          </div>
          {resources.map((resource, idx) => (
            <div
              key={idx}
              className="p-2 font-semibold text-xs bg-gray-100 border-b-2 border-gray-300 text-center"
              title={resource}
            >
              <div className="truncate">{resource}</div>
            </div>
          ))}

          {/* Data rows */}
          {managers.map((manager, mIdx) => (
            <React.Fragment key={mIdx}>
              <div className="sticky left-0 bg-white z-10 p-2 text-sm font-medium border-r border-gray-300">
                <div className="truncate" title={manager}>{manager}</div>
              </div>
              {resources.map((resource, rIdx) => {
                const cellData = dataMap.get(`${manager}-${resource}`);
                if (cellData) {
                  return (
                    <div
                      key={rIdx}
                      className={`p-2 text-center text-xs font-semibold cursor-pointer transition-all hover:opacity-80 ${getUtilisationColor(cellData.utilisation, cellData.overAllocated)} ${getTextColor(cellData.utilisation)}`}
                      title={`${resource} - ${manager}\nUtilisation: ${cellData.utilisation.toFixed(0)}%${cellData.overAllocated ? ' (Over-allocated)' : ''}`}
                    >
                      {cellData.utilisation.toFixed(0)}%
                    </div>
                  );
                }
                return <div key={rIdx} className="bg-gray-50" />;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200" />
          <span>&lt;30%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300" />
          <span>30-49%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400" />
          <span>50-69%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500" />
          <span>70-89%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500" />
          <span>90-100%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600" />
          <span>&gt;100% (Over-allocated)</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceHeatmap;
