/**
 * Empty State Component
 * Displays when no data is available
 */

import { FileX, Upload } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: 'upload' | 'empty';
}

/**
 * Empty State Component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon = 'empty'
}) => {
  const Icon = icon === 'upload' ? Upload : FileX;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
